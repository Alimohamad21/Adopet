import * as ImagePicker from "react-native-image-picker";


export const pickImage = async (options = {
  mediaType: "photo",
  maxWidth: 700,
  maxHeight: 700,
  selectionLimit: 1,
}) => {
  const result = await ImagePicker.launchImageLibrary(options);
  console.log(result.assets);
  if(!result.assets) return null;
  return result.assets[0].uri;
};
