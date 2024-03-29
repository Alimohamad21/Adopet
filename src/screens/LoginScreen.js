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
    SafeAreaView,
} from 'react-native';
import AuthServices from '../services/AuthServices';
import UserServices from '../services/UserServices';
import {
    appPurpleDark,
    appPurpleLight,
    borderGrey,
    HomeScreenRoute,
    MainAppRoute,
    SignupScreenRoute,
} from '../utilities/constants';
import TransparentLoadingIndicator from '../widgets/TransparentLoadingIndicator';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import {removeSpacesFromString, validateEmail, validatePassword} from '../utilities/stringUtilities';
import {StatusBar} from 'native-base';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isWrongCredentials, setIsWrongCredentials] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const handleEmailChange = (text) => {
        setIsWrongCredentials(false);
        setEmail(text);
        setIsEmailValid(false);
    };

    const handlePasswordChange = (text) => {
        setIsWrongCredentials(false);
        setIsPasswordValid(false);
        setPassword(text);
    };

    const validateInputs = () => {
        let isValidInputs = true;
        if (!validateEmail(email)) {
            isValidInputs = false;
            setIsEmailValid(true);
        }
        // else if (!validatePassword(password)) {   //Don't think that it should check length of password in login
        //     setIsPasswordValid(true);
        //     isValidInputs = false;
        // }
        else if (password ===""){
            setIsPasswordValid(true);
            isValidInputs = false;
        }
        return isValidInputs;
    };

    const handleLogin = async () => {
        setEmail(removeSpacesFromString(email));
        const isValidInputs = validateInputs();
        if (isValidInputs) {
            setIsLoading(true);
            const authUser = await AuthServices.signInWithEmailAndPassword(email, password);
            if (!authUser) {
                setIsLoading(false);
                setIsWrongCredentials(true);
            } else {
                navigation.replace("AuthLoading");
            }
        }
    };
    const handlePress = () => {
        navigation.navigate(SignupScreenRoute);
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.screen}>
                <StatusBar backgroundColor={appPurpleDark} barStyle="light-content"/>
                {isLoading && <TransparentLoadingIndicator/>}
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={styles.scrollView}>
                    <View style={styles.header}>
                        <Image
                            style={styles.logo}
                            source={require('../assets/adopet_logo.png')}
                        />

                    </View>

                    <View style={styles.container}>

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={handleEmailChange}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={handlePasswordChange}
                        />
                        {isEmailValid && <Text style={styles.wrongCredentialsText}>Please enter your email</Text>}
                        {isPasswordValid && <Text style={styles.wrongCredentialsText}>Please enter your password</Text>}
                        {isWrongCredentials &&
                        <Text style={styles.wrongCredentialsText}>Wrong username or password</Text>}
                        <View style={{marginTop: 10, flex: 1, width: '100%', alignItems: 'center'}}>
                            <TouchableOpacity style={styles.loginBtnContainer} onPress={handleLogin}>
                                <Text style={styles.loginBtnText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.forgotPassText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.orText}>Or</Text>
                        <View style={{marginTop: 10, flex: 1, width: '100%', alignItems: 'center'}}>
                            <TouchableOpacity style={styles.createAccBtnContainer} onPress={handlePress}>
                                <Text style={styles.createAccBtnText}>Create New Account</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
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
    container: {
        flex: 1,
        marginTop: '80%',
        alignItems: 'center',
    },
    input: {
        borderColor: borderGrey,
        fontFamily: 'sans-serif-medium',
        height: 40,
        width: '85%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    logo: {

        marginTop: 60,
        width: 200,
        height: 110,
        resizeMode: 'contain',
    },

    loginBtnContainer: {
        backgroundColor: appPurpleDark,
        alignItems: 'center',
        width: '85%',
        height: 35,
        borderRadius: 7,

    },
    loginBtnText: {
        fontFamily: 'sans-serif-medium',
        marginTop: 6,
        color: 'white',

    },
    forgotPassText: {
        marginTop: 7,
        fontFamily: 'sans-serif-medium',
        color: appPurpleDark,
    },
    createAccBtnContainer: {
        marginTop: 10,
        backgroundColor: appPurpleLight,
        alignItems: 'center',
        width: '85%',
        height: 35,
        borderRadius: 7,
    },
    createAccBtnText: {
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
});

export default LoginScreen;
