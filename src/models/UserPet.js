import Pet from './Pet';
class UserPet {
    constructor(uid, pid, pet) {
        this.uid = uid;
        this.pid = pid;
        this.pet = pet;
    }

    static fromJson(json) {
        return new UserPet(json.uid,json.pid,json.pet);
    }

    static toJson(userPet) {
        return {
            uid: userPet.uid,
            pid: userPet.pid,
            pet: userPet.pet,

        };
    }
}

export default UserPet;
