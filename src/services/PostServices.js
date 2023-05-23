import firestore from '@react-native-firebase/firestore';
import {AdoptionPost, HostingPost} from '../models/Post';
import {firebase} from "@react-native-firebase/auth";

class PostServices {
    static async getAdoptionPostsInitial() {
        const snapshot = await firestore()
            .collection('adoption-posts')
            .orderBy('createdAt', 'desc')
            .where("type","==","Adoption")
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
            .where("type","==","Adoption")
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
            .where("type","==","Adoption")
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

        if (filters.selectedBreeds.length > 0){
            query = query.where("petBreed",'in',filters.selectedBreeds)
        }
        console.log(typeof filters.isNeutered)
        if(typeof filters.isNeutered === 'boolean'){
            query = query.where("petIsNeutered", '==', filters.isNeutered )
        }


        const snapshot = await query
            .where("type","==","Adoption")
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

    static async getUserPosts(userID) {
        const snapshot = await firestore()
            .collection('adoption-posts')
            .where('userThatPostedId', '==', userID)
            .get();

        const userPosts = [];

        snapshot.docs.forEach((doc) => {
            const postType = doc.data().type;

            switch (postType) {
                case 'Adoption':
                    userPosts.push(AdoptionPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                // case 'lostAndFound':
                //     userPosts.push(LostAndFoundPost.fromJson({ id: doc.id, ...doc.data()}));
                //     break;
                // case 'event':
                //     userPosts.push(EventPost.fromJson({ id: doc.id, ...doc.data() }));
                //     break;
                // Add cases for other post types as needed
                default:
                    break;
            }
        });

        return userPosts;
    }
    static async getPostsByIds(postIds) {
        try {
            const collectionRef = firestore().collection('adoption-posts');
            const query = collectionRef.where(firestore.FieldPath.documentId(), 'in', postIds);
            const querySnapshot = await query.get();

            const allPosts = [];

            querySnapshot.docs.forEach((doc) => {
                const postType = doc.data().type;

                switch (postType) {
                    case 'Adoption':
                        allPosts.push(AdoptionPost.fromJson({ id: doc.id, ...doc.data() }));
                        break;
                    // case 'lostAndFound':
                    //     allPosts.push(LostAndFoundPost.fromJson({ id: doc.id, ...doc.data() }));
                    //     break;
                    case 'Hosting':
                        allPosts.push(HostingPost.fromJson({ id: doc.id, ...doc.data() }));
                        break;
                    // Add cases for other post types as needed
                    default:
                        break;
                }
            });

            return allPosts;
        } catch (error) {
            console.error('Error getting posts:', error);
            return false;
        }
    }
}

export default PostServices;
