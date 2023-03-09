import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import UserServices from './src/services/UserServices';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from "@react-navigation/native";
import AuthScreen from "./src/screens/AuthScreen";
import {AuthScreenRoute, HomeScreenRoute, LoginScreenRoute, SignupScreenRoute} from './src/utilities/constants';
import SignupScreen from "./src/screens/SignupScreen";
const Stack = createNativeStackNavigator();
export function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={AuthScreenRoute} screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name={AuthScreenRoute} component={AuthScreen} />
                <Stack.Screen name={LoginScreenRoute} component={LoginScreen} />
                <Stack.Screen name={HomeScreenRoute} component={HomeScreen} />
                <Stack.Screen name={SignupScreenRoute} component={SignupScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
} export default App;
