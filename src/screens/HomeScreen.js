import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {capitalizeWords} from '../utilities/stringUtilities';

const HomeScreen = (props) => {
  const {user}=props;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Adopet Mr {capitalizeWords(user.fullName)}</Text>
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
