import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import {appPurpleDark} from '../utilities/constants';

const TransparentLoadingIndicator = () => {
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
    },
});
export default TransparentLoadingIndicator;
