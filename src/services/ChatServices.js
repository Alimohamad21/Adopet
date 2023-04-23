import firestore from '@react-native-firebase/firestore';
import Chat from '../models/Chat';
import NotificationServices from './NotificationServices';

import {firebase} from '@react-native-firebase/auth';

const {FieldValue} = firestore;

class ChatServices {

    static async getChat(userThatPostedId, userThatRequestedId, postId) {
        const snapshot = await firestore().collection('chats')
            .where('userThatPostedId', '==', userThatPostedId)
            .where('userThatRequestedId', '==', userThatRequestedId)
            .where('postId', '==', postId)
            .get();
        if (snapshot.docs.length === 0) {
            return null;
        }
        return snapshot.docs.map(doc => Chat.fromJson({id: doc.id, ...doc.data()}))[0];
    }

    static async getUserPostsChats(uid) {
        const snapshot = await firestore().collection('chats')
            .where('userThatPostedId', '==', uid)
            .get();
        let nonEmptyChats = [];
        let allChats = snapshot.docs.map(doc => Chat.fromJson({id: doc.id, ...doc.data()}));
        for (const chat of allChats) {
            if (chat.messages.length > 0) {
                nonEmptyChats.push(chat);
            }
        }
        return nonEmptyChats;
    }

    static async getUserRequestsChats(uid) {
        const snapshot = await firestore().collection('chats')
            .where('userThatRequestedId', '==', uid)
            .get();
        let nonEmptyChats = [];
        let allChats = snapshot.docs.map(doc => Chat.fromJson({id: doc.id, ...doc.data()}));
        for (const chat of allChats) {
            if (chat.messages.length > 0) {
                nonEmptyChats.push(chat);
            }
        }
        return nonEmptyChats;
    }

    static async initializeChat(chat) {
        const doc = await firestore().collection('chats').add(Chat.toJson(chat));
        return doc.id;
    }

    static async sendMessage(chatId, text, uid, createdAt, receiverId, senderFullName) {
        await firestore().collection('chats').doc(chatId).update({
            'messages': FieldValue.arrayUnion({text: text, uid: uid, createdAt: createdAt}),
        });
        await NotificationServices.sendNotification(receiverId, senderFullName, `${senderFullName}: ${text}`);
    }
    static async sendImageMessage(chatId, imageUri, uid, createdAt, receiverId, senderFullName) {
        await firestore().collection('chats').doc(chatId).update({
            'messages': FieldValue.arrayUnion({image: imageUri, uid: uid, createdAt: createdAt}),
        });
        await NotificationServices.sendNotification(receiverId, senderFullName, `${senderFullName}: sent an image`);
    }

    static async getChatById(chatId) {
        const doc = await firestore().collection('chats').doc(chatId);
        return Chat.fromJson({id: doc.id, ...doc.data()});
    }

    static async listenForChatMessages(chatId, onMessageReceived) {
        let firstTime = true;
        const chatRoomRef = firestore().collection('chats').doc(chatId);
        console.log('test');
        const unsubscribe = chatRoomRef.onSnapshot((doc) => {
            const messages = doc.data().messages;
            console.log('added message: ', messages[messages.length - 1]);
            const index = messages.length - 1;
            if (firstTime) {
                firstTime = false;
                return;
            }
            onMessageReceived(messages[index], index + 1);
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

}

export default ChatServices;
