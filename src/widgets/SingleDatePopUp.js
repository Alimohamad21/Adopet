import React, {useState} from 'react';
import { View, Text, Button, TextInput, Modal, TouchableOpacity, StyleSheet, TouchableHighlight } from "react-native";
import {Rating,AirbnbRating} from 'react-native-ratings';
import {CheckBox} from 'react-native-elements';
import TransparentLoadingIndicator from './TransparentLoadingIndicator';
import Dialog from "react-native-dialog";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Calendar } from "react-native-calendars";
import { appPurpleDark, borderGrey } from "../utilities/constants";
import { ScrollView } from "native-base";



const SingleDatePopUp = ({pet, visible,confirmationText, onConfirm,onCancel}) => {

    const today = new Date(Date.now());
    const [isDateEmpty, setIsDateEmpty] = useState(false);
    const [chosenDate, setChosenDate] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [lostLocation, setLostLocation] = useState('');
    const [isLostLocationEmpty,setIsLostLocationEmpty] = useState(false);
    const handleLocationChange = (text) => {
        setLostLocation(text);
        setIsLostLocationEmpty(false);
    };
    const handleConfirm = async () => {
        if (isValidInputs())
            await onConfirm(pet, chosenDate, lostLocation);
    };
    const handleCancel =()=>{
        onCancel();
    }

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handleDateChange = (date) => {
        setChosenDate(date.dateString);
        setIsDateEmpty(false);
        toggleCalendar();
    }

    const isValidInputs = () => {
        let isValidInputs = true;
        if (chosenDate === '') {
            isValidInputs = false;
            setIsDateEmpty(true);
        }

        return isValidInputs;
    };


    return (
        <View>
            <Dialog.Container visible={visible}>
                <Dialog.Description>{confirmationText}</Dialog.Description>
                <Text style={styles.titles} >Pet Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter the location you found the pet at"
                  value={lostLocation}
                  onChangeText={handleLocationChange}
                />
                {isLostLocationEmpty && <Text style={styles.wrongCredentialsText}>Please enter the location you lost the pet at</Text>}
                <View style={styles.calendarComponent}>
                    <Text>Date Lost</Text>
                    <Text style={{left: 10}}> {chosenDate} </Text>
                </View>
                <TouchableHighlight
                    underlayColor="rgba(128, 128, 128, 0.1)">
                    <FontAwesome name="calendar" size={23} style={styles.faIcons} icon="fa-solid fa-calendar-lines" onPress={toggleCalendar}/>
                </TouchableHighlight>


                {showCalendar && <ScrollView><Calendar style={styles.calendar}
                                                           onDayPress={handleDateChange}
                                                           markedDates={{[chosenDate]: {selected: true}}}/></ScrollView>}

                {isDateEmpty && <Text style={styles.wrongCredentialsText}>Please select the lost date</Text>}

                <Dialog.Button onPress={handleCancel} label="Cancel" />
                <Dialog.Button onPress={handleConfirm} label="Confirm" />
            </Dialog.Container>
        </View>
    );
};
const styles = StyleSheet.create({
    calendar: {
        width: '100%',
        height: '30%',
        marginTop:'3%'
    },
    calendarComponent: {
        flexDirection: 'row',
        fontFamily: 'sans-serif-medium',
        fontSize: 15,
        width: '85%',
        margin: '3%',
        marginBottom: -10,
        padding: 10,
    },
    faIcons: {
        color: appPurpleDark,
        left:'5%',
        top: 18,
        marginBottom: '3%',
    },
    wrongCredentialsText: {
        color: 'red',
        marginBottom: 10,
    },
    titles: {
        fontFamily: 'sans-serif-medium',
        fontSize: 15,
        width: '85%',
        margin: '3%',
        marginBottom: -10,
        padding: 10,
    },
    input: {
        borderColor: borderGrey,
        fontFamily: 'sans-serif-medium',
        height: 40,
        width: '85%',
        margin: '3%',
        borderWidth: 1,
        padding: 10,
    },
});

export default SingleDatePopUp;
