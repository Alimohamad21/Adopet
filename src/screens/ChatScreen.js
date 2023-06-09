import React, {useState, useCallback, useEffect, useContext, useLayoutEffect} from 'react';
import {Bubble, Composer, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';

import ChatServices from '../services/ChatServices';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View,StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {appPurpleDark, appPurpleLight, ChatScreenRoute} from '../utilities/constants';
import ImagePickerButton from '../widgets/ImagePickerButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {v4 as uuidv4} from 'uuid';

import StorageServices from '../services/StorageServices';
import TransparentLoadingIndicator from '../widgets/TransparentLoadingIndicator';
import {CurrentUserContext} from '../providers/CurrentUserProvider';
import RatingPopUp from '../widgets/RatingPopUp';
import Review from '../models/Review';
import ReviewServices from '../services/ReviewServices';
import ConfirmationPopUp from '../widgets/ConfirmationPopUp';


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
    const [isLoading, setIsLoading] = useState(false);
    const [ratingShown, setRatingShown] = useState(false);
    const [handOverPopUpShown, setHandOverPopUpShown] = useState(false);
    const [showConfirmHandOverButton,setShowConfirmationHandOverButton] =useState(false);
    let otherUserFullName = '';
    let otherUserImageUrl = '';
    let otherUserId = '';


    useEffect(() => {
        const checkIfReviewed = async () =>{
            if (currentUser.uid === chat.userThatPostedId) {
                otherUserFullName = chat.userThatRequestedFullName;
                otherUserId = chat.userThatRequestedId;
            } else {
                otherUserFullName = chat.userThatPostedFullName;
                otherUserId = chat.userThatPostedId;
            }
            const rated=await ReviewServices.checkIfAlreadyReviewed(chat.postId,currentUser.uid,otherUserId)
            console.log('ALREADY RATED:',rated);
            setShowConfirmationHandOverButton(!rated);
        }
        console.log('Calling check if reviewed:')
        checkIfReviewed();
        if (chat) {
            handleChat();
            resetUnReadMessages();
            navigation.setOptions({
                headerTitle: '',
                headerRight: () => <View
                    style={{flex: 0.85, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: '0%',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}>
                        {otherUserImageUrl !== '' ? <Image source={{uri: otherUserImageUrl}} style={{
                            marginRight: '5%',
                            borderRadius: 50,
                            height: 40,
                            width: 40,
                        }}/> : <Image source={require('../assets/default_user.png')} style={{
                            marginRight: '5%',
                            borderRadius: 50,
                            height: 40,
                            width: 40,
                        }}/>}
                        <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>{otherUserFullName}</Text>
                    </View>
                    <TouchableOpacity style={{flexDirection: 'row'}}>
                        <Text style={{
                            fontSize: 13,
                            marginTop: '3%',
                            color: 'white',
                            fontWeight: '600',
                            marginBottom: '2%',
                            textDecorationLine: 'underline',
                        }}>{`${chat.petName}'s ${chat.postType} `}</Text>
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
    function handleChat() {
        console.log('Before  handleChat');
        if (currentUser.uid === chat.userThatPostedId) {
            otherUserFullName = chat.userThatRequestedFullName;
            otherUserImageUrl = chat.userThatRequestedProfilePicture;
            console.log('Inside first condition in handleChat');
            otherUserId = chat.userThatRequestedId;
            console.log(`Setting other user id to:${otherUserId} ${chat.userThatRequestedId}`);
        } else {
            otherUserFullName = chat.userThatPostedFullName;
            otherUserImageUrl = chat.userThatPostedProfilePicture;
            console.log('Inside second condition in handleChat');
            otherUserId = chat.userThatPostedId;
        }
        console.log('After  handleChat');
        if (chat.messages.length > 0) {
            const formattedMessages = chat.messages.map((message, index) => getFormattedMessage(message, index));
            formattedMessages.sort((a, b) => b.createdAt - a.createdAt);
            let slicedMessages = formattedMessages.slice(0, 15);
            setMessages(slicedMessages);
        }
    }

    function resetUnReadMessages() {
        if (currentUser.uid === chat.userThatPostedId) {
            ChatServices.resetUnReadMessagesCountForPoster(chat.id);
        } else {
            ChatServices.resetUnReadMessagesCountForRequester(chat.id);
        }
    }

    function incrementUnReadMessages() {

        if (currentUser.uid === chat.userThatPostedId) {
            ChatServices.incrementUnReadMessagesCountForRequester(chat.id);
        } else {
            ChatServices.incrementUnReadMessagesCountForPoster(chat.id);
        }
    }


    const getFormattedMessage = (message, index) => {
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
        } else if (message.image) {
            return {
                _id: message._id,
                createdAt: message.createdAt.toDate(),
                user: {
                    _id: message.uid,
                    name: currentUser.uid === chat.userThatPostedId ? chat.userThatRequestedFullName : chat.userThatPostedFullName,
                    avatar: currentUser.uid === chat.userThatPostedId ? chat.userThatRequestedProfilePicture : chat.userThatPostedProfilePicture,
                },
                image: message.image,
                text: message.text,
            };
        }
    };

    const onMessageReceived = (newMessage, index) => {
        if (newMessage.uid !== currentUser.uid) {
            resetUnReadMessages();
        }
        const formattedMessage = getFormattedMessage(newMessage, index);
        const isDuplicate = messages.some((message) => {
            console.log(`COMPARING: ${message._id} - ${formattedMessage._id}`);
            return message._id === formattedMessage._id;
        });
        if (!isDuplicate) {
            console.log('NOT A DUPE');
            setMessages(previousMessages => GiftedChat.append(previousMessages, [formattedMessage]));
        } else {
            console.log('DETECTED DUPES');
        }
    };


    const loadEarlierMessages = useCallback(() => {

        if (isLoadingEarlierMessages || !hasEarlierMessages) {
            return;
        }
        setIsLoadingEarlierMessages(true);
        ChatServices.loadEarlierMessages(chat.id, messages[messages.length - 1].createdAt, 15).then((newMessages) => {
            if (newMessages.length > 0) {
                const formattedMessages = newMessages.map((message, index) => getFormattedMessage(message, index));
                formattedMessages.sort((a, b) => b.createdAt - a.createdAt);
                setMessages((previousMessages) => GiftedChat.prepend(previousMessages, formattedMessages));
            } else {
                setHasEarlierMessages(false);
            }
            setIsLoadingEarlierMessages(false);
        });

    }, [chat, isLoadingEarlierMessages, hasEarlierMessages, messages]);

    const onSend = useCallback((messages = []) => {
        //setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        if (!chat) {
            return;
        }
        const message = messages[messages.length - 1];
        if (!message.image) {
            ChatServices.sendMessage(chat.id, message._id, message.text, message.user._id, message.createdAt,
                currentUser.uid === chat.userThatPostedId ? chat.userThatRequestedId : chat.userThatPostedId,
                message.user.name,
            ).then(() => {
                console.log('Message sent');
                incrementUnReadMessages();
            });
        } else if (message.image) {
            ChatServices.sendImageMessage(chat.id, message._id, message.image, message.user._id, message.createdAt,
                currentUser.uid === chat.userThatPostedId ? chat.userThatRequestedId : chat.userThatPostedId,
                message.user.name,
            ).then(() => {
                console.log('Message sent');
                incrementUnReadMessages();
            });
        }

    }, [chat]);

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: appPurpleDark,
                    },
                }}
            />
        );
    };

    const handleImageSelect = (chatImageUri) => {
        setSelectedImage(chatImageUri);
        setIsConfirmationModalVisible(true);
    };

    const handleImageSend = async () => {
        setIsLoading(true);
        const chatImageUrl = await StorageServices.uploadImageToFirebase('chat', selectedImage);
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
        setIsLoading(false);
    };

    const handleImageCancel = () => {
        setSelectedImage(null);
        setIsConfirmationModalVisible(false);
    };
    const onRatingSubmit = async (rating, comment) => {
        if (currentUser.uid === chat.userThatPostedId) {
            otherUserFullName = chat.userThatRequestedFullName;
            otherUserId = chat.userThatRequestedId;
        } else {
            otherUserFullName = chat.userThatPostedFullName;
            otherUserId = chat.userThatPostedId;
        }
        console.log(`rating: ${rating}`);
        console.log(`comment: ${comment}`);
        console.log(`chat.postType: ${chat.postType}`);
        console.log(`chat.petName: ${chat.petName}`);
        console.log(`currentUser.uid: ${currentUser.uid}`);
        console.log(`currentUser.fullName: ${currentUser.fullName}`);
        console.log(`otherUserFullName: ${otherUserFullName}`);
        console.log(`otherUserId: ${otherUserId}`);
        console.log(`chat.postId: ${chat.postId}`);
        const review = new Review('', false, rating, new Date(), comment, chat.postType, chat.petName, currentUser.uid, currentUser.fullName, otherUserFullName, otherUserId, chat.postId);
        await ReviewServices.addReview(review);
        setRatingShown(false);
        setShowConfirmationHandOverButton(false);
    };
    const renderRating = () => {
        return <RatingPopUp isVisible={ratingShown} onSubmit={onRatingSubmit}/>;
    };
    const showRatingPopUp = () => {
        setHandOverPopUpShown(false);
        setRatingShown(true);
    };
    const showHandOverPopUp = () => {
        setHandOverPopUpShown(true);
    };
    const onCancelHandOverPopUp = () => {
        setHandOverPopUpShown(false);
    };

    const renderFloatingButton = () => {
        return (
            <View
                style={styles.floatingButton}
            >
                <TouchableOpacity onPress={showHandOverPopUp}>
                <View
                    style={{
                        padding: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#fff',
                        }}
                    >
                        Confirm Hand Over
                    </Text>
                </View>
            </TouchableOpacity>
            </View>
        );
    };


    const renderHandOverPopUp = () => {
        return <ConfirmationPopUp visible={handOverPopUpShown}
                                  confirmationText={`Are you sure you want to confirm that ${chat.petName} has been handed over?`}
                                  onConfirm={showRatingPopUp}
                                  onCancel={onCancelHandOverPopUp}/>;
    };

    const renderSend = (props) => {

        return (
            <View style={{height: '100%', flexDirection: 'row', alignItems: 'center'}}>
                <View style={{marginRight: '3%'}}>
                    <ImagePickerButton onPick={handleImageSelect}/>
                </View>
                <Send {...props} disabled={!props.text} containerStyle={{}}>
                    <FontAwesome name={'paper-plane'} style={{
                        fontSize: 27,
                        paddingBottom: '1.5%',
                        paddingLeft: '1.5%',
                        color: appPurpleDark,
                    }}></FontAwesome>
                </Send>
            </View>
        );

    };
    return (
        <GiftedChat
            renderAccessory={
                renderHandOverPopUp
            }
            renderActions={renderRating}
           renderChatFooter={showConfirmHandOverButton?renderFloatingButton:null}
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
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                flex: 1,
                                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {isLoading && <TransparentLoadingIndicator/>}

                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 20,
                                    right: 20,
                                }}
                                onPress={handleImageCancel}
                            >
                                <FontAwesome name={'times'} style={{fontSize: 27, color: 'white'}}></FontAwesome>
                            </TouchableOpacity>
                            <Image
                                source={{uri: selectedImage}}
                                style={{
                                    height: '80%',
                                    width: '80%',
                                    resizeMode: 'contain',
                                }}
                            />
                            <TouchableOpacity
                                onPress={handleImageSend}
                                style={{
                                    backgroundColor: appPurpleDark,
                                    paddingVertical: 10,
                                    paddingHorizontal: 30,
                                    borderRadius: 10,
                                    marginTop: 20,
                                }}
                            >
                                <Text style={{color: 'white'}}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    );
                } else {
                    return <InputToolbar {...props} />;
                }
            }}
            loadEarlier={hasEarlierMessages && messages.length > 14}
            onLoadEarlier={loadEarlierMessages}
            isLoadingEarlierMessages={true}
            scrollToBottom={true}
        />
    );

}
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
    },
    floatingButton:{
        position: 'absolute',
        top: '1%',
        right: '25%',
        backgroundColor: '#42f560',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});


export default ChatScreen;
