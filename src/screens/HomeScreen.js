import React from 'react';
import { View, Text, Button,StyleSheet } from 'react-native';
import {capitalizeWords} from '../utilities/stringUtilities';
import AuthServices from "../services/AuthServices";

import {LoginScreenRoute} from '../utilities/constants';

const HomeScreen = ({route,navigation}) => {

  const {user}= route.params
  const handleLogOut = () => {
    AuthServices.signOut().then(
        navigation.replace(LoginScreenRoute)
    );
  }
  return (
      <View style={styles.container}>

        <Text style={styles.text}>Welcome to Adopet Mr {capitalizeWords(user.fullName)}</Text>
        <Button title="Log Out" onPress={handleLogOut}/>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default HomeScreen;
