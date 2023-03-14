import firestore from '@react-native-firebase/firestore';
import User from '../models/User';

class UserServices {
    // Register a new user with email and password
    static async getUser(uid) {
        const userDoc = await firestore().collection('users').doc(uid).get();
        const user=userDoc.data();
        user.uid=uid;
        return User.fromJson(user)
    }

    static async addUser(user,uid) {
        try {
            user.email=user.email.toLowerCase();
            await firestore().collection("users").doc(uid).set(User.toJson(user))
        } catch (error) {
            console.log(error.message)
            return false
        }
        return true;
    }

    static async uploadProfilePictureUrl(uid,url) {
        try {
            await firestore().collection("users").doc(uid).update({profilePicture:url})
        } catch (error) {
            console.log(error.message)
            return false
        }
        return true;
    }
}

export default UserServices;
