import React, { useState } from 'react';
import { Button, Image, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import StorageServices from '../services/StorageServices';
import {firebaseStoragePostsDirectory} from '../utilities/constants';
import UserServices from '../services/UserServices';
import {pickImage} from '../utilities/imageUtilities';

const UploadImageScreen = ({route,navigation}) => {
    const {user}=route.params;
    const [imageUri, setImageUri] = useState(null);
    const [imageFromFirebase,setImageFromFirebase] = useState(null);

    const handlePickImage= async () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 700,
            maxHeight: 700,
            selectionLimit:1
        };
        const uri=await pickImage(options);
        setImageUri(uri);
    }

    const handleUploadImage = async () => {
        console.log(imageUri)
        if (!imageUri) {
            return;
        }
        const imageUrl = await StorageServices.uploadImageToFirebase(firebaseStoragePostsDirectory, imageUri);
        console.log(imageUrl);
        setImageFromFirebase(imageUrl)
        await UserServices.uploadProfilePictureUrl(user.uid,imageUrl);
    };

    return (
        <View style={styles.container}>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            <Button title="Pick Image" onPress={handlePickImage} />
            <Button title="Upload Image" onPress={handleUploadImage} />
            {imageFromFirebase && <Image source={{ uri: imageFromFirebase }} style={styles.image} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
});

export default UploadImageScreen;

