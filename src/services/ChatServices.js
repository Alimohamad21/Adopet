import firestore from '@react-native-firebase/firestore';
import Chat from '../models/Chat';
import NotificationServices from './NotificationServices';

import {firebase} from '@react-native-firebase/auth';
import {encryptRSA, getPrivateKey, sign} from '../utilities/securityUtilities';
import UserServices from './UserServices';

const {FieldValue} = firestore;

class ChatServices {

    static async getChat(userThatPostedId, userThatRequestedId, postId,currentUserId) {
        const snapshot = await firestore().collection('chats')
            .where('userThatPostedId', '==', userThatPostedId)
            .where('userThatRequestedId', '==', userThatRequestedId)
            .where('postId', '==', postId)
            .get();
        if (snapshot.docs.length === 0) {
            return null;
        }
        const chatPromise= snapshot.docs.map(doc => Chat.fromJson({id: doc.id, ...doc.data()}, currentUserId))[0];
        return await chatPromise;
    }

    static async getUserPostsChats(uid) {
        const snapshot = await firestore().collection('chats')
            .where('userThatPostedId', '==', uid)
            .get();
        let nonEmptyChats = [];
        let allChats = snapshot.docs.map(doc => Chat.fromJson({id: doc.id, ...doc.data()},uid));
        console.log("all chats:",allChats.length)
        for (const chatPromise of allChats) {
            const chat=await chatPromise;
            if (chat.messages.length > 0) {
                nonEmptyChats.push(chat);
            }
        }
        nonEmptyChats.sort((a, b) => {
            return b.messages[b.messages.length - 1].createdAt - a.messages[a.messages.length - 1].createdAt;
        });
        return nonEmptyChats;
    }

    static async getUserRequestsChats(uid) {
        const snapshot = await firestore().collection('chats')
            .where('userThatRequestedId', '==', uid)
            .get();
        let nonEmptyChats = [];
        let allChats = snapshot.docs.map(doc => Chat.fromJson({id: doc.id, ...doc.data()},uid));
        for (const chatPromise of allChats) {
            const chat=await chatPromise;
            if (chat.messages.length > 0) {
                nonEmptyChats.push(chat);
            }
        }
        nonEmptyChats.sort((a, b) => {
            return b.messages[b.messages.length - 1].createdAt - a.messages[a.messages.length - 1].createdAt;
        });
        return nonEmptyChats;
    }

    static async initializeChat(chat) {
        const doc = await firestore().collection('chats').add(Chat.toJson(chat));
        return doc.id;
    }

    static async sendMessage(chatId, messageId,text, uid, createdAt, receiverId, senderFullName,senderPublicKey,receiverPublicKey) {
        console.log("INSIDE SEND MESSAGE")
        const receiverCipher=await encryptRSA(receiverPublicKey,text);
        console.log("INSIDE SEND MESSAGE AFTER ENCRYPT 1")
        const senderCipher=await encryptRSA(senderPublicKey,text);
        const privateKey=await getPrivateKey();
        let senderSignature=await sign(privateKey,text);
        console.log("INSIDE SEND MESSAGE AFTER ENCRYPT 2")
        const ciphers={};
        ciphers[uid]=senderCipher;
        ciphers[receiverId]=receiverCipher;
        console.log("CIPHERS:",ciphers);
        await firestore().collection('chats').doc(chatId).update({
            'messages': FieldValue.arrayUnion({text: ciphers, uid: uid, createdAt: createdAt,_id:messageId,signature:senderSignature}),
        });
        await NotificationServices.sendNotification(receiverId, senderFullName, `${senderFullName}: ${text}`);
    }

    static async sendImageMessage(chatId, messageId, imageUri, uid, createdAt, receiverId, senderFullName) {
        await firestore().collection('chats').doc(chatId).update({
            'messages': FieldValue.arrayUnion({image: imageUri, uid: uid, createdAt: createdAt}),
        });
        await NotificationServices.sendNotification(receiverId, senderFullName, `${senderFullName}: sent an image`);
    }

    static async getChatById(chatId) {
        const doc = await firestore().collection('chats').doc(chatId);
        return Chat.fromJson({id: doc.id, ...doc.data()});
    }

    static async listenForChatMessages(chatId, onMessageReceived,currentUserId,otherUserPublicKey) {
        let firstTime = true;
        const chatRoomRef = firestore().collection('chats').doc(chatId);
        let prevMessagesLength=0;
        const unsubscribe = chatRoomRef.onSnapshot(async (doc) => {
            if (doc != null) {
                let messages=[]
                if(doc.data().messages.length>0){
                    messages = await Chat.decrypt(doc.data().messages,currentUserId,otherUserPublicKey);
                }
                console.log('added message: ', messages[messages.length - 1]);
                const index = messages.length - 1;
                if (firstTime) {
                    prevMessagesLength = messages.length;
                    firstTime = false;
                    return;
                }
                if (prevMessagesLength !== messages.length)
                    onMessageReceived(messages[index], index + 1);
                prevMessagesLength = messages.length;
            }
        });
        return unsubscribe;

    }

    // static async loadEarlierMessages(chatId, oldestMessageTimestamp) {
    //     const chatRef = firestore().collection('chats').doc(chatId);
    //     const chatDoc = await chatRef.get();
    //     const messages = chatDoc.data().messages;
    //     const newMessages = [];
    //     for (let i = messages.length - 1; i >= 0; i--) {
    //         const message = messages[i];
    //         if (message.createdAt < oldestMessageTimestamp) {
    //             break;
    //         }
    //         newMessages.unshift(message);
    //     }
    //     return newMessages;
    // }
    // static async loadEarlierMessages(chatId, oldestMessageTimestamp, limit ) {
    //     console.log("loadint")
    //     const chat =  await firestore().collection('chats').doc(chatId).get();
    //     console.log(chat.data().messages)
    //
    //
    //
    //
    //
    //
    // }
    static async loadEarlierMessages(chatId, oldestMessageTimestamp, limit) {
        try {
            const chatDoc = await firestore().collection('chats').doc(chatId).get();
            const messagesArray = chatDoc.data().messages;

            // Find the index of the oldest message in the array
            const oldestMessageIndex = messagesArray.findIndex((message) => {

                return message.createdAt.toDate().getTime() === oldestMessageTimestamp.getTime();
            });
            console.log(oldestMessageIndex);
            // If the oldest message is not found in the array, return an empty array
            if (oldestMessageIndex === -1) {
                return [];
            }

            // Slice the array to get the desired page of messages
            const startIndex = Math.max(oldestMessageIndex - limit, 0);
            const endIndex = oldestMessageIndex;
            const pageOfMessages = messagesArray.slice(startIndex, endIndex);

            return pageOfMessages;
        } catch (error) {
            console.error('Error loading earlier messages:', error);
            return [];
        }
    }

    static async resetUnReadMessagesCountForPoster(chatId) {
        await firestore().collection('chats').doc(chatId).update({
            'userThatPostedUnReadMessagesCount':0
        });
    }
    static async resetUnReadMessagesCountForRequester(chatId) {
        await firestore().collection('chats').doc(chatId).update({
            'userThatRequestedUnReadMessagesCount':0
        });
    }
    static async incrementUnReadMessagesCountForPoster(chatId){
        await firestore().collection('chats').doc(chatId).update({
            'userThatPostedUnReadMessagesCount':FieldValue.increment(1)
        });
    }
    static async incrementUnReadMessagesCountForRequester(chatId){

        await firestore().collection('chats').doc(chatId).update({
            'userThatRequestedUnReadMessagesCount':FieldValue.increment(1)
        });
    }
}

export default ChatServices;