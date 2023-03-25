import React, {useContext, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import UserServices from '../services/UserServices';
import {HomeScreenRoute, LoginScreenRoute, MainAppRoute} from '../utilities/constants';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import {CurrentUserProvider, CurrentUserContext} from '../providers/CurrentUserProvider';

export function AuthScreen({navigation}) {

    const { currentUser,setCurrentUser } = useContext(CurrentUserContext);

    useEffect(() => {

        const unsubscribe = auth().onAuthStateChanged((authUser) => {
            if (authUser) {

                UserServices.getUser(authUser.uid).then((user) => {
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
