class User {
    constructor(uid, fullName, city, phoneNumber,gender, email, profilePicture, ownedPets,fcmTokens) {
        this.uid=uid;
        this.city = city;

        this.phoneNumber = phoneNumber;
        this.fullName= fullName;
        this.gender = gender;

        this.email = email;

        this.profilePicture = profilePicture;
        this.ownedPets = ownedPets;
        this.fcmTokens = fcmTokensc
    }

    static fromJson(json) {
        return new User(json.uid,json.fullName, json.city, json.phoneNumber,json.gender, json.email, json.profilePicture, json.ownedPets, json.fcmTokens);
    }
    static toJson(user) {
        return {
            fullName:user.fullName,
            city: user.city,
            phoneNumber: user.phoneNumber,
            gender:user.gender,
            profilePicture: user.profilePicture,
            email:user.email,
            ownedPets: user.ownedPets,
            fcmTokens: user.fcmTokens
        };
    }
}
export default User;
