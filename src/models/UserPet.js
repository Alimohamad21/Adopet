import Pet from './Pet';
class UserPet {    /**
 * @param {Pet} pet
 */
    constructor(id, uid, pet) {
        this.id = id;
        this.uid = uid;
        this.pet = pet;
    }

    static fromJson(json) {
        return new UserPet(json.id,json.uid,Pet.fromJson(json.pet));
    }

    static toJson(userPet) {
        return {
            uid: userPet.uid,
            pet: userPet.pet,
        };
    }
}

export default UserPet;
