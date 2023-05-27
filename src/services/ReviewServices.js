import firestore from '@react-native-firebase/firestore';
import Review from '../models/Review';

const {FieldValue} = firestore;

class ReviewServices {
    static async addReview(review) {
        try {
            await firestore().collection('reviews').add(Review.toJson(review));
            return true;
        } catch (error) {
            console.error('Error adding review:', error);
            return false;
        }
    }

    static async getReviewsForUser(userId) {
        try {
            const querySnapshot = await firestore().collection('reviews').where('revieweeId', '==', userId).get();
            return querySnapshot.docs.map((doc) => Review.fromJson(doc.data()));
        } catch (error) {
            console.error('Error getting reviews for user:', error);
            return [];
        }
    }

    static async getReviewsByUser(userId) {
        try {
            const querySnapshot = await firestore().collection('reviews').where('reviewerId', '==', userId).get();
            return querySnapshot.docs.map((doc) => Review.fromJson(doc.data()));
        } catch (error) {
            console.error('Error getting reviews by user:', error);
            return [];
        }
    }

    static async checkIfReviewIsConfirmed(postId, reviewerId, revieweeId) {
        let isConfirmed;
        try {
            const querySnapshot = await firestore().collection('reviews')
                .where('postId', '==', postId)
                .where('revieweeId', '==', reviewerId)
                .where('reviewerId', '==', revieweeId)
            .get();
            isConfirmed = querySnapshot.docs.length > 0;
        } catch (error) {
            console.error('Error getting reviews by user:', error);
            isConfirmed = false;
        }
        return isConfirmed;
    }

    static async checkIfAlreadyReviewed(postId, reviewerId, revieweeId) {
        let isReviewed;
        try {
            const querySnapshot = await firestore().collection('reviews')
                .where('postId', '==', postId)
                .where('revieweeId', '==', revieweeId)
                .where('reviewerId', '==', reviewerId)
                .get();
            isReviewed = querySnapshot.docs.length > 0;
        } catch (error) {
            console.error('Error getting reviews by user:', error);
            isReviewed = false;
        }
        return isReviewed;
    }

    /**
     *
     * @param {Review} review
     * @param {string} userId
     **/
    static async markReviewAsConfirmed(review, userId) {
        try {
            await firestore().collection('reviews').doc(review.id).update({isConfirmed: true});
            await firestore().collection('users').doc(userId).update({
                ratingsCount: FieldValue.increment(1),
                ratingsSum: FieldValue.increment(review.rating),
            });
            return true;
        } catch (error) {
            console.error('Error marking review as pending confirmation:', error);
            return false;
        }
    }
}

export default ReviewServices;
