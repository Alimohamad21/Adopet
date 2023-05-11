import  {StyleSheet,TouchableOpacity} from "react-native";
import React, {useState} from "react";
import {pickImage} from "../utilities/imageUtilities";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {appPurpleDark} from "../utilities/constants";
const ImagePickerButton = ({onPick}) => {
    const [imageUri, setImageUri] = useState(null);
    const handlePickImage = async () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 700,
            maxHeight: 700,
            selectionLimit: 1
        };
        const uri = await pickImage(options);
        if (uri){
            setImageUri(uri)
              onPick(uri)
        }


    }
    return (

           // <View style={styles.container}>
                <TouchableOpacity onPress={handlePickImage} >
                    <FontAwesome name="image" style={styles.icon} />
                    </TouchableOpacity>
            //</View>




);

};
    const styles = StyleSheet.create({

        icon: {
        fontSize:30,
            color:appPurpleDark,

        },


    });
    export default ImagePickerButton;
