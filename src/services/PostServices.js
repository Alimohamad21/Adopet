import firestore from '@react-native-firebase/firestore';
import {AdoptionPost, FoundPost, HostingPost, LostPost} from '../models/Post';
import {firebase} from "@react-native-firebase/auth";
import Pet from "../models/Pet";

class PostServices {

    static async getPostsInitial(postType) {
        console.log(postType)
        console.log("treee")
        const snapshot = await firestore()
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .where("type","==",postType)
            .limit(5)
            .get();
        console.log(snapshot.docs)
        let posts
        switch (postType) {
            case 'Adoption':
                 posts = snapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            case 'Lost':
                 posts = snapshot.docs.map((doc) => LostPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            case 'Found':
                posts = snapshot.docs.map((doc) => FoundPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            case 'Hosting':
                posts = snapshot.docs.map((doc) => HostingPost.fromJson({id: doc.id, ...doc.data()}));
                break;

            // case 'event':
            //     allPosts.push(EventPost.fromJson({ id: doc.id, ...doc.data() }));
            //     break;
            // Add cases for other post types as needed
            default:
                break;
        }

        const lastDocument = snapshot.docs[snapshot.docs.length - 1];

        return {newPosts: posts, lastDocument: lastDocument};
    }

    static async getPostsPaginated(prevLastDocument,postType) {
        const snapshot = await firestore()
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .startAfter(prevLastDocument)
            .where("type","==",postType)
            .limit(5)
            .get();

        let posts
        switch (postType) {
            case 'Adoption':
                posts = snapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            case 'Lost':
                posts = snapshot.docs.map((doc) => LostPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            case 'Found':
                posts = snapshot.docs.map((doc) => FoundPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            case 'Hosting':
                posts = snapshot.docs.map((doc) => HostingPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            // case 'event':
            //     allPosts.push(EventPost.fromJson({ id: doc.id, ...doc.data() }));
            //     break;
            // Add cases for other post types as needed
            default:
                break;
        }
        const lastDocument = snapshot.docs[snapshot.docs.length - 1];
        return {newPosts: posts, lastDocument: lastDocument};
    }

    static async getPostsFiltered(filters,postType) {

        // console.log(petType,ageRange,selectedBreeds,isNeutered);
        console.log(filters)

        const postsCollection = await firestore().collection('posts')
        let query = postsCollection
        if (filters.petType != null){
            query = query.where("petType",'==', filters.petType)
        }
        if (filters.ageRange) {
            console.log(Pet.getPetBirthdate(filters.ageRange.min).toString())
            console.log(Pet.getPetBirthdate(filters.ageRange.max).toString())
            const minBirthdate = Pet.getPetBirthdate(filters.ageRange.min).toString();
            const maxBirthdate = Pet.getPetBirthdate(filters.ageRange.max).toString();
            query = query

                .where("petBirthDate", '<=', minBirthdate)
                .where("petBirthDate", '>=', maxBirthdate)
                .orderBy("petBirthDate")
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
            .where("type","==",postType)
            .limit(15)
            .get();
        // console.log(snapshot.docs)
        let posts
        switch (postType) {
            case 'Adoption':
                posts = snapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            case 'Lost':
                posts = snapshot.docs.map((doc) => LostPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            case 'Found':
                posts = snapshot.docs.map((doc) => FoundPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            case 'Hosting':
                posts = snapshot.docs.map((doc) => HostingPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            // case 'event':
            //     allPosts.push(EventPost.fromJson({ id: doc.id, ...doc.data() }));
            //     break;
            // Add cases for other post types as needed
            default:
                break;
        }
        const lastDocument = snapshot.docs[snapshot.docs.length - 1];
        console.log(posts)
        return {newPosts: posts, lastDocument: lastDocument};
    }

    static async getPostsFilteredPaginated(filters,prevLastDocument,postType) {
        console.log(filters)

        const postsCollection = await firestore().collection('posts')
        let query = postsCollection
        if (filters.petType != null){
            query = query.where("petType",'==', filters.petType)
        }
        if (filters.ageRange) {
            const minBirthdate = Pet.getPetBirthdate(filters.ageRange.min).toString();
            const maxBirthdate = Pet.getPetBirthdate(filters.ageRange.max).toString();
            query = query
                .where("petBirthDate", '<=', minBirthdate)
                .where("petBirthDate", '>=', maxBirthdate)
                .orderBy("petBirthDate")
        }

        if (filters.selectedBreeds.length > 0){
            query = query.where("petBreed",'in',filters.selectedBreeds)
        }
        console.log(typeof filters.isNeutered)
        if(typeof filters.isNeutered === 'boolean'){
            query = query.where("petIsNeutered", '==', filters.isNeutered )
        }


        const snapshot = await query
            .where("type","==",postType)
            .startAfter(prevLastDocument)
            .limit(15)
            .get();
        let posts
        switch (postType) {
            case 'Adoption':
                posts = snapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            case 'Lost':
                posts = snapshot.docs.map((doc) => LostPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            case 'Found':
                posts = snapshot.docs.map((doc) => FoundPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            case 'Hosting':
                posts = snapshot.docs.map((doc) => HostingPost.fromJson({id: doc.id, ...doc.data()}));
                break;
            // case 'event':
            //     allPosts.push(EventPost.fromJson({ id: doc.id, ...doc.data() }));
            //     break;
            // Add cases for other post types as needed
            default:
                break;
        }
        const lastDocument = snapshot.docs[snapshot.docs.length - 1];
        console.log(posts)
        return {newPosts: posts, lastDocument: lastDocument};
    }

    static async addAdoptionPost(adoptionPost) {
        await firestore().collection('posts').add(adoptionPost.toJson());
    }
    static async addHostingPost(hostingPost) {
        await firestore().collection('posts').add(hostingPost.toJson());
    }
    static async addFoundPost(foundPost) {
        await firestore().collection('posts').add(foundPost.toJson());
    }

    static async getUserPosts(userID) {
        const snapshot = await firestore()
            .collection('posts')
            .where('userThatPostedId', '==', userID)
            .get();

        const userPosts = [];

        snapshot.docs.forEach((doc) => {
            const postType = doc.data().type;

            switch (postType) {
                case 'Adoption':
                    userPosts.push(AdoptionPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                case 'Lost':
                    userPosts.push(LostPost.fromJson({ id: doc.id, ...doc.data()}));
                    break;
                case 'Found':
                    userPosts.push(FoundPost.fromJson({ id: doc.id, ...doc.data()}));
                    break;
                case 'Hosting':
                    userPosts.push(HostingPost.fromJson({ id: doc.id, ...doc.data()}));
                    break;
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
            const collectionRef = firestore().collection('posts');
            const query = collectionRef.where(firestore.FieldPath.documentId(), 'in', postIds);
            const querySnapshot = await query.get();

            const allPosts = [];

            querySnapshot.docs.forEach((doc) => {
                const postType = doc.data().type;

                switch (postType) {
                    case 'Adoption':
                        allPosts.push(AdoptionPost.fromJson({ id: doc.id, ...doc.data() }));
                        break;
                    case 'Lost':
                        allPosts.push(LostPost.fromJson({ id: doc.id, ...doc.data() }));
                        break;
                    case 'Hosting':
                        allPosts.push(HostingPost.fromJson({ id: doc.id, ...doc.data() }));
                        break;
                    case 'Found':
                        allPosts.push(FoundPost.fromJson({ id: doc.id, ...doc.data()}));
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
