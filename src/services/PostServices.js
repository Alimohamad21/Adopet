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

    static async getAdoptionPostsFiltered(filters) {

        // console.log(petType,ageRange,selectedBreeds,isNeutered);

        const postsCollection = await firestore().collection('adoption-posts')
        let query = postsCollection
        if (filters.petType != null){
            query = query.where("petType",'==', filters.petType)
        }
        if (filters.ageRange) {
            query = query
                .where("petAge", '>=', parseInt(filters.ageRange.min))
                .where("petAge", '<=', parseInt(filters.ageRange.max))
        }
        // if (selectedColors.length > 0){
        //     query = query.where("petColor",'in',selectedColors)
        // }
        if (filters.selectedBreeds.length > 0){
            query = query.where("petBreed",'in',filters.selectedBreeds)
        }
        if(filters.isNeutered != null){
            query = query.where("petIsNeutered", '==', filters.isNeutered )
        }


        const snapshot = await query
            .limit(15)
            .get();
        const adoptionPosts = snapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
        const lastDocument = snapshot.docs[snapshot.docs.length - 1];
        console.log(adoptionPosts)
        return {newPosts: adoptionPosts, lastDocument: lastDocument};
    }

    static async getAdoptionPostsFilteredPaginated(filters,prevLastDocument) {
        console.log(filters)

        const postsCollection = await firestore().collection('adoption-posts')
        let query = postsCollection
        if (filters.petType != null){
            query = query.where("petType",'==', filters.petType)
        }
        if (filters.ageRange) {
            query = query
                .where("petAge", '>=', parseInt(filters.ageRange.min))
                .where("petAge", '<=', parseInt(filters.ageRange.max))
                .orderBy('petAge')
        }
        // if (selectedColors.length > 0){
        //     query = query.where("petColor",'in',selectedColors)
        // }
        if (filters.selectedBreeds.length > 0){
            query = query.where("petBreed",'in',filters.selectedBreeds)
        }
        if(filters.isNeutered != null){
            query = query.where("petIsNeutered", '==', filters.isNeutered )
        }


        const snapshot = await query
            .startAfter(prevLastDocument)
            .limit(15)
            .get();
        const adoptionPosts = snapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
        const lastDocument = snapshot.docs[snapshot.docs.length - 1];
        console.log(adoptionPosts)
        return {newPosts: adoptionPosts, lastDocument: lastDocument};
    }

    static async addAdoptionPost(adoptionPost) {
        await firestore().collection('adoption-posts').add(AdoptionPost.toJson(adoptionPost));
    }

    static async getUserAdoptionPosts(userID) {
        const snapshot = await firestore()
            .collection('adoption-posts')
            .where("userThatPostedId", "==", userID)
            .get();
        console.log("userposts:", snapshot)
        return snapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
    }

    static async getAdoptionPostsByID(postIds) {
        try {
            console.log("post service id:", postIds)
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
