import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import UserServices from '../services/UserServices';
import {HomeScreenRoute, LoginScreenRoute} from '../utilities/constants';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import {StackActions} from "@react-navigation/native";

export function AuthScreen({navigation}) {

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((authUser) => {
            if (authUser) {
                UserServices.getUser(authUser.uid).then((user) => {
                    navigation.replace(HomeScreenRoute,{user});
                });
            } else {
                navigation.replace(LoginScreenRoute);
            }
        });

        return unsubscribe;
    }, []);

    return <ScreenLoadingIndicator/>
} export default AuthScreen;
