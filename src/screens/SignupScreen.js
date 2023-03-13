import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Image, TouchableOpacity, Text, ScrollView} from 'react-native';
import {
    appPurpleDark,
    appPurpleLight,
    borderGrey,
    egyptianCities,
    HomeScreenRoute,
    LoginScreenRoute
} from '../utilities/constants';
import TransparentLoadingIndicator from '../widgets/TransparentLoadingIndicator';
import AuthServices from "../services/AuthServices";
import UserServices from "../services/UserServices";
import User from "../models/User";
import DropdownComponent from "../widgets/DropdownComponent";
import {
    validateConfirmPassword,
    validateEmail,
    validatePassword,
    validatePhoneNumber
} from "../utilities/stringUtilities";

import PhoneInput from 'react-native-phone-input';

const SignupScreen = ({navigation}) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [location,setLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFullNameEmpty,setIsFullNameEmpty] = useState(false);
    const [isEmailEmpty,setIsEmailEmpty] = useState(false);
    const [isPasswordEmpty,setIsPasswordEmpty] = useState(false);
    const emailError = "Please enter a valid email address";
    const phoneNumberError = "Please enter a valid phone number";
    const passwordError = "Password must not be less than 6 digits "
    const [isEmailNotValid,setIsEmailNotValid] = useState(false);
    const [isPhoneNumberNotValid, setIsPhoneNumberNotValid] = useState(false);
    const [passwordNotValid,setPasswordNotValid] = useState(false);
    const [isCityEmpty,setIsCityEmpty] = useState(false);
    const [isPasswordNotConfirmed,setIsPasswordNotConfirmed] = useState(false);
    const handleFullNameChange = (text) => {

        setFullName(text);
        setIsFullNameEmpty(false)
    };
    const handleEmailChange = (text) => {
            setEmail(text);
            setIsEmailEmpty(false)
        setIsEmailNotValid(false)
    };
    const handlePhoneNumberChange = (text) => {

        setPhoneNumber(text);
        setIsPhoneNumberNotValid(false)
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        setIsPasswordEmpty(false)
        setIsPasswordNotConfirmed(false)

    };

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        setIsPasswordEmpty(false)
        setIsPasswordNotConfirmed(false)
    };
    const handleLocation = (value) => {
       setLocation(value.value)
        setIsCityEmpty(false);
    };
    const handleSignup = () => {


         if (fullName ==="")
            setIsFullNameEmpty(true)
         else if (email === "")
              setIsEmailEmpty(true)

          else if (password === "")
              setIsPasswordEmpty(true)
          else if (location === "")
              setIsCityEmpty(true)
          else if (!validateConfirmPassword(password,confirmPassword))
              setIsPasswordNotConfirmed(true)
          else if (!validateEmail(email))
              setIsEmailNotValid(true)
          else if (!validatePhoneNumber(phoneNumber))
                setIsPhoneNumberNotValid(true)
          else if (!validatePassword(password))
              setPasswordNotValid(true)

          else {
              setIsLoading(true);
              AuthServices.registerWithEmailAndPassword(email, password).then(authUser => {
                  if (!authUser) {
                      console.log("7asal error fel signup")
                  } else {
                      const user = new User(fullName, location, phoneNumber, email, "", "")
                      UserServices.addUser(user, authUser.uid).then(() => {

                          UserServices.getUser(authUser.uid).then((user) => {

                              setIsLoading(false);
                              navigation.replace(HomeScreenRoute, {user});

                          });
                      });
                  }
              });
          }


    };



    return (
        <View style={styles.screen}>
            {isLoading && <TransparentLoadingIndicator/>}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}} style={styles.scrollView}>
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={require('../assets/adopet_logo.png')}
                />

            </View>
            <View style={styles.container}>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={handleFullNameChange}
                />
                {isFullNameEmpty && <Text style={styles.wrongCredentialsText}>Please Enter your name</Text>}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={handleEmailChange}
                />
                {isEmailNotValid && <Text style={styles.wrongCredentialsText}>{emailError}</Text>}
                {isEmailEmpty && <Text style={styles.wrongCredentialsText}>Please enter your email</Text>}



                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={handlePasswordChange}
                />
                {isPasswordEmpty && <Text style={styles.wrongCredentialsText}>Please enter your password</Text>}
                {passwordNotValid && <Text style={styles.wrongCredentialsText}>{passwordError}</Text>}
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                />
                {isPasswordNotConfirmed && <Text style={styles.wrongCredentialsText}>Passwords not matching</Text>}

                <DropdownComponent onSelect={handleLocation} data={egyptianCities}  />
                {isCityEmpty && <Text style={styles.wrongCredentialsText}>Please select a city</Text>}
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

                    />
                </View>
                {isPhoneNumberNotValid&& <Text style={styles.wrongCredentialsText}>{phoneNumberError}</Text>}
            </View>

             <View style={{alignItems:'center'}}>



            <View style={{marginTop:10, flex:1,width:"100%",alignItems:"center"}}>
                <TouchableOpacity style={styles.signupBtnContainer} onPress={handleSignup}>
                    <Text style={styles.signupBtnText}>Create Account</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.orText}>Or</Text>
            <View style={{marginBottom:40,flex:1,width:"100%",alignItems:"center"}}>
                <TouchableOpacity style={styles.loginBtnContainer} onPress={()=>navigation.replace(LoginScreenRoute)}>
                    <Text style={styles.loginBtnText}>Login with an existing account</Text>
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
    scrollView:{
       flex:1,
        width:"100%",


    },
    container: {
        flex:1,
        marginTop: "60%",
        alignItems: "center"

    },
    input: {
        borderColor: borderGrey,
        fontFamily: 'sans-serif-medium',
        height: 40,
        width: "85%",
        margin: "3%",
        borderWidth: 1,
        padding: 10,
    },
    dropdownList:{
        borderColor: borderGrey,
        fontFamily: 'sans-serif-medium',
        height: 45,
        maxWidth: "100%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius:0,

    },
    dropdownInput:{
        fontFamily: 'sans-serif-medium',
        color:"grey",
        paddingRight:0,
        marginRight:0,
        marginLeft:0,
        paddingLeft:0,
    },
    dropdownView:{
        borderColor: borderGrey,
        fontFamily: 'sans-serif-medium',
        maxWidth:"85%"
    },
    logo: {

        marginTop: 60,
        width: 200,
        height: 110,
        resizeMode: 'contain',
    },
    header: {
        flex:1,
        position: 'absolute',
        left:     0,
        top:      0,
        alignItems: 'center',
        width: "100%",
        height: 190,
        backgroundColor: appPurpleDark,

    },
    signupBtnContainer: {
        backgroundColor: appPurpleDark,
        alignItems: 'center',
        width: "85%",
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
        width: "85%",
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
    wrongCredentialsText:{
        color:"red",
        marginBottom:10
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
        margin: "3%",
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

export default SignupScreen;