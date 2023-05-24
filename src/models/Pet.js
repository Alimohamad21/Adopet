class Pet {
    constructor(type, image, name, description, birthDate, color, breed, gender, isNeutered, vaccinations) {
        this.type = type;
        this.image = image;
        this.name = name;
        this.description = description;
        this.birthDate = birthDate;
        this.color = color;
        this.breed = breed;
        this.gender = gender;
        this.isNeutered = isNeutered;
        this.vaccinations = vaccinations;
    }

    static fromJson(json) {
        return new Pet(json.type, json.image, json.name, json.description, json.birthDate, json.color, json.breed, json.gender, json.isNeutered, json.vaccinations);
    }

    getPetAge() {
        let age = '';
        try {
            const currentDate = new Date();
            const bdMonth = parseInt(this.birthDate.split('-')[1]) - 1;
            const bdYear = parseInt(this.birthDate.split('-')[0]);
            const diffInMonths = (currentDate.getMonth() + 12 * currentDate.getFullYear()) - (bdMonth + 12 * bdYear);
            const years = Math.floor(diffInMonths / 12);
            const months = diffInMonths % 12;
            if (years !== 0) {
                age = `${years} years and ${months} months`;
            } else {
                age = `${months} months`;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
        return age;
    }

    static toJson(pet) {
        return {
            type: pet.type,
            image: pet.image,
            name: pet.name,
            description: pet.description,
            birthDate: pet.birthDate,
            color: pet.color,
            breed: pet.breed,
            gender: pet.gender,
            isNeutered: pet.isNeutered,
            vaccinations: pet.vaccinations
        };
    }
}

export default Pet;
