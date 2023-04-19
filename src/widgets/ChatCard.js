import React, {useContext} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Avatar, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CurrentUserContext} from '../providers/CurrentUserProvider';
import {useNavigation} from '@react-navigation/native';
import {ChatScreenRoute} from '../utilities/constants';
import {firestoreTimeStampToDateString} from '../utilities/stringUtilities';

/**
 * @param {Chat} chat
 *  * @param {Boolean} isPoster

 */
const ChatCard = ({chat, isPoster}) => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    let fullName = isPoster ? chat.userThatRequestedFullName : chat.userThatPostedFullName;
    let profilePicture = isPoster ? chat.userThatRequestedProfilePicture : chat.userThatPostedProfilePicture;
    const navigation = useNavigation();
    const handleChatNavigation = () => {
        navigation.navigate(ChatScreenRoute, {chat: chat});
    };
    return (
        <TouchableOpacity onPress={handleChatNavigation}>
            <View style={styles.container}>
                {
                    profilePicture !== '' ?
                        <Image source={{uri: profilePicture}} style={styles.profileBtnIcon}/> :
                        <Image source={require('../assets/default_user.png')}
                               style={styles.profileBtnIcon}/>}
                <View style={styles.textContainer}>
                    <Text h4>{fullName}</Text>
                    <Text style={styles.purpleText}>{`${chat.petName} ${chat.postType} `}</Text>
                    <View style={styles.lastMessageContainer}>
                        <Text style={styles.lastMessage}>{lastMessage.text}</Text>
                        <Text style={styles.time}>{firestoreTimeStampToDateString(lastMessage.createdAt)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    profileBtnIcon: {
        borderRadius: 50,
        height: 50,
        width: 50,
        marginLeft: '3%',
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    purpleText: {
        color: '#8a2be2',
    },
    lastMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    lastMessage: {
        flex: 1,
        marginRight: 10,
    },
    time: {
        fontSize: 12,
        color: '#c7c7c7',
    },
});

export default ChatCard;
