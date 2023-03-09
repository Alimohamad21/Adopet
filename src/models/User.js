class User {
    constructor(fullName, location, phoneNumber, email, profilePicture, ownedPets) {
        this.location = location;

        this.phoneNumber = phoneNumber;
        this.fullName= fullName;

        this.email = email;


        this.profilePicture = profilePicture;
        this.ownedPets = ownedPets;
    }

    static fromJson(json) {

        return new User(json.fullName, json.location, json.phoneNumber, json.email, json.profilePicture, json.ownedPets);
    }

    static toJson(user) {
        return JSON.stringify(user);
    }
}
export default User;
