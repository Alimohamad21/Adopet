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
}

export default PetServices
