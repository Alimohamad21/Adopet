class Pet {
    constructor(uid, pid, type, photo, name, description, age, color, breed, gender, isSpayed, vaccinations) {
        this.type = type;
        this.uid = uid;
        this.pid = pid;
        this.photo = photo;
        this.name = name;
        this.description = description;
        this.age = age;
        this.color = color;
        this.breed = breed;
        this.gender = gender;
        this.isSpayed = isSpayed;
        this.vaccinations = vaccinations;
    }

    static fromJson(json) {
        return new Pet(json.uid,json.pid,json.type, json.photo, json.name, json.description, json.age, json.color, json.breed, json.gender, json.isSpayed, json.vaccinations);
    }

    static toJson(pet) {
        return {
            uid: pet.uid,
            pid: pet.pid,
            type: pet.type,
            photo: pet.photo,
            name: pet.name,
            description: pet.description,
            age: pet.age,
            color: pet.color,
            breed: pet.breed,
            gender: pet.gender,
            isSpayed: pet.isSpayed,
            vaccinations: pet.vaccinations
        };
    }
}

export default Pet;
