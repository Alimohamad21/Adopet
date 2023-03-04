class User {
    constructor(fullName, location, nationality, phoneNumber, address, email, username, uid, profilePicture, ownedPets) {
        this.location = location;
        this.nationality = nationality;
        this.phoneNumber = phoneNumber;
        this.fullName= fullName;
        this.address = address;
        this.email = email;
        this.username = username;
        this.uid = uid;
        this.profilePicture = profilePicture;
        this.ownedPets = ownedPets;
    }

    static fromJson(json) {
        console.log(json.fullName)
        return new User(json.fullName, json.location, json.nationality, json.phoneNumber, json.address, json.email, json.username, json.uid, json.profilePicture, json.ownedPets);
    }

    static toJson(user) {
        return JSON.stringify(user);
    }
}
export default User;
