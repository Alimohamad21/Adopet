import * as ImagePicker from 'react-native-image-picker';

export const pickImage = async (options) => {
    const result=await ImagePicker.launchImageLibrary(options);
    if (!result.assets) return null;
    return result.assets[0].uri;
};
