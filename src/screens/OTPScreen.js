import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Button,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AuthServices from '../services/AuthServices';
import OTPTextInput from 'react-native-otp-textinput';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {appPurpleDark, OTPScreenRoute, ProfileScreenRoute} from '../utilities/constants';
import User from '../models/User';
import TransparentLoadingIndicator from '../widgets/TransparentLoadingIndicator';
import UserServices from '../services/UserServices';

const OTPScreen = () => {
    const [otp, setOtp] = useState('');
    const route = useRoute();
    const {user, verificationId, password} = route.params;
    const navigation = useNavigation();
    const [otpError, setOtpError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTintColor: 'white'
            , headerStyle: {
                backgroundColor: appPurpleDark,
            },
        });
    }, []);


    const handleOTPChange = async (text) => {
        setOtp(text);
        if (otpError !== '') {
            setOtpError('');
        }
        if (text.length === 6) {
            await handleOTPSubmit(text);
        }
    };
    const handleOTPSubmit = async (otp) => {
        setIsLoading(true);
        const success = await AuthServices.confirmValidOTP(verificationId, otp);
        if (!success) {
            setOtpError('Invalid Code. Please enter the correct code');
            setIsLoading(false);
        } else {
            const {authUser, error} = await AuthServices.registerWithEmailAndPassword(user.email, password);
            if (error) {
                setOtpError(error);
                setIsLoading(false);
            } else {
                await UserServices.addUser(user, authUser.uid);
                setIsLoading(false);
                navigation.replace("AuthLoading");
            }
        }
    };

    return (
        <View style={styles.screen}>

            {isLoading && <TransparentLoadingIndicator/>}
            <View style={styles.container}>
                <Text style={styles.title}>
                    Please enter the verification code sent to you at{' '}
                    <Text style={styles.phoneNumber}>{user.phoneNumber}</Text>
                </Text>
                <OTPTextInput containerStyle={styles.otpContainer} inputCount={6} autoFocus={false}
                              handleTextChange={handleOTPChange}/>
            </View>
            {otpError !== '' && <Text style={styles.wrongCredentialsText}>Invalid code. Please enter a valid OTP</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        marginTop:"25%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpContainer:
        {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '2%',
            marginLeft: '2%',
            marginBottom: '40%',
    }
    ,
    title: {
        flex: 1,
        fontSize: 20,
        textAlign: 'center',
        color: '#000',
        marginBottom:"25%"
    },
    phoneNumber: {
        flex: 1,
        fontWeight: 'bold',
        color: '#000',
    },
    wrongCredentialsText: {
        color: 'red',
        marginBottom: '10%',
    },
    backButton: {
        fontSize: 20,
        color: '#fff',
        marginRight: '15%',
    },
});


export default OTPScreen;
