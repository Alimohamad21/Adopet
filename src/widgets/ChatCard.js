import React, { useContext } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CurrentUserContext } from '../providers/CurrentUserProvider';
import { useNavigation } from '@react-navigation/native';
import { ChatScreenRoute } from '../utilities/constants';
import { firestoreTimeStampToDateString } from '../utilities/stringUtilities';

/**
 * @param {Chat} chat
 * @param {Boolean} isPoster
 */
const ChatCard = ({ chat, isPoster }) => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    const lastMessageText = lastMessage.image ? 'Sent an image' : lastMessage.text;
    const fullName = isPoster ? chat.userThatRequestedFullName : chat.userThatPostedFullName;
    const profilePicture = isPoster ? chat.userThatRequestedProfilePicture : chat.userThatPostedProfilePicture;
    const navigation = useNavigation();

    // Count the number of unread messages
    const unreadMessagesCount = isPoster?chat.userThatPostedUnReadMessagesCount:chat.userThatRequestedUnReadMessagesCount;
    const isUnread = unreadMessagesCount > 0;

    const handleChatNavigation = () => {
        navigation.navigate(ChatScreenRoute, { chat: chat });
    };

    return (
        <TouchableOpacity onPress={handleChatNavigation}>
            <View style={[styles.container, isUnread && styles.unread]}>
                {profilePicture !== '' ? (
                    <Image source={{ uri: profilePicture }} style={styles.profileBtnIcon} />
                ) : (
                    <Image source={require('../assets/default_user.png')} style={styles.profileBtnIcon} />
                )}
                <View style={styles.textContainer}>
                    <Text h4>{fullName}</Text>
                    <Text style={styles.purpleText}>{`${chat.petName}'s ${chat.postType} `}</Text>
                    <View style={styles.lastMessageContainer}>
                        <Text style={[styles.lastMessage, isUnread && styles.unread]}>{`${lastMessageText}`}</Text>
                        <Text style={[styles.time, isUnread && styles.unread]}>{`${firestoreTimeStampToDateString(lastMessage.createdAt)}`}</Text>
                    </View>
                </View>
                {isUnread && <View style={styles.unreadBadge}><Text style={styles.unreadBadgeText}>{unreadMessagesCount}</Text></View>}
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
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10,
    },
    unreadBadge: {
        backgroundColor: '#8a2be2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        height: 20,
        width: 20,
        marginLeft: 10,
    },
    unreadBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    petInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    petInfoText: {
        color: '#8a2be2',
        fontWeight: 'bold',
        marginRight: 5,
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
        color: '#666',
    },
    time: {
        fontSize: 12,
        color: '#c7c7c7',
    },
    unreadMessageContainer: {
        backgroundColor: '#e3e3e3',
        borderRadius: 5,
        padding:25,
        marginTop: 25,
    },
    unread: {
        fontWeight: 'bold',
        color: '#000'
    },
});
export default ChatCard;
