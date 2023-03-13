class User {
    constructor(uid, fullName, city, phoneNumber, email, profilePicture, ownedPets) {
        this.uid=uid;
        this.city = city;

        this.phoneNumber = phoneNumber;
        this.fullName= fullName;

        this.email = email;


        this.profilePicture = profilePicture;
        this.ownedPets = ownedPets;
    }

    static fromJson(json) {
        return new User(json.uid,json.fullName, json.city, json.phoneNumber, json.email, json.profilePicture, json.ownedPets);
    }
    static toJson(user) {
        return {
            fullName:user.fullName,
            city: user.city,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture,
            email:user.email,
            ownedPets: user.ownedPets
        };
    }
}
export default User;
