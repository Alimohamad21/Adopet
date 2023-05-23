import { firebase } from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';
import { AdoptionPost } from '../models/Post';
import { LostAndFoundPost } from '../models/LostAndFoundPost';
import { EventPost } from '../models/EventPost';

class PostServices {
    static async getAllPosts() {
        const snapshot = await firestore()
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .limit(15)
            .get();

        const allPosts = [];

        snapshot.docs.forEach((doc) => {
            const postType = doc.data().type;

            switch (postType) {
                case 'adoption':
                    allPosts.push(AdoptionPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                case 'lostAndFound':
                    allPosts.push(LostAndFoundPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                case 'event':
                    allPosts.push(EventPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                // Add cases for other post types as needed
                default:
                    break;
            }
        });

        const lastDocument = snapshot.docs[snapshot.docs.length - 1];

        return { newPosts:allPosts, lastDocument: lastDocument };
    }

    static async getAllPostsPaginated(prevLastDocument) {
        const snapshot = await firestore()
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .startAfter(prevLastDocument)
            .limit(15)
            .get();

        const allPosts = [];

        snapshot.docs.forEach((doc) => {
            const postType = doc.data().type;

            switch (postType) {
                case 'adoption':
                    allPosts.push(AdoptionPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                case 'lostAndFound':
                    allPosts.push(LostAndFoundPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                case 'event':
                    allPosts.push(EventPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                // Add cases for other post types as needed
                default:
                    break;
            }
        });

        const lastDocument = snapshot.docs[snapshot.docs.length - 1];

        return { newPosts: allPosts, lastDocument: lastDocument };
    }

    static async getFilteredPosts(filters) {
        const postsCollection = await firestore().collection('posts');
        let query = postsCollection;

        if (filters.petType != null) {
            query = query.where('petType', '==', filters.petType);
        }

        if (filters.ageRange) {
            query= query
                .where('petAge', '>=', parseInt(filters.ageRange.min))
                .where('petAge', '<=', parseInt(filters.ageRange.max));
        }

        if (filters.selectedBreeds.length > 0) {
            query = query.where('petBreed', 'in', filters.selectedBreeds);
        }

        if (typeof filters.isNeutered === 'boolean') {
            query = query.where('petIsNeutered', '==', filters.isNeutered);
        }

        const snapshot = await query.limit(15).get();

        const allPosts = [];

        snapshot.docs.forEach((doc) => {
            const postType = doc.data().type;

            switch (postType) {
                case 'adoption':
                    allPosts.push(AdoptionPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                case 'lostAndFound':
                    allPosts.push(LostAndFoundPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                case 'event':
                    allPosts.push(EventPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                // Add cases for other post types as needed
                default:
                    break;
            }
        });

        const lastDocument = snapshot.docs[snapshot.docs.length - 1];

        return { newPosts: allPosts, lastDocument: lastDocument };
    }

    static async getFilteredPostsPaginated(filters, prevLastDocument) {
        const postsCollection = await firestore().collection('posts');
        let query = postsCollection;

        if (filters.petType != null) {
            query = query.where('petType', '==', filters.petType);
        }

        if (filters.ageRange) {
            query= query
                .where('petAge', '>=', parseInt(filters.ageRange.min))
                .where('petAge', '<=', parseInt(filters.ageRange.max));
        }

        if (filters.selectedBreeds.length > 0) {
            query = query.where('petBreed', 'in', filters.selectedBreeds);
        }

        if (typeof filters.isNeutered === 'boolean') {
            query = query.where('petIsNeutered', '==', filters.isNeutered);
        }

        const snapshot = await query.startAfter(prevLastDocument).limit(15).get();

        const allPosts = [];

        snapshot.docs.forEach((doc) => {
            const postType = doc.data().type;

            switch (postType) {
                case 'adoption':
                    allPosts.push(AdoptionPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                case 'lostAndFound':
                    allPosts.push(LostAndFoundPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                case 'event':
                    allPosts.push(EventPost.fromJson({ id: doc.id, ...doc.data() }));
                    break;
                // Add cases for other post types as needed
                default:
                    break;
            }
        });

        const lastDocument = snapshot.docs[snapshot.docs.length - 1];

        return { newPosts: allPosts, lastDocument: lastDocument };
    }

    static async addPost(post) {
        const postType = post.type;

        let postJson;

        switch (postType) {
            case 'adoption':
                postJson = AdoptionPost.toJson(post);
                break;
            case 'lostAndFound':
                postJson = LostAndFoundPost.toJson(post);
                break;
            case 'event':
                postJson = EventPost.toJson(post);
                break;
            // Add cases for other post types as needed
            default:
                break;
        }

        await firestore().collection('posts').add(postJson);
    }




}

export default PostServices;