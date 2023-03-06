import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import UserServices from '../services/UserServices';

export function AuthScreen() {
    // Set an initializing state whilst Firebase connects
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((authUser) => {
            if (authUser) {
                UserServices.getUser(authUser.uid).then((user) => {
                    setUser(user);
                    setLoading(false);
                });
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    if (loading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    return user ? <HomeScreen user={user} /> : <LoginScreen />;

} export default AuthScreen;
