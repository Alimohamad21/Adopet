import firestore from '@react-native-firebase/firestore';
import User from '../models/User';
import storage from '@react-native-firebase/storage';

class StorageServices {
    static async uploadImageToFirebase(directory, image) {
        // Generate a unique ID for the image file
        const imageName = Date.now().toString();

        // Get the reference to the Firebase Storage directory where the image will be uploaded
        const storageRef = storage().ref(directory);

        // Create a reference to the image file
        const imageRef = storageRef.child(imageName);

        // Upload the image to Firebase Storage
        await imageRef.putFile(image);

        // Get the download URL of the image
        const imageUrl = await imageRef.getDownloadURL();

        // Return the download URL of the image
        return imageUrl;
    }
}

export default StorageServices;
