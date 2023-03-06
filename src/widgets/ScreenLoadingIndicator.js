import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import {appPurpleDark} from '../utilities/constants';

const ScreenLoadingIndicator = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={appPurpleDark} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff',
    },
});

export default ScreenLoadingIndicator;
