import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import React, {Component, useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import PetDetails from '../widgets/PetDetails';

const ViewPetScreen = () => {
    const route = useRoute();
    const {pet} = route.params;
    return (
            <PetDetails pet={pet} />
    );
};
const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationIndicator: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '10%',
    },
    searchBarContainer: {
        marginTop: '1%',
        height: 42,
    },
});


export default ViewPetScreen;
