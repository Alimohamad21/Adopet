import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
// Add other required imports and constants here
const EditPetDetailsScreen = () => {
    const [petName, setPetName] = useState("");
    const [age, setAge] = useState("");
    const [breed, setBreed] = useState("");
    const [gender, setGender] = useState("");
    // Add other state variables for pet details here

    const handleUpdate = () => {
        // Handle update logic here
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileIconContainer}>
                    {/* Display pet profile picture */}
          {/*<Image source={require("../assets/pet_profile_picture.png")} style={styles.profileIcon} />*/}
        </View>

        <TouchableOpacity style={styles.changePictureButton}>
          <Text style={styles.changePictureButtonText}>Change Profile Picture</Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pet Name"
            value={petName}
            onChangeText={setPetName}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
          />
          <TextInput
            style={styles.input}
            placeholder="Breed"
            value={breed}
            onChangeText={setBreed}
          />
          <TextInput
            style={styles.input}
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
          />
          {/ Add other input fields for pet details here */}
                </View>

                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                    <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    profileIconContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    profileIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: "cover",
    },
    changePictureButton: {
        marginTop: 10,
        alignItems: "center",
    },
    changePictureButtonText: {
        color: "blue",
        textDecorationLine: "underline",
    },
    formContainer: {
        marginTop: 20,
    },
    input: {
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    updateButton: {
        backgroundColor: "blue",
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 5,
        marginTop: 20,
    },
    updateButtonText: {
        color: "white",
        fontSize: 16,
    },
});
export default EditPetDetailsScreen;
