import React, {useContext, useState} from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    Image,
    TouchableHighlight
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
    appPurpleDark,
    appPurpleLight,
    borderGrey, egyptianCatBreeds, vaccinationOptions,
    egyptianDogBreeds, fbStoragePetImagesDirectory, catAndDogColors, ProfileScreenRoute,
} from '../utilities/constants';
import {CurrentUserContext} from '../providers/CurrentUserProvider';
import TransparentLoadingIndicator from '../widgets/TransparentLoadingIndicator';
import PetServices from '../services/PetServices';
import Pet from '../models/Pet'
import RadioButtonComponent from "../widgets/RadioButtonComponent";
import DropdownComponent from '../widgets/DropdownComponent';
import Post, { AdoptionPost, HostingPost, FoundPost } from "../models/Post";


import {StatusBar} from 'native-base';
import firestore from "@react-native-firebase/firestore";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {pickImage} from "../utilities/imageUtilities";
import StorageServices from "../services/StorageServices";
import UserPet from '../models/UserPet';
import PostServices from "../services/PostServices";
import SuccessPopUp from "../widgets/SuccessPopUp";
// import {Calendar} from "react-native-calendars";

const AddFoundPostScreen = ({navigation}) => {

    const {currentUser} = useContext(CurrentUserContext);

    const [imageUri, setImageUri] = useState(null);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [dateFound, setDateFound] = useState('');
    const [type, setType] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isPhotoEmpty, setIsPhotoEmpty] = useState(false);
    const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(false);
    const [isLocationEmpty, setIsLocationEmpty] = useState(false);
    const [isDateFoundEmpty, setIsDateFoundEmpty] = useState(false);
    const [isTypeEmpty, setIsTypeEmpty] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showSuccessPopUp, setShowSuccessPopUp] = useState(false);

    const types = [
        { label: 'Cat', value: 'Cat' },
        { label: 'Dog', value: 'Dog' },
    ];
    const handleAddPhoto = async () => {
        const uri = await pickImage();
        if (!uri) return;
        setImageUri(uri);
        setIsPhotoEmpty(false);
    }

    const handleDescriptionChange = (text) => {
        setDescription(text);
        setIsDescriptionEmpty(false);
    };

    const handleLocationChange = (text) => {
        setLocation(text);
        setIsLocationEmpty(false);
    };

    const onConfirmSuccess = () => {
        setShowSuccessPopUp(false);
        navigation.replace(ProfileScreenRoute);
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    }

    const handleDateChange = (value) => {
        setDateFound(value.dateString);
        console.log(dateFound);
        setIsDateFoundEmpty(false);
        toggleCalendar();
    }

    const handleTypeChange = (value) => {
        setType(value);
        setIsTypeEmpty(false);
    };

    const validateInputs = () => {
        let isValidInputs = true;
        if (description === '') {
            isValidInputs = false;
            setIsDescriptionEmpty(true);
        }

        if (imageUri === null) {
            isValidInputs = false;
            setIsPhotoEmpty(true);
        }

        if (location === '') {
            isValidInputs = false;
            setIsLocationEmpty(true);
        }

        // if (dateFound === '') {
        //     isValidInputs = false;
        //     setIsDateFoundEmpty(true);
        // }


        if (type === '') {
            isValidInputs = false;
            setIsTypeEmpty(true);
        }

        return isValidInputs;
    };


    const handleAddPost = async () => {
        const isValidInputs = validateInputs();
        const dateFoundTimestamp = new Date(dateFound);
        const date = new Date();
        if (isValidInputs) {
            setIsLoading(true);
            const photo = await StorageServices.uploadImageToFirebase(fbStoragePetImagesDirectory, imageUri);
            const foundPost = new FoundPost('', new Pet( type.value, photo, description, '', '', '', '', '', '', ''), currentUser.uid, currentUser.fullName, currentUser.city, currentUser.profilePicture, currentUser.phoneNumber, date, 'Found', location, dateFoundTimestamp)
            await PostServices.addFoundPost(foundPost);
            setShowSuccessPopUp(true);
            console.log(showSuccessPopUp);
        }
        }


    return (
        <View style={styles.screen}>

            <StatusBar backgroundColor={appPurpleDark} barStyle="light-content"/>
            {isLoading && <TransparentLoadingIndicator/>}
            <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={styles.scrollView}>

                <View style={styles.container}>

                    <Text style={styles.titles} >Add photo</Text>
                    <TouchableHighlight underlayColor="rgba(128, 128, 128, 0.1)"  >
                        <FontAwesome name={'plus-circle'}  onPress={handleAddPhoto} style={styles.addPhoto} ></FontAwesome>
                    </TouchableHighlight>
                    {imageUri && <Image source={{uri:imageUri}} style={styles.image}/>}

                    {isPhotoEmpty && <Text style={styles.wrongCredentialsText}>Please add a picture of the pet you found.</Text>}

                    <Text style={styles.titles} >Pet Type </Text>
                    <RadioButtonComponent
                        options={types}
                        selectedOption={type}
                        onSelect={handleTypeChange}
                    />
                    {isTypeEmpty && <Text style={styles.wrongCredentialsText}>Please select whether you found a lost cat or dog.</Text>}


                    <Text style={styles.titles} >Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={description}
                        onChangeText={handleDescriptionChange}
                    />
                    {isDescriptionEmpty && <Text style={styles.wrongCredentialsText}>Please enter a description of the pet.</Text>}


                    <Text style={styles.titles} >Pet location</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Add the location where you found the pet."
                        value={location}
                        onChangeText={handleLocationChange}
                    />
                    {isLocationEmpty && <Text style={styles.wrongCredentialsText}>Please enter the location where you found the pet.</Text>}


                    <View style={styles.calendarComponent}>
                        <Text>Date found</Text>
                        <Text style={{left: 10}}> {dateFound} </Text>
                    </View>

                    <TouchableHighlight
                        underlayColor="rgba(128, 128, 128, 0.1)" >
                        <FontAwesome name="calendar" onPress={toggleCalendar} size={23} style={styles.faIcons} icon="fa-solid fa-calendar-lines"/>
                    </TouchableHighlight>


                    {showCalendar && <Calendar style={styles.calendar}
                                               onDayPress={handleDateChange}
                                               markedDates={{[dateFound]: {selected: true}}}/>}

                    {isDateFoundEmpty && <Text style={styles.wrongCredentialsText}>Please select the date on which you found the pet.</Text>}


                </View>

                <View style={{alignItems: 'center'}}>
                    <SuccessPopUp
                        visible={showSuccessPopUp}
                        confirmationText={`The post for the missing ${type.value} was successfully placed.`}
                        onConfirm={onConfirmSuccess}
                    />
                    <View style={{marginTop: 10, flex: 1, width: '100%', alignItems: 'center'}}>
                        <TouchableOpacity style={styles.createPetProfileBtnContainer} onPress={handleAddPost}>
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
    image: {
        width: '80%',
        aspectRatio: 1,
        resizeMode: 'contain',
        marginTop: 20,
        marginBottom: 20,
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

    calendarComponent: {
        flexDirection: 'row',
        fontFamily: 'sans-serif-medium',
        fontSize: 15,
        width: '85%',
        margin: '3%',
        marginBottom: -10,
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

    faIcons: {
        color: appPurpleDark,
        left: -140,
        top: 18,
        marginBottom: '3%',
    },

    addPhoto: {
        color: appPurpleDark,
        fontSize: 30,
        right: "37%",
        top: 18,
        marginBottom: '3%',
    },

    calendar: {
        width: '100%',
        height: 350,
    },

    createPetProfileBtnContainer: {
        backgroundColor: appPurpleDark,
        alignItems: 'center',
        width: '85%',
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

export default AddFoundPostScreen;
