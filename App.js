import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import UserServices from './src/services/UserServices';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from "@react-navigation/native";
import AuthScreen from "./src/screens/AuthScreen";
const Stack = createNativeStackNavigator();
export function App() {


  //return user ? <HomeScreen user={user} /> : <LoginScreen />;
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Auth"   screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="Auth" component={AuthScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
} export default App;
