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
    const {currentUser} = useContext(CurrentUserContext);

    const [photo, setPhoto] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [type, setType] = useState('');
    const [color, setColor] = useState('');
    const [breed, setBreed] = useState('');
    const [gender, setGender] = useState('');
    const [isSpayed, setIsSpayed] = useState(false);
    const [vaccinations, setVaccinations] = useState('');
    const [description, setDescription] = useState('');
    let [breedsOfType, setBreedOfType] = useState('');

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

    const handleBreedChange = (text) => {
        setBreed(text);
        setIsBreedEmpty(false);
    };

    const handleVaccinationsChange = (text) => {
        setVaccinations(text);
        setIsVaccinationsEmpty(false);
    };

    const handleDescriptionChange = (text) => {
        setDescription(text);
    };

    const handleTypeChange = (value) => {
        setType(value.value);
        setIsTypeEmpty(false);
        if (value === "dog"){
            breedsOfType = egyptianDogBreeds;
        }
        else {
            breedsOfType = egyptianCatBreeds;
        }
    };
    const handleGenderChange = (value) => {
        setGender(value.value);
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
                {/*<View style={styles.header}>*/}
                {/*    <Image*/}
                {/*        style={styles.logo}*/}
                {/*        source={require('../assets/adopet_logo.png')}*/}
                {/*    />*/}

                {/*</View>*/}
                <View style={styles.container}>


                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={handleNameChange}
                    />
                    {isNameEmpty && <Text style={styles.wrongCredentialsText}>Please enter your pet's name</Text>}

                    <View>
                        <TouchableHighlight style={styles.btnClickContain} underlayColor="rgba(128, 128, 128, 0.1)" onPress={toggleCalendar}>
                            <View style={{ flexDirection: 'row'}}>
                                <FontAwesome name="calendar" size={25} style={{alignItems: "flex-start"}} icon="fa-solid fa-calendar-lines"/>
                                <Text style={styles.btnText} >Birthdate</Text>
                            </View>
                        </TouchableHighlight>

                        {showCalendar && <Calendar style={styles.calendar}
                                                   onDayPress={handleAgeChange}
                                                   markedDates={{[age]: {selected: true}}}/>}
                        {isAgeEmpty && <Text style={styles.wrongCredentialsText}>Please select your pet's age</Text>}

                    </View>



                    <TextInput
                        style={styles.input}
                        placeholder="Color"
                        value={color}
                        onChangeText={handleColorChange}
                    />
                    {isColorEmpty && <Text style={styles.wrongCredentialsText}>Please enter your pet's color</Text>}

                    <TextInput
                        style={styles.input}
                        placeholder="Breed"
                        value={breed}
                        onChangeText={handleBreedChange}
                    />
                    {isBreedEmpty && <Text style={styles.wrongCredentialsText}>Please enter your pet's breed</Text>}

                    <TextInput
                        style={styles.input}
                        placeholder="Vaccinations"
                        value={vaccinations}
                        onChangeText={handleVaccinationsChange}
                    />
                    {isVaccinationsEmpty && <Text style={styles.wrongCredentialsText}>Please write 'none' if your pet is not vaccinated.</Text>}

                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={description}
                        onChangeText={handleDescriptionChange}
                    />



                    <DropdownComponent onSelect={handleBreedChange} data={breedsOfType} placeholder={"Breed"}/>
                    {isBreedEmpty && <Text style={styles.wrongCredentialsText}>Please enter a breed</Text>}

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
        marginTop: '60%',
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
        width: '100%',
        height: 350,
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
