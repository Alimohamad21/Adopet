import React, {useState, useCallback, useEffect, useContext} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {CurrentUserContext} from '../providers/CurrentUserProvider';
import ChatServices from '../services/ChatServices';
import Chat from '../models/Chat';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import {useRoute} from '@react-navigation/native';

export function ChatScreen() {
    const [messages, setMessages] = useState([]);
    const {currentUser} = useContext(CurrentUserContext);
    const route = useRoute();
    const {chat} = route.params;


    useEffect(() => {
        const formattedMessages=chat.messages.map((message, index) => getFormattedMessage(message, index))
        formattedMessages.sort((a,b)=>b.createdAt-a.createdAt)
        setMessages(formattedMessages);
    }, []);

    const getFormattedMessage = (message, index) => {
        return {
            _id: index,
            text: message.text,
            createdAt: message.createdAt.toDate(),
            user: {
                _id: message.uid,
                name: currentUser.uid === chat.userThatPostedId ? chat.userThatPostedFullName : chat.userThatRequestedFullName,
                avatar: currentUser.uid === chat.userThatPostedId ? chat.userThatPostedProfilePicture : chat.userThatRequestedProfilePicture,
            },
        };
    };
    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const message = messages[messages.length - 1];
        ChatServices.sendMessage(chat.id, message.text, message.user._id, message.createdAt,
            currentUser.uid === chat.userThatPostedId?chat.userThatRequestedId:chat.userThatPostedId,
            message.user.name
        );
    }, []);

        return (
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: currentUser.uid,
                    name: currentUser.fullName,
                    avatar: currentUser.profilePicture,
                }}
            />
        );

}

export default ChatScreen;
