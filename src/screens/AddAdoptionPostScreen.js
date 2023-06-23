import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  TouchableHighlight, Dimensions,
} from "react-native";
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
import Post, { AdoptionPost } from "../models/Post";
import RadioButtonComponent from "../widgets/RadioButtonComponent";
import DropdownComponent from '../widgets/DropdownComponent';

import { FlatList, StatusBar } from "native-base";
import firestore from "@react-native-firebase/firestore";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {pickImage} from "../utilities/imageUtilities";
import StorageServices from "../services/StorageServices";
import UserPet from '../models/UserPet';
import PostServices from "../services/PostServices";
import UserServices from "../services/UserServices";
import ConfirmationPopUp from '../widgets/ConfirmationPopUp';
import SuccessPopUp from '../widgets/SuccessPopUp';

const AddAdoptionPostScreen = ({navigation}) => {

  const {currentUser} = useContext(CurrentUserContext);

  const [userPets,setUserPets] = useState(null);
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

  const [isLoading, setIsLoading] = useState(false);
  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [isPhotoEmpty, setIsPhotoEmpty] = useState(false);
  const [isAgeEmpty, setIsAgeEmpty] = useState(false);
  const [isTypeEmpty, setIsTypeEmpty] = useState(false);
  const [isColorEmpty, setIsColorEmpty] = useState(false);
  const [isBreedEmpty, setIsBreedEmpty] = useState(false);
  const [isGenderEmpty, setIsGenderEmpty] = useState(false);
  const [isSpayedEmpty, setIsSpayedEmpty] = useState(false);
  const [isVaccinationsEmpty, setIsVaccinationsEmpty] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false);
  const [createPostPopUp, setCreatePostPopUp] = useState(false);
  const [selectedPet, setSelectedPet] =useState(null);
  const [showSuccessPopUp, setShowSuccessPopUp] = useState(false);

  useEffect(   () => {
    const getUserPets = async () => {
      const pets = await UserServices.getUserPets(currentUser.uid);
      setUserPets(pets);
    }

    getUserPets().then()



  },[navigation])

  const types = [
    { label: 'Cat', value: 'Cat' },
    { label: 'Dog', value: 'Dog' },
  ];

  const isSpayedOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];


  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  const handleAddPhoto = async () => {
    const uri = await pickImage();
    if (!uri) return;
    setImageUri(uri);
    setIsPhotoEmpty(false);
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
  };


    const handleToggle = () => {
    setIsVisible(!isVisible);
  };
  const handleShowAddPet = (item) => {
    setSelectedPet(item);
    setCreatePostPopUp(true);
  };

    const handleBreedChange = (value) => {
    setBreed(value);
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
    setType(value);
    setBreedList(value.value);
    setIsTypeEmpty(false);
  };

  const handleGenderChange = (value) => {
    setGender(value);
    setIsGenderEmpty(false);
  };


  const handleIsSpayedChange = (value) => {
    setIsSpayed(value)
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
    if (imageUri === null) {
      isValidInputs = false;
      setIsPhotoEmpty(true);
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
    return isValidInputs;
  };
  const handleAddPostFromUserPets = async (item) => {
    const date = new Date;
    //setIsLoading(true);
    const adoptionPost = new AdoptionPost('', new Pet( item.pet.type, item.pet.image, item.pet.name, item.pet.description, item.pet.birthDate, item.pet.color, item.pet.breed, item.pet.gender, item.pet.isNeutered, item.pet.vaccinations), currentUser.uid, currentUser.fullName, currentUser.city, currentUser.profilePicture, currentUser.phoneNumber, date, 'Adoption');
    await PostServices.addAdoptionPost(adoptionPost);
   // navigation.replace(ProfileScreenRoute);
    setCreatePostPopUp(false);
    setShowSuccessPopUp(true);
  }

  const handleAddPostManually = async () => {
    const isValidInputs = validateInputs();
    const date = new Date();
    if (isValidInputs) {
     // setIsLoading(true);
      const photo = await StorageServices.uploadImageToFirebase(fbStoragePetImagesDirectory, imageUri);
      const adoptionPost = new AdoptionPost('', new Pet( type.value, photo, name, description, age, color.value, breed.value, gender.value, isSpayed.value, vaccinations.value), currentUser.uid, currentUser.fullName, currentUser.city, currentUser.profilePicture, currentUser.phoneNumber, date, 'Adoption')
      await PostServices.addAdoptionPost(adoptionPost);
      setShowSuccessPopUp(true);
    }
  }
  const onCancelPutPetForAdoption = () => {
    setCreatePostPopUp(false);
  };
  const onConfirmSuccess = () => {
    setShowSuccessPopUp(false);
    navigation.replace(ProfileScreenRoute, {"userParam": null})
  };
  const renderPet = ({ item }) => {
    return (
      <View>
      <TouchableOpacity style={{ alignItems: 'center' }} onPress={()=>{
        handleShowAddPet(item)}}>
        <Image
          source={{ uri: item.pet.image }}
          style={styles.petIcon}
        />
        <Text style={{ fontWeight: 'bold', fontSize: 16, alignItems: 'center' }}>
          {item.pet.name}
        </Text>
      </TouchableOpacity>
    </View>
    );
  };

  return (
    <View style={styles.screen}>
      {selectedPet && <ConfirmationPopUp
        visible={createPostPopUp}
        confirmationText={`Are you sure you want to put ${selectedPet.pet.name} up for adoption?`}
        onConfirm={() => handleAddPostFromUserPets(selectedPet)}
        onCancel={onCancelPutPetForAdoption}
      />}
      {selectedPet && <SuccessPopUp
        visible={showSuccessPopUp}
        confirmationText={`${selectedPet.pet.name} was successfully placed for adoption`}
        onConfirm={onConfirmSuccess}
      />}
      <Text style={styles.option}>Choose from your pets</Text>
      {!isVisible && <View style={{height:"20%"}}>
        {userPets && userPets.length > 0 ? (
          <FlatList      horizontal
                         data={userPets}
                         renderItem={renderPet}
                         keyExtractor={(pet) => `${pet.id}`}
                         style={{marginTop:'5%'}}
          />) : <Text style={styles.option}></Text>
        }
      </View>}
      <TouchableOpacity onPress={handleToggle}>
        <Text style={styles.option}>Or manually add a pet</Text>
      </TouchableOpacity>

      {isVisible && <View>
      <StatusBar backgroundColor={appPurpleDark} barStyle="light-content"/>
      {isLoading && <TransparentLoadingIndicator/>}
      <ScrollView showsVerticalScrollIndicator={false}
                  contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={styles.scrollView}>

        <View style={styles.container}>

          <Text style={styles.titles} >Add photo</Text>
          <TouchableHighlight underlayColor="rgba(128, 128, 128, 0.1)">
            <FontAwesome name={'plus-circle'} onPress={handleAddPhoto} style={styles.addPhoto} ></FontAwesome>
          </TouchableHighlight>
          {imageUri && <Image source={{uri:imageUri}} style={styles.image}/>}

          {isPhotoEmpty && <Text style={styles.wrongCredentialsText}>Please add a picture of your pet.</Text>}


          <Text style={styles.titles} >Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={handleNameChange}
          />
          {isNameEmpty && <Text style={styles.wrongCredentialsText}>Please enter your pet's name</Text>}

          <View style={styles.calendarComponent}>
            <Text>Birthdate</Text>
            <Text style={{left: 10}}> {age} </Text>
          </View>

          <TouchableHighlight
            underlayColor="rgba(128, 128, 128, 0.1)">
            <FontAwesome name="calendar" size={23} style={styles.faIcons} icon="fa-solid fa-calendar-lines" onPress={toggleCalendar}/>
          </TouchableHighlight>


          {showCalendar && <Calendar style={styles.calendar}
                                     onDayPress={handleAgeChange}
                                     markedDates={{[age]: {selected: true}}}/>}

          {isAgeEmpty && <Text style={styles.wrongCredentialsText}>Please select your pet's age</Text>}



          <Text style={styles.titles} >Pet Type </Text>
          <RadioButtonComponent
            options={types}
            selectedOption={type}
            onSelect={handleTypeChange}
          />
          {isTypeEmpty && <Text style={styles.wrongCredentialsText}>Please select whether you have a cat or a dog.</Text>}


          <Text style={styles.titles} >Color </Text>
          <DropdownComponent onSelect={handleColorChange} data={catAndDogColors} placeholder={"Color"}/>
          {isColorEmpty && <Text style={styles.wrongCredentialsText}>Please enter your pet's color</Text>}

          <Text style={styles.titles} >Breed</Text>
          <DropdownComponent onSelect={handleBreedChange} data={breedList === 'Cat' ? (egyptianCatBreeds) : (egyptianDogBreeds)} placeholder={"Breed"}/>
          {isBreedEmpty && <Text style={styles.wrongCredentialsText}>Please enter a breed</Text>}


          <Text style={styles.titles} >Pet gender</Text>
          <RadioButtonComponent
            options={genderOptions}
            selectedOption={gender}
            onSelect={handleGenderChange}
          />
          {isGenderEmpty && <Text style={styles.wrongCredentialsText}>Please enter your pet's gender</Text>}


          <Text style={styles.titles} >Is your pet spayed? </Text>
          <RadioButtonComponent
            options={isSpayedOptions}
            selectedOption={isSpayed}
            onSelect={handleIsSpayedChange}
          />
          {isSpayedEmpty && <Text style={styles.wrongCredentialsText}>Please select whether your pet is spayed or not.</Text>}


          <Text style={styles.titles} >Vaccinations</Text>
          <DropdownComponent onSelect={handleVaccinationsChange} data={vaccinationOptions} placeholder={"Vaccinations"}/>

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
          <SuccessPopUp
            visible={showSuccessPopUp}
            confirmationText={`${name} was successfully placed for adoption`}
            onConfirm={onConfirmSuccess}
          />
          <View style={{marginBottom:"25%",flex: 1, width: '100%', alignItems: 'center'}}>
            <TouchableOpacity style={styles.createPetProfileBtnContainer} onPress={handleAddPostManually}>
              <Text style={styles.createPetProfileBtnText}>Add Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </View>}

    </View>
  );
};

const { width, height } = Dimensions.get('window');
const imageSize = Math.min(width, height) * 0.4; // adjust the factor as needed
const borderRadius = imageSize / 2;
const petImageSize = Math.min(width, height) * 0.18; // adjust the factor as needed
const petBorderRadius = imageSize / 2;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    height: '100%'
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
    marginTop: '2%',
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
    height:35,
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
  petIcon:{
    borderRadius: petBorderRadius,
    height: petImageSize,
    width: petImageSize,

  },
  option:{
    fontSize: 18,
    marginTop:'3%',
    fontWeight:"bold"
  }
});

export default AddAdoptionPostScreen;
