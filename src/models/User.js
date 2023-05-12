class User {
    constructor(uid, fullName, city, phoneNumber, email, profilePicture, ownedPets,savedPosts,fcmTokens) {
        this.uid=uid;
        this.city = city;

        this.phoneNumber = phoneNumber;
        this.fullName= fullName;

        this.email = email;

        this.profilePicture = profilePicture;
        this.ownedPets = ownedPets;
        this.savedPosts = savedPosts;
        this.fcmTokens = fcmTokens;

    }

    static fromJson(json) {
        return new User(json.uid,json.fullName, json.city, json.phoneNumber, json.email, json.profilePicture, json.ownedPets, json.savedPosts , json.fcmTokens);
    }
    static toJson(user) {
        return {
            fullName:user.fullName,
            city: user.city,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture,
            email:user.email,
            ownedPets: user.ownedPets,
            savedPosts: user.savedPosts,
            fcmTokens: user.fcmTokens
        };
    }
}
export default User;
