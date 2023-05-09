import React, {useContext, useState} from 'react';
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
    borderGrey, egyptianCatBreeds,
    egyptianCities, egyptianDogBreeds,
    HomeScreenRoute,
    LoginScreenRoute, MainAppRoute,
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
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [type, setType] = useState(types[0]);
    const [color, setColor] = useState('');
    const [breed, setBreed] = useState('');
    const [gender, setGender] = useState(genderOptions[0]);
    const [isSpayed, setIsSpayed] = useState(isSpayedOptions[0]);
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
    };

    // const handleBreedChange = (text) => {
    //     setBreed(text);
    //     setIsBreedEmpty(false);
    // };

    const handleVaccinationsChange = (text) => {
        setVaccinations(text);
        setIsVaccinationsEmpty(false);
    };

    const handleDescriptionChange = (text) => {
        setDescription(text);
    };


    const handleTypeChange = (value) => {
        setType(value);
        setIsTypeEmpty(false);
        if (value === "dog"){
            breedsOfType = egyptianDogBreeds;
        }
        else {
            breedsOfType = egyptianCatBreeds;
        }
    };
    const handleGenderChange = (value) => {
        setGender(value);
        setIsGenderEmpty(false);
    };


    const handleIsSpayedChange = (value) => {
        setIsSpayed(value.value);
        setIsSpayedEmpty(false);
    };

    const handleAgeChange = (date) => {
        setAge(date.dateString);
        setIsAgeEmpty(false);
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

        if (photo === '') {
            isValidInputs = false;
            setIsPhotoEmpty(true);
        }

        return isValidInputs;
    };



    const handleCreatePetProfile = async () => {
        const isValidInputs = validateInputs();
        if (isValidInputs) {
            setIsLoading(true);
            const pet = new Pet(currentUser.uid, '', type, photo, name, description, age, color, breed, gender, isSpayed, vaccinations);
            await PetServices.addPet(pet);
            navigation.replace("AuthLoading");
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
                                <FontAwesome name="plus" size={24} />
                            </View>
                        </TouchableHighlight>

                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={handleNameChange}
                    />
                    {isNameEmpty && <Text style={styles.wrongCredentialsText}>Please enter your pet's name</Text>}

                    <View >
                        <TouchableHighlight style={styles.btnClickContain} underlayColor="rgba(128, 128, 128, 0.1)" onPress={toggleCalendar}>
                            <View style={{ flexDirection: 'row'}}>
                                <Text style={styles.titles} >Birthdate</Text>
                                <FontAwesome name="calendar" size={23} style={styles.calendar} icon="fa-solid fa-calendar-lines"/>
                            </View>
                        </TouchableHighlight>

                        {isAgeEmpty && <Text style={styles.wrongCredentialsText}>Please select your pet's age</Text>}

                    </View>


                    <Text style={styles.titles} >Pet Type </Text>
                    <RadioButtonComponent
                        options={types}
                        selectedOption={type}
                        onSelect={handleTypeChange}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Color"
                        value={color}
                        onChangeText={handleColorChange}
                    />
                    {isColorEmpty && <Text style={styles.wrongCredentialsText}>Please enter your pet's color</Text>}

                    <DropdownComponent onSelect={handleBreedChange} data={breedsOfType === 'egyptianCatBreeds'? egyptianCatBreeds: egyptianDogBreeds} placeholder={"Breed"}/>
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


                    <TextInput
                        style={styles.input}
                        placeholder="Vaccinations"
                        value={vaccinations}
                        onChangeText={handleVaccinationsChange}
                    />
                    {isVaccinationsEmpty && <Text style={styles.wrongCredentialsText}>Please write 'none' if your pet is not vaccinated.</Text>}

                    <TextInput
                        style={styles.input}
                        placeholder="Describe your pet. ie playful, likes to cuddle, etc"
                        value={description}
                        onChangeText={handleDescriptionChange}
                    />




                </View>

                {/*<View style={{alignItems: 'center'}}>*/}


                {/*    <View style={{marginTop: 10, flex: 1, width: '100%', alignItems: 'center'}}>*/}
                {/*        <TouchableOpacity style={styles.signupBtnContainer} onPress={handleSignup}>*/}
                {/*            <Text style={styles.signupBtnText}>Create Account</Text>*/}
                {/*        </TouchableOpacity>*/}
                {/*    </View>*/}
                {/*    <Text style={styles.orText}>Or</Text>*/}
                {/*    <View style={{marginBottom: 40, flex: 1, width: '100%', alignItems: 'center'}}>*/}
                {/*        <TouchableOpacity style={styles.loginBtnContainer}*/}
                {/*                          onPress={() => navigation.replace(LoginScreenRoute)}>*/}
                {/*            <Text style={styles.loginBtnText}>Login with an existing account</Text>*/}
                {/*        </TouchableOpacity>*/}
                {/*    </View>*/}
                {/*</View>*/}

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
    titles: {
        // borderColor: borderGrey,
        fontFamily: 'sans-serif-medium',
        // height: 80,
        fontSize: 15,
        width: '85%',
        margin: '3%',
        marginBottom: -10,
        // borderWidth: 1,
        padding: 10,
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

    calendar: {
        // width: '10%',
        // height: 50,
        color: appPurpleDark,
        right: 240,
        top: 18,
    },
    signupBtnContainer: {
        backgroundColor: appPurpleDark,
        alignItems: 'center',
        width: '85%',
        height: 35,
        borderRadius: 7,

    },
    signupBtnText: {
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
