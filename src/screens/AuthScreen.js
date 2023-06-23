import React, {useContext, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import UserServices from '../services/UserServices';
import {HomeScreenRoute, LoginScreenRoute, MainAppRoute} from '../utilities/constants';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import {CurrentUserProvider, CurrentUserContext} from '../providers/CurrentUserProvider';
import NotificationServices from "../services/NotificationServices";
import user from "../models/User";
import AuthServices from '../services/AuthServices';
import {generateRSAKeyPair, getPrivateKey, storeKeyPair} from '../utilities/securityUtilities';

export function AuthScreen({navigation}) {

    const { currentUser,setCurrentUser } = useContext(CurrentUserContext);
    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (authUser) => {
            if (authUser) {
                const fcmToken = await NotificationServices.getToken();
                await UserServices.addFcmToken(authUser.uid,fcmToken);
                UserServices.getUser(authUser.uid).then(async (user) => {
                    if (user.publicKey === '' || user.publicKey==null) {
                        let pair = await generateRSAKeyPair()
                        storeKeyPair(user.uid,pair.privateKey,pair.publicKey)
                        user.publicKey=pair.publicKey;
                    }
                    setCurrentUser(user);
                    navigation.replace(MainAppRoute);
                });
            } else {
                navigation.replace("Auth");
            }
        });
        return unsubscribe;
    }, []);

    return <ScreenLoadingIndicator/>
} export default AuthScreen;
