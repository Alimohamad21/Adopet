import React, {useState, useCallback, useEffect, useContext, useLayoutEffect} from 'react';
import {Bubble, Composer, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';

import ChatServices from '../services/ChatServices';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, Text, Image, TouchableOpacity} from "react-native";
import {appPurpleDark, ChatScreenRoute} from "../utilities/constants";
import ImagePickerButton from "../widgets/ImagePickerButton";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { v4 as uuidv4 } from 'uuid';

import StorageServices from "../services/StorageServices";
import TransparentLoadingIndicator from "../widgets/TransparentLoadingIndicator";


export function ChatScreen() {
    const [messages, setMessages] = useState([]);
    const {currentUser} = useContext(CurrentUserContext);
    const route = useRoute();
    const {chat} = route.params;
    const navigation = useNavigation();
    const [hasEarlierMessages, setHasEarlierMessages] = useState(true);
    const [isLoadingEarlierMessages, setIsLoadingEarlierMessages] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    let name = "";
    let imageUri = "";

    useEffect(() => {
        console.log("2nd UseEffect")
        if(chat) {
            handleChat();
            resetUnReadMessages();
            navigation.setOptions({
                headerTitle: "",
                headerRight: () => <View style={{flex:0.85,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                    <View style={{flexDirection: 'row',marginTop:"0%",justifyContent:"flex-start",alignItems:"center"}}>
                        {imageUri!==""?<Image source={{uri: imageUri}} style={{
                            marginRight: '5%',
                            borderRadius: 50,
                            height: 40,
                            width: 40,
                        }}/>:<Image source={require('../assets/default_user.png')} style={{
                            marginRight: '5%',
                            borderRadius: 50,
                            height: 40,
                            width: 40,
                        }}/>}
                        <Text style={{fontSize:17,color:"white",fontWeight:"bold"}}>{name}</Text>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row'}}>
                        <Text style={{fontSize:13, marginTop:"3%",color:"white",fontWeight:"600",marginBottom:"2%",textDecorationLine: 'underline'}}>{`${chat.petName}'s ${chat.postType} `}</Text>
                    </TouchableOpacity>

                </View>,
            });

            //Listen to messages sent to view them as soon as they are received
            const unsubscribe = ChatServices.listenForChatMessages(chat.id, onMessageReceived).then(() => {
                return () => {
                    unsubscribe();
                };
            });
        }
    }, []);

    //Identify sender and receiver in the chat
    //Format messages to be to view them on screen
    function handleChat(){
        if (currentUser.uid === chat.userThatPostedId ){
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

   function resetUnReadMessages(){
        if(currentUser.uid===chat.userThatPostedId)
        ChatServices.resetUnReadMessagesCountForPoster(chat.id);
        else
       ChatServices.resetUnReadMessagesCountForRequester(chat.id);
    }

    function incrementUnReadMessages(){
        console.log("increment")
        if(currentUser.uid===chat.userThatPostedId)
            ChatServices.incrementUnReadMessagesCountForRequester(chat.id);
        else
            ChatServices.incrementUnReadMessagesCountForPoster(chat.id);
    }


    const getFormattedMessage = (message,index) => {
        if (!message.image) {
            return {
                _id: message._id,
                text: message.text,
                createdAt: message.createdAt.toDate(),
                user: {
                    _id: message.uid,
                    name: currentUser.uid === chat.userThatPostedId ? chat.userThatRequestedFullName : chat.userThatPostedFullName,
                    avatar: currentUser.uid === chat.userThatPostedId ? chat.userThatRequestedProfilePicture : chat.userThatPostedProfilePicture,
                },
            };
      }
        else if (message.image){
            return {
                _id: message._id,
                createdAt: message.createdAt.toDate(),
                user: {
                    _id: message.uid,
                    name: currentUser.uid === chat.userThatPostedId ? chat.userThatRequestedFullName : chat.userThatPostedFullName,
                    avatar: currentUser.uid === chat.userThatPostedId ? chat.userThatRequestedProfilePicture : chat.userThatPostedProfilePicture,
                },
                image: message.image,
                text: message.text
            };
        }
    };

    const onMessageReceived = (newMessage,index) => {
        if(newMessage.uid!==currentUser.uid)
            resetUnReadMessages();
        const formattedMessage = getFormattedMessage(newMessage,index);
        const isDuplicate=messages.some((message) => {
            console.log(`COMPARING: ${message._id} - ${formattedMessage._id}`)
            return message._id === formattedMessage._id;
        });
        if (!isDuplicate) {
            console.log("NOT A DUPE")
            setMessages(previousMessages => GiftedChat.append(previousMessages, [formattedMessage]));
        }
        else{
            console.log("DETECTED DUPES")
        }
    };


    const loadEarlierMessages = useCallback(() => {

        if (isLoadingEarlierMessages || !hasEarlierMessages) {
            return;
        }
        setIsLoadingEarlierMessages(true);
        ChatServices.loadEarlierMessages(chat.id, messages[messages.length-1].createdAt,15).then((newMessages) => {
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
        const message = messages[messages.length - 1];
        if(!message.image)
            ChatServices.sendMessage(chat.id, message._id, message.text, message.user._id, message.createdAt,
                currentUser.uid === chat.userThatPostedId?chat.userThatRequestedId:chat.userThatPostedId,
                message.user.name
            ).then(()=>{
                console.log("Message sent")
                incrementUnReadMessages();
            });
        else if (message.image)
            ChatServices.sendImageMessage(chat.id,message._id, message.image , message.user._id, message.createdAt,
                currentUser.uid === chat.userThatPostedId?chat.userThatRequestedId:chat.userThatPostedId,
                message.user.name
            ).then(()=>{
                console.log("Message sent")
                incrementUnReadMessages();
            });

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

    const handleImageSelect = (chatImageUri) => {
        setSelectedImage(chatImageUri);
        setIsConfirmationModalVisible(true);
    };

    const handleImageSend = async () => {
        setIsLoading(true)
        const chatImageUrl = await StorageServices.uploadImageToFirebase("chat", selectedImage)
        const message = {
            image: chatImageUrl,
            createdAt: new Date(),
            user: {
                _id: currentUser.uid,
                name: currentUser.fullName,
                avatar: currentUser.profilePicture,
            },
        };
        onSend([message]);
        setSelectedImage(null);
        setIsConfirmationModalVisible(false);
        setIsLoading(false)
    };

    const handleImageCancel = () => {
        setSelectedImage(null);
        setIsConfirmationModalVisible(false);
    };

    const renderSend = (props) => {

            return (
                <View style={{ height:"100%", flexDirection: "row", alignItems: "center" }}>
                    <View style={{ marginRight: "3%" }}>
                        <ImagePickerButton onPick={handleImageSelect} />
                    </View>
                    <Send {...props} disabled={!props.text} containerStyle={{  }}>
                        <FontAwesome name={"paper-plane"} style={{ fontSize: 27, paddingBottom:"1.5%",paddingLeft:"1.5%",color: appPurpleDark }}></FontAwesome>
                    </Send>
                </View>
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

                renderSend={renderSend}
                renderInputToolbar={(props) => {
                    if (selectedImage) {
                        return (

                            <View

                                visible={isConfirmationModalVisible}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    flex: 1,
                                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                {isLoading && <TransparentLoadingIndicator/>}

                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        top: 20,
                                        right: 20
                                    }}
                                    onPress={handleImageCancel}
                                >
                                    <FontAwesome name={"times"} style={{fontSize: 27, color: "white"}}></FontAwesome>
                                </TouchableOpacity>
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={{
                                        height: "80%",
                                        width: "80%",
                                        resizeMode: "contain"
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={handleImageSend}
                                    style={{
                                        backgroundColor: appPurpleDark,
                                        paddingVertical: 10,
                                        paddingHorizontal: 30,
                                        borderRadius: 10,
                                        marginTop: 20
                                    }}
                                >
                                    <Text style={{ color: "white" }}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    } else {
                        return <InputToolbar {...props} />;
                    }
                }}
                loadEarlier={hasEarlierMessages && messages.length>14}
                onLoadEarlier={loadEarlierMessages}
                isLoadingEarlierMessages={true}
                scrollToBottom={true}
            />

        );

}

export default ChatScreen;
