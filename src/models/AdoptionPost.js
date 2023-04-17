import Pet from './Pet'
class AdoptionPost {
    /**
     * @param {Pet} pet
     */
    constructor(id, pet, userThatPostedId, userThatPostedFullName, userThatPostedCity, userThatPostedProfilePicture, userThatPostedPhoneNumber, createdAt) {
        this.id = id;
        this.pet = pet;
        this.userThatPostedId = userThatPostedId;
        this.userThatPostedFullName = userThatPostedFullName;
        this.userThatPostedCity = userThatPostedCity;
        this.userThatPostedProfilePicture = userThatPostedProfilePicture;
        this.userThatPostedPhoneNumber = userThatPostedPhoneNumber;
        this.createdAt = createdAt;
    }

    static fromJson(json) {
        return new AdoptionPost(json.id,
            new Pet(json.petType, json.petImage, json.petName, json.petDescription,
                json.petAge, json.petColor, json.petBreed, json.petGender, json.petIsNeutered, json.petVaccinations)
            , json.userThatPostedId, json.userThatPostedFullName, json.userThatPostedCity,
            json.userThatPostedProfilePicture, json.userThatPostedPhoneNumber, json.createdAt);
    }

    static toJson(adoptionPost) {
        return {
            petType: adoptionPost.pet.type,
            petImage: adoptionPost.pet.image,
            petName: adoptionPost.pet.name,
            petAge: adoptionPost.pet.age,
            petColor: adoptionPost.pet.color,
            petBreed: adoptionPost.pet.breed,
            petGender: adoptionPost.pet.gender,
            petDescription: adoptionPost.pet.description,
            petIsNeutered: adoptionPost.pet.isNeutered,
            petVaccinations: adoptionPost.pet.vaccinations,
            userThatPostedId: adoptionPost.userThatPostedId,
            userThatPostedFullName: adoptionPost.userThatPostedFullName,
            userThatPostedCity: adoptionPost.userThatPostedCity,
            userThatPostedProfilePicture: adoptionPost.userThatPostedProfilePicture,
            userThatPostedPhoneNumber: adoptionPost.userThatPostedPhoneNumber,
            createdAt: adoptionPost.createdAt,
        };
    }
}
export default AdoptionPost;
