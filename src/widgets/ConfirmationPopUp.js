import React, {useState} from 'react';
import {View, Text, Button, TextInput, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {Rating,AirbnbRating} from 'react-native-ratings';
import {CheckBox} from 'react-native-elements';
import TransparentLoadingIndicator from './TransparentLoadingIndicator';
import Dialog from "react-native-dialog";


const ConfirmationPopUp = ({visible,confirmationText, onConfirm,onCancel}) => {
    const handleConfirm = () => {
        onConfirm();
    };
    const handleCancel =()=>{
        onCancel();
    }

    return (
        <View>
            <Dialog.Container visible={visible}>
                <Dialog.Description>{confirmationText}</Dialog.Description>
                <Dialog.Button onPress={handleCancel} label="Cancel" />
                <Dialog.Button onPress={handleConfirm} label="Confirm" />
            </Dialog.Container>
        </View>
    );
};
const styles = StyleSheet.create({});

export default ConfirmationPopUp;
