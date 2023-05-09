import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Image, FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import {Avatar, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CurrentUserContext} from '../providers/CurrentUserProvider';
import ChatServices from '../services/ChatServices';
import ChatCard from '../widgets/ChatCard';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import NoDataAvailable from '../widgets/NoDataAvailable';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ScrollView} from 'native-base';

const ViewChatsScreen = () => {
    const {currentUser} = useContext(CurrentUserContext);
    const [isLoading, setIsLoading] = useState(true);
    const [myPostsChats, setMyPostsChats] = useState([]);
    const [myRequestsChats, setMyRequestsChats] = useState([]);
    const navigation = useNavigation();
    useEffect(() => {
        const fetchMyPostsChats = async () => {
            const chats = await ChatServices.getUserPostsChats(currentUser.uid);
            setMyPostsChats(chats);
        };

        const fetchMyRequestsChats = async () => {
            const chats = await ChatServices.getUserRequestsChats(currentUser.uid);
            setMyRequestsChats(chats);
        };
        const unsubscribe = navigation.addListener('focus', () => {
            setIsLoading(true);
            fetchMyPostsChats();
            fetchMyRequestsChats().then(() => {
                setIsLoading(false);
            });
        });
        return unsubscribe;
    }, [navigation]);

    if (isLoading) {
        return <ScreenLoadingIndicator/>;
    } else if (myPostsChats.length === 0 && myRequestsChats.length === 0) {
        return <NoDataAvailable text="No Chats"/>;
    } else {
        return (
            <ScrollView>
            <View style={styles.container}>
                {myPostsChats.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>My Posts</Text>
                        {myPostsChats.map(chat => (
                            <ChatCard key={chat.id} chat={chat} isPoster={true}/>
                        ))}
                    </View>
                )}
                {myRequestsChats.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>My Requests</Text>
                        {myRequestsChats.map(chat => (
                            <ChatCard key={chat.id} chat={chat} isPoster={false}/>
                        ))}
                    </View>
                )}
            </View>
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    section: {
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    sectionTitle: {
        marginLeft: 10,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default ViewChatsScreen;
