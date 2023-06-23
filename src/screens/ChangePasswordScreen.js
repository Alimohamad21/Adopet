import React, { useContext, useRef, useState } from "react";
import {
  appPurpleDark,
  appPurpleLight,
  borderGrey,
  egyptianCities,
  ProfileScreenRoute, UploadImageScreenRoute,
} from "../utilities/constants";
import UserServices from '../services/UserServices';
import User from '../models/User';
import DropdownComponent from '../widgets/DropdownComponent';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  extractSubstringAfterDelimiter,
  removeSpacesFromString,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "../utilities/stringUtilities";

import PhoneInput from 'react-native-phone-input';
import {StatusBar} from 'native-base';
import { CurrentUserContext } from "../providers/CurrentUserProvider";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AuthServices from "../services/AuthServices";
import TransparentLoadingIndicator from '../widgets/TransparentLoadingIndicator';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const {currentUser, setCurrentUser} = useContext(CurrentUserContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const passwordError = 'Password must not be less than 6 digits';
  const [passwordChangeError, setPasswordChangeError] = useState(false);
  const [passwordChangeErrorText, setPasswordChangeErrorText] = useState('');
  const [oldPasswordNotValid, setOldPasswordNotValid] = useState(false);
  const [isOldPasswordFound, setIsOldPasswordFound] = useState(true);
  const [newPasswordNotValid, setNewPasswordNotValid] = useState(false);
  const [isPasswordNotConfirmed, setIsPasswordNotConfirmed] = useState(false);
  const animatedValue = useRef(new Animated.Value(1)).current;

  const handleOldPasswordChange = (text) => {
    setOldPassword(text);
    //setPasswordNotValid(false);
    //setIsPasswordNotConfirmed(false);
    if (!validatePassword(text)) {
      //isValidInputs = false;
      setOldPasswordNotValid(true);
    }
    else {
      setOldPasswordNotValid(false);
    }
  };
  const handleOldPasswordConfirm = async () => {
    setIsOldPasswordFound(true);
    const passwordAuth = await AuthServices.signInWithEmailAndPassword(currentUser.email, oldPassword);
    if(!passwordAuth){
      setIsOldPasswordFound(false);
    }
  }

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    //setPasswordNotValid(false);
    //setIsPasswordNotConfirmed(false);
    if (!validatePassword(text)) {
      //isValidInputs = false;
      setNewPasswordNotValid(true);
    }
    else {
      setNewPasswordNotValid(false);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    //setIsPasswordNotConfirmed(false);
    if (!validateConfirmPassword(newPassword, text)) {
      //isValidInputs = false;
      setIsPasswordNotConfirmed(true);
    }
    else {
      setIsPasswordNotConfirmed(false);
    }
  };

  const handleChangePassword = async () => {
    const isValidInputs = isOldPasswordFound && !isPasswordNotConfirmed && !oldPasswordNotValid && !newPasswordNotValid;
    if (isValidInputs) {
      // const passwordAuth = await AuthServices.signInWithEmailAndPassword(currentUser.email, oldPassword);
      // if(!passwordAuth){
      //   setIsOldPasswordFound(false);
      // }
      // else {
        const response = await AuthServices.updatePassword(oldPassword, newPassword);
        if (typeof response === 'string') {
          setPasswordChangeError(true);
          setPasswordChangeErrorText(extractSubstringAfterDelimiter(response, ']'));
          setIsLoading(false);
        } else {
          //const user = new User(response.uid, fullName, city, phoneNumber, email, '', '',[]);
          //await UserServices.addUser(user, response.uid);
          navigation.replace(ProfileScreenRoute, {"userParam": null})
          //navigation.navigate(ProfileScreenRoute);
        }
      //}
      //then(()=>{navigation.navigate(ProfileScreenRoute)});
    }
  }

  return (
    <View style={styles.screen}>

      <StatusBar backgroundColor={appPurpleDark} barStyle="light-content"/>
      {isLoading && <TransparentLoadingIndicator/>}
      <ScrollView showsVerticalScrollIndicator={false}
                  contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={styles.scrollView}>
        <Animated.View style={{ opacity: animatedValue }}>

          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              secureTextEntry={true}
              value={oldPassword}
              onChangeText={handleOldPasswordChange}
              onEndEditing={handleOldPasswordConfirm}
            />
            {oldPasswordNotValid && <Text style={styles.wrongCredentialsText}>{passwordError}</Text>}
            {!isOldPasswordFound &&
              <Text style={styles.wrongCredentialsText}>Can't find a user with
                the corresponding old password</Text>}
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={handleNewPasswordChange}
              //onEndEditing={handleNewPasswordChange}
            />
            {newPasswordNotValid && <Text style={styles.wrongCredentialsText}>{passwordError}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              //onEndEditing={handleConfirmPasswordChange}
            />
            {isPasswordNotConfirmed &&
              <Text style={styles.wrongCredentialsText}>Passwords not matching</Text>}

            {passwordChangeError &&
              <Text style={styles.wrongCredentialsText}>{passwordChangeErrorText}</Text>}

          </View>

          <View style={{alignItems: 'center'}}>

            <View style={{marginTop: 10, flex: 1, width: '100%', alignItems: 'center'}}>
              <TouchableOpacity style={styles.signupBtnContainer} onPress={handleChangePassword}>
                <Text style={styles.signupBtnText}>Update Password</Text>
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
  editPicture:{
    marginLeft:"2%",
    fontSize:15,
    fontWeight:"500"
  },
});

export default ChangePasswordScreen;
