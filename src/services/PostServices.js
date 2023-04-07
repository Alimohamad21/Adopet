import firestore from '@react-native-firebase/firestore';
import AdoptionPost from '../models/AdoptionPost';

class PostServices {
    static async getAdoptionPosts() {
        const snapshot = await firestore().collection('adoption-posts').get();
        return snapshot.docs.map((doc) => AdoptionPost.fromJson({id: doc.id, ...doc.data()}));
    }

    static async addAdoptionPost(adoptionPost) {
        await firestore().collection('adoption-posts').add(AdoptionPost.toJson(adoptionPost));
    }
}

export default PostServices;
