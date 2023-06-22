class User {
    constructor(uid, fullName, city, phoneNumber, email, profilePicture, ownedPets, savedPosts, fcmTokens, ratingsCount, ratingsSum,publicKey='') {
        this.uid = uid;
        this.city = city;
        this.phoneNumber = phoneNumber;
        this.fullName = fullName;
        this.email = email;
        this.profilePicture = profilePicture;
        this.ownedPets = ownedPets;
        this.savedPosts = savedPosts;
        this.fcmTokens = fcmTokens;
        this.ratingsCount = ratingsCount;
        this.ratingsSum = ratingsSum;
        this.publicKey=publicKey;
    }

    static fromJson(json) {
        return new User(json.uid, json.fullName, json.city, json.phoneNumber, json.email, json.profilePicture, json.ownedPets, json.savedPosts, json.fcmTokens, json.ratingsCount, json.ratingsSum,json.publicKey || '');
    }

    getAverageRating(){
        console.log(`count ${this.ratingsCount} ratings: ${this.ratingsSum}`)
        if(this.ratingsCount===0)
            return 0;
        return this.ratingsSum/this.ratingsCount;
    }

    static toJson(user) {
        return {
            fullName: user.fullName,
            city: user.city,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture,
            email: user.email,
            ownedPets: user.ownedPets,
            savedPosts: user.savedPosts,
            fcmTokens: user.fcmTokens,
            ratingsCount: user.ratingsCount,
            ratingsSum: user.ratingsSum,
        };
    }
}

export default User;
