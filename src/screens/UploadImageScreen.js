import React, { useContext, useState } from "react";
import { Button, Image, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import StorageServices from '../services/StorageServices';
import {firebaseStoragePostsDirectory} from '../utilities/constants';
import UserServices from '../services/UserServices';
import {pickImage} from '../utilities/imageUtilities';
import ImagePickerButton from "../widgets/ImagePickerButton";
import { CurrentUserContext } from "../providers/CurrentUserProvider";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const UploadImageScreen = ({route,navigation}) => {
    //const {user}=route.params;
    const { currentUser,setCurrentUser } = useContext(CurrentUserContext);
    const [imageUri, setImageUri] = useState(null);
    const [imageFromFirebase,setImageFromFirebase] = useState(null);

    // const handlePickImage= async () => {
    //     const options = {
    //         mediaType: 'photo',
    //         maxWidth: 700,
    //         maxHeight: 700,
    //         selectionLimit:1
    //     };
    //     const uri =  pickImage(options);
    //     if(uri)
    //         setImageUri(uri);
    // }

    const handleImageUriChange = async (value) => {
        setImageUri(value);

    }

    const handleUploadImage = async () => {
        console.log(imageUri)
        if (!imageUri) {
            return;
        }
        const imageUrl = await StorageServices.uploadImageToFirebase(firebaseStoragePostsDirectory, imageUri);
        console.log(imageUrl);
        setImageFromFirebase(imageUrl)
        await UserServices.uploadProfilePictureUrl(currentUser.uid,imageUrl);
    };

    return (
        <View style={styles.container}>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            {/*/!*<Button title="Pick Image" onPress={handlePickImage} />*!/*/}


            {/*<View style={styles.container}>*/}
            {/*    {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}*/}
            {/*    <Button title="Pick an image" onPress={handlePickImage} />*/}
            {/*</View>*/}
            <View style={{alignItems:"center"}}>
                <Button title="Select Image" onPress={handleImageUriChange} />
                <FontAwesome name="image" style={styles.icon} />
                </View>
            <Button title="Upload Image" onPress={handleUploadImage} />
            {imageFromFirebase && <Image source={{ uri: imageFromFirebase }} style={styles.image} />}

        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 100,
        marginVertical: 10,
    },
});

export default UploadImageScreen;

