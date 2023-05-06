import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import PropTypes from 'prop-types';

import {appPurpleLight, HomeScreenRoute, LoginScreenRoute, ProfileScreenRoute} from '../utilities/constants';
import auth from '@react-native-firebase/auth';
import UserServices from '../services/UserServices';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AuthServices from '../services/AuthServices';
import {CurrentUserContext} from '../providers/CurrentUserProvider';
import ScreenLoadingIndicator from './ScreenLoadingIndicator';
import NotificationServices from '../services/NotificationServices';
import TransparentLoadingIndicator from './TransparentLoadingIndicator';


export default function DrawerContainer(props) {
    const {navigation} = props;
    const {currentUser, setCurrentUser} = useContext(CurrentUserContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleProfileNavigation = () =>{
        navigation.navigate(ProfileScreenRoute);
    }
    const handleHomeNavigation = () =>{
        navigation.navigate(HomeScreenRoute);
    }
    const handleLogOut = async () => {
        setIsLoading(true);
        const token=await NotificationServices.getToken();
        await UserServices.removeFcmToken(currentUser.uid, token);
        await AuthServices.signOut();
        setIsLoading(false);

        navigation.closeDrawer();
        navigation.reset({
            index: 0,
            routes: [{name: 'AuthLoading'}],
        });
        setCurrentUser(null);
    };
    if(!currentUser)
        return <ScreenLoadingIndicator/>
    else
    return (
        <View style={styles.content}>
            {isLoading && <TransparentLoadingIndicator/>}
            <View style={styles.profileContainer}>
                <TouchableHighlight style={styles.profileBtnClickContain} onPress={handleProfileNavigation} underlayColor="transparent">
                    <View style={styles.profileBtnContainer}>
                        <View style={styles.imageContainer}>
                            {
                                currentUser.profilePicture !== '' ?
                                    <Image source={{uri: currentUser.profilePicture}} style={styles.profileBtnIcon}/> :
                                    <Image source={require('../assets/default_user.png')}
                                           style={styles.profileBtnIcon}/>}
                        </View>
                        <View>
                            <Text style={styles.btnTextName}>{currentUser.fullName}</Text>
                            <Text style={styles.profileBtnText}>View Profile</Text>
                        </View>

                    </View>

                </TouchableHighlight>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableHighlight onPress={handleHomeNavigation} style={styles.btnClickContain} underlayColor="rgba(128, 128, 128, 0.1)">
                    <View style={styles.btnContainer}>
                        {/*<Image source={source} style={styles.btnIcon} />*/}
                        <FontAwesome name="home" style={styles.btnIcon}/>
                        <Text style={styles.btnText}>Home</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={styles.btnClickContain} underlayColor="rgba(128, 128, 128, 0.1)">
                    <View style={styles.btnContainer}>
                        {/*<Image source={source} style={styles.btnIcon} />*/}
                        <FontAwesome name="commenting" style={styles.btnIcon}/>
                        <Text style={styles.btnText}>Messages</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.btnClickContain} underlayColor="rgba(128, 128, 128, 0.1)">
                    <View style={styles.btnContainer}>
                        {/*<Image source={source} style={styles.btnIcon} />*/}
                        <FontAwesome name="bookmark" style={styles.btnIcon}/>
                        <Text style={styles.btnText}>Saved</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight onPress={handleLogOut} style={styles.signOutBtnClickContain}
                                    underlayColor="rgba(128, 128, 128, 0.1)">
                    <View style={styles.signOutBtnContainer}>
                        {/*<Image source={source} style={styles.btnIcon} />*/}
                        <FontAwesome name="sign-out" style={styles.signOutBtnIcon}/>
                        <Text style={styles.signOutBtnText}>Log out</Text>
                    </View>
                </TouchableHighlight>


            </View>

        </View>
    );
}
const styles = StyleSheet.create({
    content: {

        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonsContainer: {

        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: '10%',

    },
    profileContainer: {


        alignItems: 'flex-start',
        marginBottom: '70%',
        marginTop: '10%',
        paddingHorizontal: '10%',

    },
    profileBtnClickContain: {
        flexDirection: 'row',

    },
    profileBtnContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    profileBtnIcon: {
        borderRadius: 50,
        height: 50,
        width: 50,
        marginLeft: '3%',
    },
    profileBtnText: {
        fontFamily: 'sans-serif-medium',
        fontSize: 16,
        marginLeft: '5%',
        marginTop: 2,
        color: 'white',
    },
    btnTextName: {
        fontFamily: 'sans-serif-medium',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: '5%',
        marginTop: 2,
        color: 'white',
    },
    imageContainer: {},

    btnClickContain: {
        flexDirection: 'row',
        padding: '5%',
        marginTop: 0,
        marginBottom: 0,
    },
    btnContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: '10%',
    },
    btnIcon: {
        fontSize: 28,
        height: 25,
        width: 30,
        color: 'white',
    },
    btnText: {
        fontFamily: 'sans-serif-medium',
        fontSize: 20,
        marginLeft: '5%',
        marginTop: 2,
        color: 'white',
    },
    signOutBtnClickContain: {
        flexDirection: 'row',
        padding: '5%',
        marginLeft: '20%',
        marginBottom: '20%',
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
    },
    signOutBtnContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: '10%',
    },
    signOutBtnIcon: {
        fontSize: 23,
        height: 20,
        width: 20,
        color: 'white',
    },
    signOutBtnText: {
        fontFamily: 'sans-serif-medium',
        fontSize: 16,
        marginLeft: '5%',
        marginTop: 2,
        color: 'white',
    },
});
DrawerContainer.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }),
};
