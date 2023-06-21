import firestore from '@react-native-firebase/firestore';
import User from '../models/User';
import { useContext } from "react";
import { CurrentUserContext } from "../providers/CurrentUserProvider";
import Chat from "../models/Chat";
import Pet from "../models/Pet";

import UserPet from '../models/UserPet';
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

    static async updateUser(user, uid) {
        try {
            user.email = user.email.toLowerCase();
            console.log(User.toJson(user))
            await firestore().collection('users').doc(uid).update(User.toJson(user));

        } catch (error) {
            console.log(error.message);
            return false;
        }
        return true;
    }

    static async checkIfPhoneNumberExists(phoneNumber){
        const snapshot = await firestore().collection('users').where('phoneNumber','==',phoneNumber).get();
        return snapshot.docs.length>0;
    }


    static async getUserPets(uid){
        const petDoc = await firestore().collection('pets').where('uid', '==', uid).get();
        const pets = [];

        petDoc.docs.forEach((doc) => {
            const petData = doc.data();
            petData.id=doc.id;
            pets.push(UserPet.fromJson(petData));
        });
        return pets;
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
    static async getSavedPosts(uid) {
        try {
            // Get a reference to the user document
            const userDoc = (await firestore().collection('users').doc(uid).get()).data();

            const savedPosts = userDoc.savedPosts


            // If the savedPosts array is empty or doesn't exist, the post is not saved
            if (!savedPosts || savedPosts.length === 0) {
                return [];
            }
            // // Convert the Firestore document snapshots into JSON objects
            // const savedPostsData = await Promise.all(
            //     savedPosts.map(async (postRef) => {
            //         const postSnapshot = await postRef.get();
            //         return { id: postSnapshot.id, ...postSnapshot.data() };
            //     })
            // );
            //
            return savedPosts;
        } catch (error) {
            console.error('Error getting saved posts Ids:', error);
            return ;
        }
    }
    static async removeProfilePicture(uid){
        try {
            // Get a reference to the user document
            const userDoc = await firestore().collection('users').doc(uid)


            // Update the user's profilePicture field to an empty string
            await userDoc.update({
                profilePicture: ''
            });

            return;


        } catch (error) {
            console.error('Error Removing Profile Picture:', error);
            return ;
        }
    }

}



export default UserServices;
