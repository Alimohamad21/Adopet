import React, {useContext, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import UserServices from '../services/UserServices';
import {HomeScreenRoute, LoginScreenRoute, MainAppRoute} from '../utilities/constants';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import {CurrentUserProvider, CurrentUserContext} from '../providers/CurrentUserProvider';

export function AuthScreen({navigation}) {
    console.log("abl context")
    const { currentUser,setCurrentUser } = useContext(CurrentUserContext);
    console.log("ba3d context")
    useEffect(() => {
        console.log("Awel use effect")
        const unsubscribe = auth().onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log("authenticated")
                UserServices.getUser(authUser.uid).then((user) => {
                    console.log("setting current user with",user.fullName)
                    setCurrentUser(user);
                    navigation.replace(MainAppRoute);
                });
            } else {
                console.log("not authenticated")

                navigation.replace("Auth");
            }
        });
        return unsubscribe;
    }, []);

    return <ScreenLoadingIndicator/>
} export default AuthScreen;
