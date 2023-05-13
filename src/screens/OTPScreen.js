import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import AuthServices from '../services/AuthServices';
import PostServices from '../services/PostServices';
import UserServices from '../services/UserServices';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';

const OTPScreen = () => {
    const [otp, setOtp] = useState('');
    const route = useRoute();
    const {user} = route.params;
    const navigation=useNavigation();
    const [confirmation, setConfirmation]=useState(null);

    const handleVerifyOTP = async () => {
        console.log('OTP CONFIRMATION');
        const success = await AuthServices.confirmValidOTP(confirmation, otp);
        console.log('OTP CONFIRM RETURNED:', success);
    };

    useEffect(() => {
        AuthServices.sendPhoneVerificationSMS(user.phoneNumber).then((res) => {
            if(res)
            setConfirmation(res);
            else
            navigation.goBack();
        });
    }, []);
    if (confirmation==null) {
        return <ScreenLoadingIndicator/>;
    }
    else {
        return (
            <View>
                <Text>OTP:</Text>
                <TextInput
                    placeholder="Enter OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                />
                <View>
                <TouchableOpacity onPress={handleVerifyOTP}>
                    <Text>Create Account</Text>
                </TouchableOpacity>
                </View>
            </View>
        );
    }
};

export default OTPScreen;
