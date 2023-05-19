import firestore from '@react-native-firebase/firestore';
import Pet from '../models/Pet';
import User from "../models/User";
const {FieldValue}=firestore;

class PetServices{
    static async addPet(pet){
        try {
            const pid = await firestore().collection('pets').add(Pet.toJson(pet));
            console.log("Adding pet")
            console.log(pet);
            return pid.id;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }

    static async uploadPictureUrl(uid, url) {
        try {
            await firestore().collection('pets').doc(pid).update({image: url});
        } catch (error) {
            console.log(error.message);
            return false;
        }
        return true;
    }

    static async getPetAge(birthDate) {
        try {
            const currentDate = new Date();
            const diffInMonths = (currentDate.getMonth() + 12 * currentDate.getFullYear()) - (birthDate.getMonth() + 12 * birthDate.getFullYear());

            console.log(diffInMonths);

            const years = Math.floor(diffInMonths / 12);
            const months = diffInMonths % 12;

            console.log(years);
            console.log(months);
            console.log(`${years} years and ${months} months`);
            return [years, months];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default PetServices
