import firestore from '@react-native-firebase/firestore';
import Review from '../models/Review';
import NotificationServices from './NotificationServices';

const {FieldValue} = firestore;

class ReviewServices {
    static async addReview(review) {
        try {
            const doc = await firestore().collection('reviews').add(Review.toJson(review));
            review.id = doc.id;
            const shouldBeConfirmed = await ReviewServices.checkIfReviewShouldBeConfirmed(review.postId, review.reviewerId, review.revieweeId);
            if (shouldBeConfirmed) {
                ReviewServices.markReviewAsConfirmed(review);
                const otherReview = await ReviewServices.getReview(review.postId, review.revieweeId, review.reviewerId);
                ReviewServices.markReviewAsConfirmed(otherReview)
            }
            else {
                NotificationServices.sendNotification(review.revieweeId
                    ,`${review.petName} Marked as Handed Over`,
                            `${review.reviewerFullName} has marked ${review.petName} as handed over.
                             Please go to the chat to confirm hand over and rate the user.`
                    )
            }
            return true;
        } catch (error) {
            console.error('Error adding review:', error);
            return false;
        }
    }

    static async getReview(postId, reviewerId, revieweeId) {
        const querySnapshot = await firestore().collection('reviews')
            .where('postId', '==', postId)
            .where('revieweeId', '==', revieweeId)
            .where('reviewerId', '==', reviewerId)
            .get();
        const reviewDoc = querySnapshot.docs[0];
        return Review.fromJson({id: reviewDoc.id, ...reviewDoc.data()});
    }

    static async getReviewsForUser(userId) {
        try {
            const querySnapshot = await firestore().collection('reviews').where('revieweeId', '==', userId)
                .where('isConfirmed','==',true)
                .get();
            return querySnapshot.docs.map((doc) => Review.fromJson(doc.data()));
        } catch (error) {
            console.error('Error getting reviews for user:', error);
            return [];
        }
    }

    static async getReviewsByUser(userId) {
        try {
            const querySnapshot = await firestore().collection('reviews')
                .where('reviewerId', '==', userId).
            where('isConfirmed','==',true).get();
            return querySnapshot.docs.map((doc) => Review.fromJson(doc.data()));
        } catch (error) {
            console.error('Error getting reviews by user:', error);
            return [];
        }
    }

    static async checkIfReviewShouldBeConfirmed(postId, reviewerId, revieweeId) {
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
    static async markReviewAsConfirmed(review) {
        try {
            await firestore().collection('reviews').doc(review.id).update({isConfirmed: true});
            await firestore().collection('users').doc(review.revieweeId).update({
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
