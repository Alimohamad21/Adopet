import React, {useState} from 'react';
import { View, Text, Button, TextInput, Modal, TouchableOpacity, StyleSheet, TouchableHighlight } from "react-native";
import {Rating,AirbnbRating} from 'react-native-ratings';
import {CheckBox} from 'react-native-elements';
import TransparentLoadingIndicator from './TransparentLoadingIndicator';
import Dialog from "react-native-dialog";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Calendar } from "react-native-calendars";
import { appPurpleDark } from "../utilities/constants";
import { ScrollView } from "native-base";



const DurationPopUp = ({pet, visible,confirmationText, onConfirm,onCancel}) => {

  const today = new Date(Date.now());
  const [isFromDateEmpty, setIsFromDateEmpty] = useState(false);
  const [isToDateEmpty, setIsToDateEmpty] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const handleConfirm = async () => {
    if (isValidInputs())
      await onConfirm(pet, fromDate, toDate);
  };
  const handleCancel =()=>{
    onCancel();
  }

  const toggleFromCalendar = () => {
    setShowFromCalendar(!showFromCalendar);
  };
  const toggleToCalendar = () => {
    setShowToCalendar(!showToCalendar);
  };
  const handleFromDateChange = (date) => {
    setFromDate(date.dateString);
    setIsFromDateEmpty(false);
    toggleFromCalendar();
  }
  const handleToDateChange = (date) => {
    setToDate(date.dateString);
    setIsToDateEmpty(false);
    toggleToCalendar();
  }
  const isValidInputs = () => {
    let isValidInputs = true;
    if (fromDate === '') {
      isValidInputs = false;
      setIsFromDateEmpty(true);
    }
    if (toDate === '') {
      isValidInputs = false;
      setIsToDateEmpty(true);
    }
    return isValidInputs;
  };


  return (
    <View>
      <Dialog.Container visible={visible}>
        <Dialog.Description>{confirmationText}</Dialog.Description>

        <View style={styles.calendarComponent}>
          <Text>From</Text>
          <Text style={{left: 10}}> {fromDate} </Text>
        </View>
        <TouchableHighlight
          underlayColor="rgba(128, 128, 128, 0.1)">
          <FontAwesome name="calendar" size={23} style={styles.faIcons} icon="fa-solid fa-calendar-lines" onPress={toggleFromCalendar}/>
        </TouchableHighlight>


        {showFromCalendar && <ScrollView><Calendar style={styles.calendar}
                                       onDayPress={handleFromDateChange}
                                                   markedDates={{[fromDate]: {selected: true}}}/></ScrollView>}

        {isFromDateEmpty && <Text style={styles.wrongCredentialsText}>Please select the start of duration</Text>}


        <View style={styles.calendarComponent}>
          <Text>To</Text>
          <Text style={{left: 10}}> {toDate} </Text>
        </View>
        <TouchableHighlight
          underlayColor="rgba(128, 128, 128, 0.1)">
          <FontAwesome name="calendar" size={23} style={styles.faIcons} icon="fa-solid fa-calendar-lines" onPress={toggleToCalendar}/>
        </TouchableHighlight>

        {showToCalendar && <ScrollView><Calendar style={styles.calendar}
                                     onDayPress={handleToDateChange}
                                                 markedDates={{[toDate]: {selected: true}}}/></ScrollView>}

        {isToDateEmpty && <Text style={styles.wrongCredentialsText}>Please select the end of duration</Text>}


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
});

export default DurationPopUp;
