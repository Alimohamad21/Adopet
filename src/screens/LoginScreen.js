import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import AuthServices from '../services/AuthServices';
import UserServices from '../services/UserServices';
import {appPurpleDark, appPurpleLight, borderGrey, HomeScreenRoute} from '../utilities/constants';
import TransparentLoadingIndicator from '../widgets/TransparentLoadingIndicator';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (text) => {
        setEmail(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const handleLogin = () => {
        setIsLoading(true);
        AuthServices.signInWithEmailAndPassword(email, password).then(authUser => {
            UserServices.getUser(authUser.uid).then((user) => {
                navigation.navigate(HomeScreenRoute, {user});
                setIsLoading(false);
            });
        });

    };

    return (
        <View style={styles.screen}>
            {isLoading && <TransparentLoadingIndicator/>}
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


            </View>
            <View>
                <TouchableOpacity style={styles.loginBtnContainer} onPress={handleLogin}>
                    <Text style={styles.loginBtnText}>Login</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity>
                <Text style={styles.forgotPassText}>Forgot Password?</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>Or</Text>
            <View>
                <TouchableOpacity style={styles.createAccBtnContainer}>
                    <Text style={styles.createAccBtnText}>Create New Account</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
    },
    container: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderColor: borderGrey,
        fontFamily: 'sans-serif-medium',
        height: 40,
        width: 350,
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
    header: {
        alignItems: 'center',
        width: 400,
        height: 180,
        backgroundColor: appPurpleDark,
    },
    loginBtnContainer: {
        backgroundColor: appPurpleDark,
        alignItems: 'center',
        width: 350,
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
        width: 350,
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
});

export default LoginScreen;
