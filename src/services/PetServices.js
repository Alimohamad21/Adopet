import firestore from '@react-native-firebase/firestore';
import Pet from '../models/Pet';
import User from "../models/User";
import UserPet from '../models/UserPet';
const {FieldValue}=firestore;

class PetServices{
    static async addPet(pet){
        try {
            await firestore().collection('pets').add(UserPet.toJson(pet));
            console.log("Adding pet")
            console.log(pet);
            return true
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }
}

export default PetServices
