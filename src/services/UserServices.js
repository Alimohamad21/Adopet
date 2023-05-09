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
    static async addToSavedPosts(uid, savedPostID) {
        try {
            // Get a reference to the user document
            const userRef = firestore().collection('users').doc(uid);

            // Check if the savedPosts field exists
            const userDoc = await userRef.get();
            let savedPosts = userDoc.get('savedPosts');
            if (!savedPosts) {
                // If the savedPosts field doesn't exist, create it as an empty array
                savedPosts = [];
            }

            // Add the saved post ID to the savedPosts array
            savedPosts.push(savedPostID);

            // Update the user document with the updated savedPosts array
            await userRef.update({ savedPosts });

            console.log('Post added to saved posts successfully');
        } catch (error) {
            console.error('Error adding post to saved posts:', error);
        }
    }
    static async removeFromSavedPosts(uid, savedPostID) {
        try {
            // Get a reference to the user document
            const userRef = firestore().collection('users').doc(uid);

            // Update the user document to remove the saved post ID from the savedPosts array
            await userRef.update({
                savedPosts: firestore.FieldValue.arrayRemove(savedPostID)
            });

            console.log('Post removed from saved posts successfully');
        } catch (error) {
            console.error('Error removing post from saved posts:', error);
        }
    }
    static async isPostSaved(uid, postId) {
        try {
            // Get a reference to the user document
            const userRef = firestore().collection('users').doc(uid);

            // Get the user document and retrieve the savedPosts array
            const userDoc = await userRef.get();
            const savedPosts = userDoc.get('savedPosts');

            // If the savedPosts array is empty or doesn't exist, the post is not saved
            if (!savedPosts || savedPosts.length === 0) {
                return false;
            }

            // Check if the post ID is in the savedPosts array
            return savedPosts.includes(postId);
        } catch (error) {
            console.error('Error checking if post is saved:', error);
            return false;
        }
    }
}



export default UserServices;
