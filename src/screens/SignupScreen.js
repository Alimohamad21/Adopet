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
import SelectDropdown from 'react-native-select-dropdown';
import {SelectList} from "react-native-dropdown-select-list/index";
import AuthServices from "../services/AuthServices";
import UserServices from "../services/UserServices";
import User from "../models/User";


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

   // const [selected, setSelected] = useState("");

    //const data= [["loc1", "loc2", "loc3"]]
    const handleFullNameChange = (text) => {

        setFullName(text);
        setIsEmailEmpty(false)
    };
    const handleEmailChange = (text) => {

        setEmail(text);
        setIsEmailEmpty(false)
    };
    const handlePhoneNumberChange = (text) => {

        setPhoneNumber(text);
        setIsEmailEmpty(false)
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        setIsPasswordEmpty(false)

    };

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        setIsPasswordEmpty(false)

    };

    const handleSignup = () => {
        if (email=="")
            setIsEmailEmpty(true)
        else if (password.length>5)
            setIsPasswordEmpty(true)
        else {
            setIsLoading(true);
            AuthServices.registerWithEmailAndPassword(email, password).then(authUser => {
                if (!authUser) {
                   console.log("7asal error fel signup")
                } else {
                    const user = new User(fullName,location,phoneNumber,email,"","")
                    UserServices.addUser(user,authUser.uid).then(() => {

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

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={handleEmailChange}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={handlePhoneNumberChange}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={handlePasswordChange}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                />
                <View style={{alignItems:"center"}}>
                <SelectList
                    fontFamily={'sans-serif-medium'}
                    boxStyles={styles.dropdownList}
                    inputStyles={styles.dropdownInput}
                    dropdownStyles={styles.dropdownView}
                    search={false}
                    setSelected={(val) => setLocation(val)}
                    data={egyptianCities}
                    save="value"

                />
                </View>


            </View>
             <View style={{alignItems:'center'}}>
            {isEmailEmpty && <Text style={styles.wrongCredentialsText}>Please enter your email</Text>}
            {isPasswordEmpty && <Text style={styles.wrongCredentialsText}>Please enter your password</Text>}

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
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderColor: borderGrey,
        fontFamily: 'sans-serif-medium',
        height: 40,
        width: "85%",
        margin: 12,
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

        alignItems: 'center',
        width: "100%",
        height: 180,
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
    }
});

export default SignupScreen;
