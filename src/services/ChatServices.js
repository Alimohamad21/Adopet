import firestore from '@react-native-firebase/firestore';
import Chat from '../models/Chat';
import NotificationServices from './NotificationServices';

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

    static async getChatById(chatId) {
        const doc = await firestore().collection('chats').doc(chatId);
        return Chat.fromJson({id: doc.id, ...doc.data()});
    }
}

export default ChatServices;
