import React, {useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import UserServices from '../services/UserServices';
import {HomeScreenRoute, LoginScreenRoute} from '../utilities/constants';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';

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
