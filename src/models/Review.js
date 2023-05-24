class Review {
    constructor(
        id,
        isConfirmed,
        rating,
        ratingTime,
        comment,
        complaintList,
        postType,
        petName,
        reviewerId,
        reviewerFullName,
        revieweeFullName,
        revieweeId,
        postId
    ) {
        this.id = id;
        this.isPendingConfirmation = isConfirmed;
        this.rating = rating;
        this.ratingTime = ratingTime;
        this.comment = comment;
        this.complaintList = complaintList;
        this.postType = postType;
        this.petName = petName;
        this.reviewerId = reviewerId;
        this.reviewerFullName = reviewerFullName;
        this.revieweeFullName = revieweeFullName;
        this.revieweeId = revieweeId;
        this.postId = postId;
    }

    static fromJson(json) {
        return new Review(
            json.id,
            json.isConfirmed,
            json.rating,
            json.ratingTime,
            json.comment,
            json.complaintList,
            json.postType,
            json.petName,
            json.reviewerId,
            json.reviewerFullName,
            json.revieweeFullName,
            json.revieweeId,
            json.postId
        );
    }

    static toJson(review) {
        return {
            isConfirmed: review.isConfirmed,
            rating: review.rating,
            ratingTime: review.ratingTime,
            comment: review.comment,
            complaintList: review.complaintList,
            postType: review.postType,
            petName: review.petName,
            reviewerId: review.reviewerId,
            reviewerFullName: review.reviewerFullName,
            revieweeFullName: review.revieweeFullName,
            revieweeId: review.revieweeId,
            postId: review.postId,
        };
    }
}
export default Review;
