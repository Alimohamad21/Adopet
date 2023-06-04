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
            new Pet(json.petType, json.petImage, json.petName, json.petDescription,
                json.petBirthDate, json.petColor, json.petBreed, json.petGender, json.petIsNeutered, json.petVaccinations)
            , json.userThatPostedId, json.userThatPostedFullName, json.userThatPostedCity,
            json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt);
    }

    toJson() {
        return {
            ...super.toJson(),
            petType: this.pet.type,
            petImage: this.pet.image,
            petName: this.pet.name,
            petBirthDate: this.pet.birthDate,
            petColor: this.pet.color,
            petBreed: this.pet.breed,
            petGender: this.pet.gender,
            petDescription: this.pet.description,
            petIsNeutered: this.pet.isNeutered,
            petVaccinations: this.pet.vaccinations,
        };
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
            new Pet(json.petType, json.petImage, json.petName, json.petDescription, json.petBirthDate, json.petColor, json.petBreed, json.petGender, json.petIsNeutered, json.petVaccinations),
            json.userThatPostedId, json.userThatPostedFullName, json.userThatPostedCity, json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt,json.type,json.lostLocation,json.lostDateAndTime);
    }

    toJson() {
        return {
            ...super.toJson(),
            petType: this.pet.type,
            petImage: this.pet.image,
            petName: this.pet.name,
            petBirthDate: this.pet.birthDate,
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
class HostingPost extends Post {
    /**
     * @param {Pet} pet
     */
    constructor(id, pet, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture,
                userThatPostedPhoneNumber, createdAt,type,endDate,startDate,duration) {
        super(id, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt,type);
        this.pet = pet;
        this.startDate = startDate.toDate().toString();
        this.endDate = endDate.toDate().toString();
        this.duration = duration;
    }

    static fromJson(json) {
        return new HostingPost(json.id,
            new Pet(json.petType, json.petImage, json.petName, json.petDescription, json.petBirthDate,
                json.petColor, json.petBreed, json.petGender, json.petIsNeutered, json.petVaccinations),
            json.userThatPostedId, json.userThatPostedFullName, json.userThatPostedCity,
            json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt,
            json.type,json.startDate,json.endDate,json.duration);
    }

    toJson() {
        return {
            ...super.toJson(),
            petType: this.pet.type,
            petImage: this.pet.image,
            petName: this.pet.name,
            petBirthDate: this.pet.birthDate,
            petColor: this.pet.color,
            petBreed: this.pet.breed,
            petGender: this.pet.gender,
            petDescription: this.pet.description,
            petIsNeutered: this.pet.isNeutered,
            petVaccinations: this.pet.vaccinations,
            startDate:this.startDate,
            endDate:this.endDate,
            duration:this.duration


        };
    }


}


// other types of posts can be added here as additional child classes of Post

export { Post, AdoptionPost, HostingPost,FoundPost,LostPost };
