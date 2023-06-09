class Review {
    constructor(
        id,
        isConfirmed,
        rating,
        ratingTime,
        comment,
        postType,
        petName,
        reviewerId,
        reviewerFullName,
        revieweeFullName,
        revieweeId,
        postId
    ) {
        this.id = id;
        this.isConfirmed = isConfirmed;
        this.rating = rating;
        this.ratingTime = ratingTime;
        this.comment = comment;
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
            json.postType,
            json.petName,
            json.reviewerId,
            json.reviewerFullName,
            json.revieweeFullName,
            json.revieweeId,
            json.postId
        );
    }
    /**
     *
     * @param {Review} review
     **/
    static toJson(review) {
        return {
            isConfirmed: review.isConfirmed,
            rating: review.rating,
            ratingTime: review.ratingTime,
            comment: review.comment,
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
