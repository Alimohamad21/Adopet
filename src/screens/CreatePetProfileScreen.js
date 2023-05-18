import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    TouchableHighlight
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
    appPurpleDark,
    appPurpleLight,
    borderGrey, CreatePetProfileScreenRoute, egyptianCatBreeds,
    egyptianCities, egyptianDogBreeds, fbStoragePetImagesDirectory,
    HomeScreenRoute,
    LoginScreenRoute, MainAppRoute, ProfileScreenRoute,
    UploadImageScreenRoute,
} from '../utilities/constants';
import {CurrentUserContext} from '../providers/CurrentUserProvider';
import TransparentLoadingIndicator from '../widgets/TransparentLoadingIndicator';
import AuthServices from '../services/AuthServices';
import UserServices from '../services/UserServices';
import PetServices from '../services/PetServices';
import User from '../models/User';
import Pet from '../models/Pet'
import RadioButtonComponent from "../widgets/RadioButtonComponent";
import DropdownComponent from '../widgets/DropdownComponent';
import {
    extractSubstringAfterDelimiter, removeSpacesFromString,
    validateConfirmPassword,
    validateEmail,
    validatePassword,
    validatePhoneNumber,
} from '../utilities/stringUtilities';

import PhoneInput from 'react-native-phone-input';
import {StatusBar} from 'native-base';
import firestore from "@react-native-firebase/firestore";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {pickImage} from "../utilities/imageUtilities";
import StorageServices from "../services/StorageServices";
import MenuImage from "../widgets/MenuImage";

const CreatePetProfileScreen = ({navigation}) => {

    const types = [
        { label: 'Cat', value: 'cat' },
        { label: 'Dog', value: 'dog' },
    ];

    const isSpayedOptions = [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
    ];


    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
    ];

    const {currentUser} = useContext(CurrentUserContext);

    const [photo, setPhoto] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [type, setType] = useState('');
    const [color, setColor] = useState('');
    const [breed, setBreed] = useState('');
    const [breedList, setBreedList] = useState('');
    const [gender, setGender] = useState('');
    const [isSpayed, setIsSpayed] = useState('');
    const [vaccinations, setVaccinations] = useState('');
    const [description, setDescription] = useState('');
    // let [breedsOfType, setBreedOfType] = useState('');

    let breedsOfType = 'egyptianDogBreeds';
    const [isLoading, setIsLoading] = useState(false);
    const [isNameEmpty, setIsNameEmpty] = useState(false);
    const [isAgeEmpty, setIsAgeEmpty] = useState(false);
    const [isTypeEmpty, setIsTypeEmpty] = useState(false);
    const [isColorEmpty, setIsColorEmpty] = useState(false);
    const [isBreedEmpty, setIsBreedEmpty] = useState(false);
    const [isGenderEmpty, setIsGenderEmpty] = useState(false);
    const [isSpayedEmpty, setIsSpayedEmpty] = useState(false);
    const [isVaccinationsEmpty, setIsVaccinationsEmpty] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    // const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(false);

    // const handleUploadImageScreenNavigation = () =>{
    //     navigation.navigate(UploadImageScreenRoute)
    // }

    const handleAddPhoto = async () => {
        const uri = await pickImage();
        if (!uri) return;
        setImageUri(uri);
        setIsLoading(true);
        const imageUrl = await StorageServices.uploadImageToFirebase(fbStoragePetImagesDirectory, uri);
        console.log(imageUrl);
        setPhoto(imageUrl);
        setIsLoading(false);
    }
    const handleNameChange = (text) => {
        setName(text);
        setIsNameEmpty(false);
    };

    const handleColorChange = (text) => {
        setColor(text);
        setIsColorEmpty(false);
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    }


    const handleBreedChange = (value) => {
        setBreed(value);
        setIsBreedEmpty(false);
        // console.log(type);
    };


    const handleVaccinationsChange = (text) => {
        setVaccinations(text);
        setIsVaccinationsEmpty(false);
    };

    const handleDescriptionChange = (text) => {
        setDescription(text);
    };


    const handleTypeChange = (value) => {
        setType(value);
        setBreedList(value.value);
        setIsTypeEmpty(false);
        // console.log(value.value, type);

    };

    const handleGenderChange = (value) => {
        setGender(value);
        setIsGenderEmpty(false);
    };


    const handleIsSpayedChange = (value) => {
        setIsSpayed(value);
        setIsSpayedEmpty(false);
    };

    const handleAgeChange = (date) => {
        setAge(date.dateString);
        setIsAgeEmpty(false);
        toggleCalendar();
    }

    const validateInputs = () => {
        let isValidInputs = true;
        if (name === '') {
            isValidInputs = false;
            setIsNameEmpty(true);
        }

        if (color === '') {
            isValidInputs = false;
            setIsColorEmpty(true);
        }
        if (breed === '') {
            isValidInputs = false;
            setIsBreedEmpty(true);
        }

        if (vaccinations === '') {
            isValidInputs = false;
            setIsVaccinationsEmpty(true);
        }

        if (type === '') {
            isValidInputs = false;
            setIsTypeEmpty(true);
        }

        if (gender === '') {
            isValidInputs = false;
            setIsGenderEmpty(true);
        }

        if (isSpayed === '') {
            isValidInputs = false;
            setIsSpayedEmpty(true);
        }

        if (age === '') {
            isValidInputs = false;
            setIsAgeEmpty(true);
        }

        // if (photo === '') {
        //     isValidInputs = false;
        //     setIsPhotoEmpty(true);
        // }

        return isValidInputs;
    };



    const handleCreatePetProfile = async () => {
        // const isValidInputs = validateInputs();
        if (1) {
            setIsLoading(true);
            const pet = new Pet(currentUser.uid, "", type.value, photo, name, description, age, color, breed.value, gender.value, isSpayed.value, vaccinations);
            // console.log("After creating pet")
            // console.log(pet);
            // console.log("User ID");
            // console.log(currentUser.uid);
            const newPid = await PetServices.addPet(pet);
            await firestore().collection('pets').doc(newPid).update({'pid': newPid});
            // console.log("Done updating");
            // console.log(newPid);
            navigation.replace(ProfileScreenRoute);
        }
    }



    return (
        <View style={styles.screen}>

            <StatusBar backgroundColor={appPurpleDark} barStyle="light-content"/>
            {isLoading && <TransparentLoadingIndicator/>}
            <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={styles.scrollView}>

                <View style={styles.container}>



                    <View >
                        <TouchableHighlight style={styles.btnClickContain} underlayColor="rgba(128, 128, 128, 0.1)" onPress={toggleCalendar}>
                            <View style={{ flexDirection: 'row'}}>
                                <Text style={styles.titles} >Add photo</Text>
                                <FontAwesome name="plus" size={24} onPress={handleAddPhoto}/>
                            </View>
                        </TouchableHighlight>

                    </View>

                    <Text style={styles.titles} >Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={handleNameChange}
                    />
                    {isNameEmpty && <Text style={styles.wrongCredentialsText}>Please enter your pet's name</Text>}

                    {/*<View >*/}
                        <Text style={styles.titles} >Birthdate</Text>

                        <TouchableHighlight style = {{justifyContent: "flex-start"}}
                            underlayColor="rgba(128, 128, 128, 0.1)" onPress={toggleCalendar}>
                            <View style={{ flexDirection: 'row'}}>
                                <FontAwesome name="calendar" size={23} style={styles.calendarBtn} icon="fa-solid fa-calendar-lines"/>
                                <Text style={styles.displayInput}> {age} </Text>
                            </View>
                        </TouchableHighlight>


                        {showCalendar && <Calendar style={styles.calendar}
                                                   onDayPress={handleAgeChange}
                                                   markedDates={{[age]: {selected: true}}}/>}

                        {isAgeEmpty && <Text style={styles.wrongCredentialsText}>Please select your pet's age</Text>}

                    {/*</View>*/}


                    <Text style={styles.titles} >Pet Type </Text>
                    <RadioButtonComponent
                        options={types}
                        selectedOption={type}
                        onSelect={handleTypeChange}
                    />

                    <Text style={styles.titles} >Color </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Color"
                        value={color}
                        onChangeText={handleColorChange}
                    />
                    {isColorEmpty && <Text style={styles.wrongCredentialsText}>Please enter your pet's color</Text>}

                    <Text style={styles.titles} >Breed</Text>
                    <DropdownComponent onSelect={handleBreedChange} data={breedList === 'cat' ? (egyptianCatBreeds) : (egyptianDogBreeds)} placeholder={"Breed"}/>
                    {isBreedEmpty && <Text style={styles.wrongCredentialsText}>Please enter a breed</Text>}


                    <Text style={styles.titles} >Pet gender</Text>
                    <RadioButtonComponent
                        options={genderOptions}
                        selectedOption={gender}
                        onSelect={handleGenderChange}
                    />

                    <Text style={styles.titles} >Is your pet spayed? </Text>
                    <RadioButtonComponent
                        options={isSpayedOptions}
                        selectedOption={isSpayed}
                        onSelect={handleIsSpayedChange}
                    />


                    <Text style={styles.titles} >Vaccinations</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Vaccinations"
                        value={vaccinations}
                        onChangeText={handleVaccinationsChange}
                    />
                    {isVaccinationsEmpty && <Text style={styles.wrongCredentialsText}>Please write 'none' if your pet is not vaccinated.</Text>}

                    <Text style={styles.titles} >Pet description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Describe your pet. ie playful, likes to cuddle, etc"
                        value={description}
                        onChangeText={handleDescriptionChange}
                    />

                </View>

                <View style={{alignItems: 'center'}}>


                    <View style={{marginTop: 10, flex: 1, width: '100%', alignItems: 'center'}}>
                        <TouchableOpacity style={styles.createPetProfileBtnContainer} onPress={handleCreatePetProfile}>
                            <Text style={styles.createPetProfileBtnText}>Create Pet Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    btnIcon: {
        height: 80,
        width: '85%',
        marginLeft: '3%',

    },
    container: {
        flex: 1,
        marginTop: '10%',
        alignItems: 'center',

    },
    input: {
        borderColor: borderGrey,
        fontFamily: 'sans-serif-medium',
        height: 40,
        width: '85%',
        margin: '3%',
        borderWidth: 1,
        padding: 10,
    },

    displayInput: {
        fontFamily: 'sans-serif-medium',
        height: 40,
        left: "50%",
    },
    titles: {
        fontFamily: 'sans-serif-medium',
        fontSize: 15,
        width: '85%',
        margin: '3%',
        marginBottom: -10,
        // borderWidth: 1,
        padding: 10,
        // left: "1%",
    },
    //
    // radioBtnContainer: {
    //     flexDirection: 'row',
    //
    //     // flex: 1,
    //     // alignItems: 'flex-start',
    //     // marginLeft: 50,
    //     // justifyContent: 'center',
    // },
    dropdownList: {
        borderColor: borderGrey,
        fontFamily: 'sans-serif-medium',
        height: 45,
        maxWidth: '100%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 0,

    },
    dropdownInput: {
        fontFamily: 'sans-serif-medium',
        color: 'grey',
        paddingRight: 0,
        marginRight: 0,
        marginLeft: 0,
        paddingLeft: 0,
    },
    dropdownView: {
        borderColor: borderGrey,
        fontFamily: 'sans-serif-medium',
        maxWidth: '85%',
    },
    logo: {

        marginTop: 60,
        width: 200,
        height: 110,
        resizeMode: 'contain',
    },
    header: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        alignItems: 'center',
        width: '100%',
        height: 190,
        backgroundColor: appPurpleDark,

    },

    calendarBtn: {
        color: appPurpleDark,
        // right: 240,
        // top: 18,
        // left: "3%",
    },

    calendar: {
        width: '100%',
        height: 350,
    },

    createPetProfileBtnContainer: {
        backgroundColor: appPurpleDark,
        alignItems: 'center',
        width: '60%',
        height: 35,
        borderRadius: 7,

    },
    createPetProfileBtnText: {
        fontFamily: 'sans-serif-medium',
        marginTop: 6,
        color: 'white',

    },

    loginBtnContainer: {
        marginTop: 10,
        backgroundColor: appPurpleLight,
        alignItems: 'center',
        width: '85%',
        height: 35,
        borderRadius: 7,
    },
    loginBtnText: {
        marginTop: 6,
        fontFamily: 'sans-serif-medium',
        color: 'white',
    },
    btnText: {
        fontFamily: 'sans-serif-medium',
        fontSize: 20,
        marginLeft: '5%',
        marginTop: 2,
        color: "gray",
    },
    orText: {
        marginTop: 50,
        fontFamily: 'sans-serif-medium',
        color: appPurpleDark,
    },
    wrongCredentialsText: {
        color: 'red',
        marginBottom: 10,
        // alignItems: 'center',
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    phoneNoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',


    },
    phoneInput: {
        margin: '3%',
        width: '85%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 0,
        paddingHorizontal: 10,
    },
    phoneInputText: {
        fontSize: 16,
        color: '#333',
    },
    flag: {
        width: 30,
        height: 20,
        resizeMode: 'contain',
    },
});

export default CreatePetProfileScreen;
