import React, { useContext, useRef, useState } from "react";
import {
  appPurpleDark,
  appPurpleLight,
  borderGrey,
  egyptianCities,
  HomeScreenRoute,
  LoginScreenRoute, MainAppRoute, ProfileScreenRoute,
} from "../utilities/constants";
import TransparentLoadingIndicator from '../widgets/TransparentLoadingIndicator';
import AuthServices from '../services/AuthServices';
import UserServices from '../services/UserServices';
import User from '../models/User';
import DropdownComponent from '../widgets/DropdownComponent';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableHighlight, Animated, Button,
} from "react-native";
import {
  extractSubstringAfterDelimiter, removeSpacesFromString,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from '../utilities/stringUtilities';

import PhoneInput from 'react-native-phone-input';

import {StatusBar} from 'native-base';
import { CurrentUserContext } from "../providers/CurrentUserProvider";
import { useNavigation } from "@react-navigation/native";


const EditUserDetailsScreen = () => {
  const navigation = useNavigation();
  const {currentUser, setCurrentUser} = useContext(CurrentUserContext);
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState(currentUser.city);
  const [isLoading, setIsLoading] = useState(false);
  //const [isFullNameEmpty, setIsFullNameEmpty] = useState(false);
  const [emailError, setEmailError] = useState('');
  const phoneNumberError = 'Please enter a valid phone number';
  const passwordError = 'Password must not be less than 6 digits';
  const [isEmailNotValid, setIsEmailNotValid] = useState(false);
  const [isPhoneNumberNotValid, setIsPhoneNumberNotValid] = useState(false);
  const [passwordNotValid, setPasswordNotValid] = useState(false);
  //const [isCityEmpty, setIsCityEmpty] = useState(false);
  const [isPasswordNotConfirmed, setIsPasswordNotConfirmed] = useState(false);
  const animatedValue = useRef(new Animated.Value(1)).current;
  const phoneRef = useRef("phone");

  const handleFullNameChange = (text) => {
    setFullName(text);
    //setIsFullNameEmpty(false);
  };
  const handleEmailChange = (text) => {
    setEmail(text);

    if (!validateEmail(text)) {
      //isValidInputs = false;
      setIsEmailNotValid(true);
      setEmailError('Please enter a valid email address');
    }
    else {
      setIsEmailNotValid(false);
      setEmail(text);
    }
  };
  // const handlePhoneNumberChange = (text) => {
  //   //setPhoneNumber(text);
  //   //setIsPhoneNumberNotValid(false);
  //   if (!validatePhoneNumber(text)) {
  //     console.log('Invalid phone number');
  //     setIsPhoneNumberNotValid(true);
  //   }
  //   else {
  //     setPhoneNumber(text);
  //     setIsPhoneNumberNotValid(false);
  //   }
  // };
  const handlePhoneNumberChange = (number, countryCode) => {
    setPhoneNumber(number);
    // const isValidNumberBool = isValidNumber(number)
    // console.log(isValidNumberBool)
    // setIsPhoneNumberNotValid(isValidNumberBool)
  };


  const handlePasswordChange = (text) => {
    //setPassword(text);
    //setPasswordNotValid(false);
    //setIsPasswordNotConfirmed(false);


    if (!validatePassword(password)) {
      //isValidInputs = false;
      setPasswordNotValid(true);
    }
    else {
      setPasswordNotValid(false);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    //setConfirmPassword(text);
    //setIsPasswordNotConfirmed(false);
    if (!validateConfirmPassword(password, confirmPassword)) {
      //isValidInputs = false;
      setIsPasswordNotConfirmed(true);
    }
    else {
      setIsPasswordNotConfirmed(false);
    }
  };
  const handleCityChange = (value) => {
    setCity(value.value);
    //setIsCityEmpty(false);
  };
 // const validateInputs = () => {
    //let isValidInputs = true;

    // if (!validateConfirmPassword(password, confirmPassword)) {
    //   isValidInputs = false;
    //   setIsPasswordNotConfirmed(true);
    // }
    // if (!validateEmail(email)) {
    //   isValidInputs = false;
    //   setIsEmailNotValid(true);
    //   setEmailError('Please enter a valid email address');
    // }
    // if (!validatePhoneNumber(phoneNumber)) {
    //   isValidInputs = false;
    //   setIsPhoneNumberNotValid(true);
    // }
    // if (!validatePassword(password)) {
    //   isValidInputs = false;
    //   setPasswordNotValid(true);
    // }
  //   return isValidInputs;
  // };

  const handleUpdate = async () => {
    setEmail(removeSpacesFromString(email));
    setFullName(fullName.trim());
    const isValidInputs = !isEmailNotValid && !isPhoneNumberNotValid && !isPasswordNotConfirmed && !passwordNotValid;
    if (isValidInputs) {
      const user = new User(currentUser.uid, fullName, city, phoneNumber, email, currentUser.profilePicture, currentUser.ownedPets, currentUser.fcmTokens);
      await UserServices.updateUser(user, currentUser.uid).
      then(()=>{setCurrentUser(user)}).
      then(()=>{navigation.navigate(ProfileScreenRoute)});
    }
  }


  return (
    <View style={styles.screen}>

      <StatusBar backgroundColor={appPurpleDark} barStyle="light-content"/>
      {/*{isLoading && <TransparentLoadingIndicator/>}*/}
      <ScrollView showsVerticalScrollIndicator={false}
                  contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={styles.scrollView}>
        <Animated.View style={{ opacity: animatedValue }}>
        <View style={styles.profileIconContainer}>

            {
              currentUser.profilePicture !== '' ?
                <Image source={{uri: currentUser.profilePicture}} style={styles.profileIcon}/> :
                <Image source={require('../assets/default_user.png') }
                       style={styles.profileIcon}/>}
          </View>

        <View style={styles.container}>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={handleFullNameChange}
          />
          {/*{isFullNameEmpty && <Text style={styles.wrongCredentialsText}>Please Enter your name</Text>}*/}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
          />
          {isEmailNotValid && <Text style={styles.wrongCredentialsText}>{emailError}</Text>}


          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            onEndEditing={handlePasswordChange}
          />
          {passwordNotValid && <Text style={styles.wrongCredentialsText}>{passwordError}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onEndEditing={handleConfirmPasswordChange}
          />
          {isPasswordNotConfirmed &&
            <Text style={styles.wrongCredentialsText}>Passwords not matching</Text>}

          <DropdownComponent placeholder={city} onSelect={handleCityChange} data={egyptianCities}/>
          {/*{isCityEmpty && <Text style={styles.wrongCredentialsText}>Please select a city</Text>}*/}
          <View style={styles.phoneNoContainer}>
            <PhoneInput
              style={styles.phoneInput}
              textStyle={styles.phoneInputText}
              flagStyle={styles.flag}
              offset={10}
              initialCountry="eg"
              allowZeroAfterCountryCode={false}
              editable={false}
              onChangePhoneNumber={handlePhoneNumberChange}
              autoFormat = {true}
              textProps={{ placeholder: phoneNumber }}
              ref={phoneRef}
            />
          </View>
          {isPhoneNumberNotValid && <Text style={styles.wrongCredentialsText}>{phoneNumberError}</Text>}
        </View>

        <View style={{alignItems: 'center'}}>


          <View style={{marginTop: 10, flex: 1, width: '100%', alignItems: 'center'}}>
            <TouchableOpacity style={styles.signupBtnContainer} onPress={handleUpdate}>
              <Text style={styles.signupBtnText}>Update Account</Text>
            </TouchableOpacity>
          </View>

        </View>
        </Animated.View>
      </ScrollView>

    </View>
  );
};

const { width, height } = Dimensions.get('window');
const imageSize = Math.min(width, height) * 0.4; // adjust the factor as needed
const borderRadius = imageSize / 2;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',


  },
  container: {
    //flex: 0.2,
    marginTop: '30%',
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
  profileIconContainer: {
    width:"100%",
    // height:height/6,
    flexDirection:"row",
    justifyContent:"center"
  },

  profileIcon: {

    position:"absolute",
    borderRadius: borderRadius,
    width:imageSize,
    height:imageSize,
    alignSelf: 'center',
  },
});

export default EditUserDetailsScreen;
