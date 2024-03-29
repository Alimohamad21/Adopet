import React, {useState, useEffect, useRef} from 'react';
import {View, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import UserServices from './src/services/UserServices';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import AuthScreen from './src/screens/AuthScreen';
import messaging from '@react-native-firebase/messaging';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
    AdoptionScreenRoute,
    appPurpleDark,
    ChatScreenRoute,
    HomeScreenRoute,
    LoginScreenRoute,
    MainAppRoute,
    ProfileScreenRoute,
    SignupScreenRoute,
    EditUserDetailsScreenRoute,
    ChangePasswordScreenRoute,
    SavedPostsScreenRoute,
    OTPScreenRoute,
    FilterPostsScreenRoute,
    UploadImageScreenRoute,
    ViewChatsScreenRoute,
    ViewPetScreenRoute,
    CreatePetProfileScreenRoute,
    LostAndFoundScreenRoute,
    HostingScreenRoute,
    AddAdoptionPostScreenRoute,
    AddHostingPostScreenRoute,
    AddFoundPostScreenRoute,
    PostTypesListScreenRoute,
    EditPetDetailsScreenRoute, AddLostPostScreenRoute
} from './src/utilities/constants';
import SignupScreen from './src/screens/SignupScreen';
import UploadImageScreen from './src/screens/UploadImageScreen';
import {NativeBaseProvider} from 'native-base';
import DrawerContainer from './src/widgets/DrawerContainer';
import {CurrentUserContext,CurrentUserProvider} from './src/providers/CurrentUserProvider';
import NotificationServices from './src/services/NotificationServices';
import AdoptionScreen from "./src/screens/AdoptionScreen";
import ViewPetScreen from './src/screens/ViewPetScreen';
import ProfileScreen from "./src/screens/ProfileScreen";
import ChatScreen from './src/screens/ChatScreen';
import ViewChatsScreen from './src/screens/ViewChatsScreen';
import EditUserDetailsScreen from "./src/screens/EditUserDetailsScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import SavedPostsScreen from "./src/screens/SavedPostsScreen";
import OTPScreen from './src/screens/OTPScreen';
import FilterPostsScreen from "./src/screens/FilterPostsScreen";
import CreatePetProfileScreen from "./src/screens/CreatePetProfileScreen";
import LostAndFoundScreen from "./src/screens/LostAndFoundScreen";
import HostingScreen from "./src/screens/HostingScreen";
import AddAdoptionPostScreen from "./src/screens/AddAdoptionPostScreen";
import AddHostingPostScreen from "./src/screens/AddHostingPostScreen";
import PostTypesListScreen from "./src/screens/PostTypesListScreen";
import EditPetDetailsScreen from "./src/screens/EditPetDetailsScreen";
import AddLostPostScreen from "./src/screens/AddLostPostScreen";
import AddFoundPostScreen from "./src/screens/AddFoundPostScreen";


const AppStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStackScreens() {
    return (

        <AuthStack.Navigator screenOptions={{headerShown: false}}>
            <AuthStack.Screen name={LoginScreenRoute} component={LoginScreen}/>
            <AuthStack.Screen name={SignupScreenRoute} component={SignupScreen}/>
            <AuthStack.Screen name={OTPScreenRoute} component={OTPScreen}/>
        </AuthStack.Navigator>
    );
}

function AppStackScreens() {
    return (
        <AppStack.Navigator screenOptions={{headerTintColor: "white" ,    headerStyle: {
                backgroundColor: appPurpleDark,
            }}} >
            <AppStack.Screen name={HomeScreenRoute} component={HomeScreen}/>
            <AppStack.Screen  name={AdoptionScreenRoute} component={AdoptionScreen}         options={{
                presentation: 'modal',
                animationTypeForReplace: 'push',
                animation:'slide_from_right'
            }}/>
            <AppStack.Screen name={UploadImageScreenRoute} component={UploadImageScreen}/>
            <AppStack.Screen name={ViewPetScreenRoute} component={ViewPetScreen}/>
            <AppStack.Screen name={ProfileScreenRoute} component={ProfileScreen}/>
            <AppStack.Screen name={EditUserDetailsScreenRoute} component={EditUserDetailsScreen}/>
            <AppStack.Screen name={EditPetDetailsScreenRoute} component={EditPetDetailsScreen}/>
            <AppStack.Screen name={ChangePasswordScreenRoute} component={ChangePasswordScreen}/>
            <AppStack.Screen name={ChatScreenRoute} component={ChatScreen}/>
            <AppStack.Screen name={ViewChatsScreenRoute} component={ViewChatsScreen}/>
            <AppStack.Screen name={SavedPostsScreenRoute} component={SavedPostsScreen}/>
            <AppStack.Screen name={LostAndFoundScreenRoute} component={LostAndFoundScreen}/>
            <AppStack.Screen name={HostingScreenRoute} component={HostingScreen}/>
            <AppStack.Screen name={AddAdoptionPostScreenRoute} component={AddAdoptionPostScreen}/>
            <AppStack.Screen name={AddHostingPostScreenRoute} component={AddHostingPostScreen}/>
            <AppStack.Screen name={AddLostPostScreenRoute} component={AddLostPostScreen}/>
            <AppStack.Screen name={AddFoundPostScreenRoute} component={AddFoundPostScreen}/>
            <AppStack.Screen name={PostTypesListScreenRoute} component={PostTypesListScreen}/>
            <AppStack.Screen name={FilterPostsScreenRoute} component={FilterPostsScreen} options={{
                presentation: 'modal',
                animationTypeForReplace: 'push',
                animation:'slide_from_bottom',

            }}/>
            <AppStack.Screen name={CreatePetProfileScreenRoute} component={CreatePetProfileScreen}/>
        </AppStack.Navigator>
    );
}

const SwitchNavigator = () => (
    <Stack.Navigator screenOptions={{headerShown: false}} headerMode="none">
        <Stack.Screen name="AuthLoading" component={AuthScreen}/>
        <Stack.Screen name={MainAppRoute} component={AppStackScreens}/>
        <Stack.Screen name="Auth" component={AuthStackScreens}/>
    </Stack.Navigator>
);


const DrawerNavigator = () => (
    <Drawer.Navigator
        drawerPosition="left"
        initialRouteName="Main"

        screenOptions={{
            headerShown: false,
            drawerStyle: {
                backgroundColor: appPurpleDark,
                width: '60%',
            },
        }}
        drawerContent={({navigation}) => <DrawerContainer navigation={navigation}/>}
    >
        <Drawer.Screen name="Switch" component={SwitchNavigator}/>
    </Drawer.Navigator>
);

export function App() {
    useEffect(() => {
        NotificationServices.requestNotificationsPermission().then(()=>{console.log("requested notification permission")});
        NotificationServices.listenToNotifications();
    }, []);

    return (
        <CurrentUserProvider>
        <NativeBaseProvider>
                <NavigationContainer>
                    <DrawerNavigator/>
                </NavigationContainer>
        </NativeBaseProvider>
        </CurrentUserProvider>
    );
}

export default App;
