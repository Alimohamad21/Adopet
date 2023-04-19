import React, {useState, useCallback, useEffect, useContext, useLayoutEffect} from 'react';
import {Bubble, Composer, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import {CurrentUserContext} from '../providers/CurrentUserProvider';
import ChatServices from '../services/ChatServices';
import Chat from '../models/Chat';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import {useNavigation, useRoute} from '@react-navigation/native';
import MenuImage from "../widgets/MenuImage";
import {View, Text, Image, Button, TouchableOpacity} from "react-native";
import {appPurpleDark, ChatScreenRoute} from "../utilities/constants";
import ImagePickerButton from "../widgets/ImagePickerButton";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import uuid from "uuid";
import { v4 as uuidv4 } from 'uuid';
import TransparentLoadingIndicator from "../widgets/TransparentLoadingIndicator";


export function ChatScreen() {
    const [messages, setMessages] = useState([]);
    const {currentUser} = useContext(CurrentUserContext);
    const route = useRoute();
    const {adoptionPost} = route.params;
    const [chat,setChat] = useState(null);
    const navigation = useNavigation();
    const [hasEarlierMessages, setHasEarlierMessages] = useState(true);
    const [isLoadingEarlierMessages, setIsLoadingEarlierMessages] = useState(false);


    let name = ""
    let imageUri = ""


    useEffect(()=>{
        console.log("1st UseEffect")

        ChatServices.getChat(adoptionPost.userThatPostedId, currentUser.uid,adoptionPost.id).then(async (data) => {
                if (data) {
                    setChat(data)
                }
                else {
                    const newChat = new Chat('',
                        [],
                        adoptionPost.pet.name,
                        'Adoption',
                        adoptionPost.userThatPostedFullName,
                        adoptionPost.userThatPostedId,
                        adoptionPost.userThatPostedProfilePicture,
                        currentUser.fullName,
                        currentUser.uid,
                        currentUser.profilePicture,
                        adoptionPost.id
                    );
                    newChat.id = await ChatServices.initializeChat(newChat);

                    setChat(newChat)
                }

            }
        )
    },[]);

    useEffect(() => {
        console.log("2nd UseEffect")
        if(chat) {
        handleChat();
        navigation.setOptions({

            headerTitle: "",
            headerRight: () => <View>
                <View style={{flexDirection: 'row',marginRight:"55%",marginTop:"3%"}}>
                <Image source={{uri: imageUri}} style={{
                    marginRight: "5%",
                    borderRadius: 50,
                    height: 40,
                    width: 40,
                }}></Image>
                <Text style={{fontSize:17, marginTop:"5%",color:"white",fontWeight:"bold"}}>{name}</Text>
                </View>
                <View style={{flexDirection: 'row',marginRight:"35%"}}>
                    <Text style={{fontSize:15, marginTop:"3%",color:"white",fontWeight:"600",marginLeft:"1%",marginBottom:"2%"}}>{`${chat.petName} ${chat.postType} `}</Text>
                </View>

            </View>,
        });

            const unsubscribe = ChatServices.listenForChatMessages(chat.id, onMessageReceived).then(() => {
                return () => {
                    unsubscribe();
                };
            });
        }




    }, [chat, chat  != null ]);
    const onMessageReceived = (newMessage,index) => {
        const formattedMessage = getFormattedMessage(newMessage,index);
        if (!messages.some((message) => message._id === formattedMessage._id)) {
            setMessages(previousMessages => GiftedChat.append(previousMessages, [formattedMessage]));
        }

    };
    function handleChat(){
        if (currentUser === chat.userThatPostedId ){

            name = chat.userThatRequestedFullName
            imageUri = chat.userThatRequestedProfilePicture
        }else {

            name = chat.userThatPostedFullName
            imageUri = chat.userThatPostedProfilePicture
        }
        if (chat.messages.length > 0) {
            const formattedMessages = chat.messages.map((message,index) => getFormattedMessage(message,index));
            formattedMessages.sort((a, b) => b.createdAt - a.createdAt)
            let slicedMessages = formattedMessages.slice(0,15)

            setMessages(slicedMessages);
        }
    }

    const getFormattedMessage = (message,index) => {
        return {
            _id: uuidv4(),
            text: message.text,
            createdAt: message.createdAt.toDate(),
            user: {
                _id: message.uid,
                name: currentUser.uid === chat.userThatPostedId ? chat.userThatRequestedFullName: chat.userThatPostedFullName ,
                avatar: currentUser.uid === chat.userThatPostedId ? chat.userThatRequestedProfilePicture: chat.userThatPostedProfilePicture  ,
            },
        };
    };


    const loadEarlierMessages = useCallback(() => {


        if (isLoadingEarlierMessages || !hasEarlierMessages) {
            return;
        }

        setIsLoadingEarlierMessages(true);

            console.log(messages[messages.length-1].createdAt)

            ChatServices.loadEarlierMessages(chat.id, messages[messages.length-1].createdAt,10).then((newMessages) => {
                console.log(newMessages)
                if (newMessages.length > 0) {
                    const formattedMessages = newMessages.map((message,index) => getFormattedMessage(message,index));
                    formattedMessages.sort((a, b) => b.createdAt - a.createdAt)
                    setMessages((previousMessages) => GiftedChat.prepend(previousMessages, formattedMessages));
                } else {
                    setHasEarlierMessages(false);
                }

                setIsLoadingEarlierMessages(false);
            });

    }, [chat,isLoadingEarlierMessages, hasEarlierMessages, messages]);

    const onSend = useCallback((messages = []) => {
        //setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        if (!chat) {
            return;
        }
        console.log(messages.length)
        const message = messages[messages.length - 1];
        console.log("OnSebd chat id",chat.id)
        ChatServices.sendMessage(chat.id, message.text, message.user._id, message.createdAt,
            currentUser.uid === chat.userThatPostedId?chat.userThatRequestedId:chat.userThatPostedId,
            message.user.name
        ).then(()=>console.log("Message sent"));
    }, [chat]);
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: appPurpleDark
                    }
                }}
            />
        );
    };
    const renderSend = (props) => {
        return (
            <Send {...props} disabled={!props.text}>

                    <FontAwesome name={"paper-plane"} style={{fontSize:27,marginRight:"5%",marginBottom:"15%",color:appPurpleDark}}></FontAwesome>

            </Send>
        );
    };


        return (

            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: currentUser.uid,
                    name: currentUser.fullName,
                    avatar: currentUser.profilePicture,
                }}
                renderBubble={renderBubble}

                renderInputToolbar={(props) => (
                    <InputToolbar {...props} renderSend={renderSend}   />
                )}
                loadEarlier={hasEarlierMessages && messages.length>14}
                onLoadEarlier={loadEarlierMessages}
                isLoadingEarlierMessages={true}
                scrollToBottom={true}
               // renderLoading={() => <TransparentLoadingIndicator />}


            />

        );

}

export default ChatScreen;
