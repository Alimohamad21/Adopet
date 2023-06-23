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
          json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt,json.type);
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
        //const dateString = moment(date).format('YYYY-MM-DD HH:mm:ss')
        this.lostDateAndTime = lostDateAndTime;

    }

    static fromJson(json) {
        console.log(json.lostDateAndTime)
        return new LostPost(json.id,
          new Pet(json.petType, json.petImage, json.petName, json.petDescription, json.petBirthDate, json.petColor, json.petBreed, json.petGender, json.petIsNeutered, json.petVaccinations),
          json.userThatPostedId, json.userThatPostedFullName, json.userThatPostedCity, json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt,json.type,json.lostLocation,json.lostDateAndTime.toDate().toDateString());
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


class FoundPost extends Post {
    /**
     * @param {Pet} pet
     */
    constructor(id, pet, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt,type,foundLocation,foundDateAndTime) {
        super(id, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt,type);
        this.pet = pet;
        this.foundLocation = foundLocation;
        this.foundDateAndTime = foundDateAndTime.toDate().toDateString();


    }

    static fromJson(json) {
        console.log(json.lostDateAndTime)
        return new FoundPost(json.id,
          new Pet(json.petType, json.petImage, json.petName, json.petDescription, json.petBirthDate, json.petColor, json.petBreed, json.petGender, json.petIsNeutered, json.petVaccinations),
          json.userThatPostedId, json.userThatPostedFullName, json.userThatPostedCity, json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt,json.type,json.foundLocation,json.foundDateAndTime);
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
        this.startDate = startDate;
        this.endDate = endDate;
        this.duration = duration;
    }

    static fromJson(json) {
        return new HostingPost(json.id,
          new Pet(json.petType, json.petImage, json.petName, json.petDescription, json.petBirthDate,
            json.petColor, json.petBreed, json.petGender, json.petIsNeutered, json.petVaccinations),
          json.userThatPostedId, json.userThatPostedFullName, json.userThatPostedCity,
          json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt,
          json.type,json.startDate.toDate().toString(),json.endDate.toDate().toString(),json.duration);
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
