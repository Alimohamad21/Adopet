import firestore from '@react-native-firebase/firestore';
import User from '../models/User';
const {FieldValue}=firestore;
class UserServices {
    // Register a new user with email and password
    static async getUser(uid) {
        const userDoc = await firestore().collection('users').doc(uid).get();
        const user = userDoc.data();
        user.uid = uid;
        return User.fromJson(user);
    }

    static async addUser(user, uid) {
        try {
            user.email = user.email.toLowerCase();
            await firestore().collection('users').doc(uid).set(User.toJson(user));
        } catch (error) {
            console.log(error.message);
            return false;
        }
        return true;
    }

    static async uploadProfilePictureUrl(uid, url) {
        try {
            await firestore().collection('users').doc(uid).update({profilePicture: url});
        } catch (error) {
            console.log(error.message);
            return false;
        }
        return true;
    }


    static async addFcmToken(uid, fcmToken) {
        console.log("Add token called")
        const userDoc = await firestore().collection('users').doc(uid);
        await firestore().runTransaction(async (transaction) => {
            const doc = await transaction.get(userDoc);
            if (!doc.exists) {
                throw new Error(`Document ${userDoc.path} does not exist.`);
            }
            const data = doc.data();
            if (!data['fcmTokens']) {
                data['fcmTokens'] = [];
            }
            if (!data['fcmTokens'].includes(fcmToken)) {
                data['fcmTokens'].push(fcmToken);
                transaction.update(userDoc, {['fcmTokens']: data['fcmTokens']});
            }
        });
    }

    static async removeFcmToken(uid, fcmToken) {
        await firestore().collection('users').doc(uid).update({'fcmTokens': FieldValue.arrayRemove(fcmToken)});
    }
}

export default UserServices;
