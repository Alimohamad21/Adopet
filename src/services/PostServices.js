import firestore from '@react-native-firebase/firestore';
import AdoptionPost from '../models/AdoptionPost';

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
}

export default PostServices;
