import firestore from '@react-native-firebase/firestore';
import AdoptionPost from '../models/AdoptionPost';
import {firebase} from "@react-native-firebase/auth";

class PostServices {
    static async getAdoptionPostsInitial() {
        const snapshot = await firestore()
            .collection('adoption-posts')
            .orderBy('createdAt', 'desc')
            .limit(15)
            .get();

        const adoptionPosts = snapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
        const lastDocument = snapshot.docs[snapshot.docs.length - 1];
        return {newPosts: adoptionPosts, lastDocument: lastDocument};
    }


    static async getAdoptionPostsPaginated(prevLastDocument) {
        const snapshot = await firestore()
            .collection('adoption-posts')
            .orderBy('createdAt', 'desc')
            .startAfter(prevLastDocument)
            .limit(15)
            .get();

        const adoptionPosts = snapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
        const lastDocument = snapshot.docs[snapshot.docs.length - 1];
        return {newPosts: adoptionPosts, lastDocument: lastDocument};
    }

    static async getAdoptionPostsFiltered(minValue,maxValue,selectedColors) {
        console.log(minValue,maxValue);
        const snapshot = await firestore()
            .collection('adoption-posts')
            .orderBy("petAge")
            .orderBy("petColor")
            .where("petAge", '>=', parseInt(minValue) )
            .where("petAge", '<=', parseInt(maxValue) )
            // .where("petColor",'array-contains-any',selectedColors)

            .limit(15)
            .get();

        const adoptionPosts = snapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
        const lastDocument = snapshot.docs[snapshot.docs.length - 1];
        console.log(adoptionPosts,)
        return {newPosts: adoptionPosts, lastDocument: lastDocument};
    }


    static async addAdoptionPost(adoptionPost) {
        await firestore().collection('adoption-posts').add(AdoptionPost.toJson(adoptionPost));
    }
    static async getUserAdoptionPosts(userID){
        const snapshot = await firestore()
            .collection('adoption-posts')
            .where("userThatPostedId","==",userID)
            .get();
        console.log("userposts:",snapshot)
        return snapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
    }
    static async getAdoptionPostsByID(postIds) {
        try {
            console.log("post service id:",postIds)
            // Get a reference to the adoption posts collection
            const collectionRef = firestore().collection('adoption-posts');

            // Create a query to filter by post IDs
            const query = collectionRef.where(firestore.FieldPath.documentId(), 'in', postIds);

            // Retrieve the query results
            const querySnapshot = await query.get();

            // Convert the query results to an array of post objects
            // const posts = [];
            // querySnapshot.forEach((doc) => {
            //     posts.push({ id: doc.id, ...doc.data() });
            // });

            const adoptionPosts = querySnapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
            //console.log(adoptionPosts)
            return adoptionPosts;
        } catch (error) {
            console.error('Error getting adoption posts:', error);
            return false;
        }
    }
}

export default PostServices;
