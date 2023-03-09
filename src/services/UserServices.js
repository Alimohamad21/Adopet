import firestore from '@react-native-firebase/firestore';
import User from '../models/User';

class UserServices {
    // Register a new user with email and password
    static async getUser(uid) {
        const userDoc = await firestore().collection('users').doc(uid).get();
        return User.fromJson(userDoc.data())
    }

    static async addUser(user,uid) {
        try {
            await firestore().collection("users").doc(uid).set(user)
        } catch (error) {
            return false
        }
        return true;

    }

}

export default UserServices;
