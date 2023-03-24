import React, {useState, useEffect, useRef} from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import UserServices from './src/services/UserServices';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from "@react-navigation/native";
import AuthScreen from "./src/screens/AuthScreen";
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
    appPurpleDark,
    AuthScreenRoute,
    HomeScreenRoute,
    LoginScreenRoute,
    SignupScreenRoute,
    UploadImageScreenRoute,
} from './src/utilities/constants';
import SignupScreen from "./src/screens/SignupScreen";
import UploadImageScreen from './src/screens/UploadImageScreen';

import {NativeBaseProvider} from "native-base";
import DrawerContainer from "./src/widgets/DrawerContainer";

const AppStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStackScreens(){
    return (

        <AuthStack.Navigator screenOptions={{headerShown: false}}>
            <AuthStack.Screen name={LoginScreenRoute} component={LoginScreen} />
            <AuthStack.Screen name={SignupScreenRoute} component={SignupScreen} />
        </AuthStack.Navigator>
    );
}
function AppStackScreens() {
    return (
        <AppStack.Navigator >
            <AppStack.Screen name={HomeScreenRoute} component={HomeScreen} />
            <AppStack.Screen name={UploadImageScreenRoute} component={UploadImageScreen} />
        </AppStack.Navigator>
    );
}
const SwitchNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}} headerMode="none">
      <Stack.Screen name="AuthLoading" component={AuthScreen} />
      <Stack.Screen name="App" component={AppStackScreens} />
      <Stack.Screen name="Auth" component={AuthStackScreens} />

  </Stack.Navigator>
);


const DrawerNavigator = () => (
    <Drawer.Navigator
        drawerPosition='left'
        initialRouteName='Main'

        screenOptions={{headerShown: false,
            drawerStyle:{
                backgroundColor: appPurpleDark,
                width: "60%",
            }}}
        drawerContent={({navigation})=> <DrawerContainer navigation={navigation}   />}
    >
        <Drawer.Screen name="App" component={SwitchNavigator} />
    </Drawer.Navigator>
);
export function App() {

    return (
        <NativeBaseProvider>
            <NavigationContainer >

                <DrawerNavigator />
            </NavigationContainer>
        </NativeBaseProvider>
    );
} export default App;
