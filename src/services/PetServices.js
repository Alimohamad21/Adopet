import firestore from '@react-native-firebase/firestore';
import Pet from '../models/Pet';
import User from "../models/User";
import UserPet from '../models/UserPet';
import userPet from "../models/UserPet";
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
    static async editPet(pet){
        try {
            console.log(pet);
            await firestore().collection('pets').doc(pet.id).update(UserPet.toJson(pet));
            console.log(pet.id)
            console.log("Editing Pet")
            return true
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }
    static async deletePet(petId){

        const docRef = firestore().collection('pets').doc(petId);

        await docRef.delete();
    }
}

export default PetServices
