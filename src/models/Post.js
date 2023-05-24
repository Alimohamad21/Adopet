import Pet from "./Pet";

class Post {
    constructor(id, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt, type) {
        this.id = id;
        this.userThatPostedId = userThatPostedId;
        this.userThatPostedFullName = userThatPostedFullName;
        this.userThatPostedCity = userThatPostedCity;
        this.userThatPostedProfilePicture = userThatPostedProfilePicture;
        this.userThatPostedPhoneNumber = userThatPostedPhoneNumber;
        this.createdAt = createdAt;
        this.type = type;
    }

    static fromJson(json) {
        return new Post(json.id, json.userThatPostedId, json.userThatPostedFullName, json.userThatPostedCity,
            json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt,json.type);
    }

    toJson() {
        return {
            id: this.id,
            userThatPostedId: this.userThatPostedId,
            userThatPostedFullName: this.userThatPostedFullName,
            userThatPostedCity: this.userThatPostedCity,
            userThatPostedProfilePicture: this.userThatPostedProfilePicture,
            userThatPostedPhoneNumber: this.userThatPostedPhoneNumber,
            createdAt: this.createdAt,
            type: this.type
        }
    }


}

class AdoptionPost extends Post {
    /**
     * @param {Pet} pet
     */
    constructor(id, pet, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt,type) {
        super(id, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt,type);
        this.pet = pet;

    }

    static fromJson(json) {
        return new AdoptionPost(json.id,
            new Pet(json.petType, json.petImage, json.petName, json.petDescription, json.petAge, json.petColor, json.petBreed, json.petGender, json.petIsNeutered, json.petVaccinations),
            json.userThatPostedId, json.userThatPostedFullName, json.userThatPostedCity, json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt,json.type);
    }

    toJson() {
        return {
            ...super.toJson(),
            petType: this.pet.type,
            petImage: this.pet.image,
            petName: this.pet.name,
            petAge: this.pet.age,
            petColor: this.pet.color,
            petBreed: this.pet.breed,
            petGender: this.pet.gender,
            petDescription: this.pet.description,
            petIsNeutered: this.pet.isNeutered,
            petVaccinations: this.pet.vaccinations
        };
    }


}

class HostingPost extends Post {
    constructor(id, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt, availableFromDate, availableToDate) {
        super(id, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt);
        this.availableFromDate = availableFromDate;
        this.availableToDate = availableToDate;
    }

    static fromJson(json) {
        return new HostingPost(json.id, json.userThatPostedId, json.userThatPostedFullName, json.userThatPostedCity, json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt, json.availableFromDate, json.availableToDate);
    }

    toJson() {
        return {
            ...super.toJson(),
            availableFromDate: this.availableFromDate,
            availableToDate: this.availableToDate
        };
    }

    render() {
        // hosting post rendering logic
    }
}

class LostPost extends Post {
    /**
     * @param {Pet} pet
     */
    constructor(id, pet, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt,type,lostLocation,lostDateAndTime) {
        super(id, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt,type);
        this.pet = pet;
        this.lostLocation = lostLocation;
        this.lostDateAndTime = lostDateAndTime.toDate().toString();

    }

    static fromJson(json) {
        return new LostPost(json.id,
            new Pet(json.petType, json.petImage, json.petName, json.petDescription, json.petAge, json.petColor, json.petBreed, json.petGender, json.petIsNeutered, json.petVaccinations),
            json.userThatPostedId, json.userThatPostedFullName, json.userThatPostedCity, json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt,json.type,json.lostLocation,json.lostDateAndTime);
    }

    toJson() {
        return {
            ...super.toJson(),
            petType: this.pet.type,
            petImage: this.pet.image,
            petName: this.pet.name,
            petAge: this.pet.age,
            petColor: this.pet.color,
            petBreed: this.pet.breed,
            petGender: this.pet.gender,
            petDescription: this.pet.description,
            petIsNeutered: this.pet.isNeutered,
            petVaccinations: this.pet.vaccinations,
            lostLocation: this.lostLocation,
            lostDateAndTime: this.lostDateAndTime

        };
    }


}

class FoundPost extends  Post {
    constructor(id, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt, foundLocation,foundDateAndTime) {
        super(id, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt);
        this.foundLocation = foundLocation;
        this.foundDateAndTime = foundDateAndTime;

    }

    static fromJson(json) {
        return new HostingPost(json.id, json.userThatPostedId, json.userThatPostedFullName, json.userThatPostedCity,
            json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt, json.foundLocation,json.foundDateAndTime);
    }

    toJson() {
        return {
            ...super.toJson(),
            foundLocation: this.foundLocation,
            foundDateAndTime: this.foundDateAndTime
        };
    }

}


// other types of posts can be added here as additional child classes of Post

export { Post, AdoptionPost, HostingPost,FoundPost,LostPost };