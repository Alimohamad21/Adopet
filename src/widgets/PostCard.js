import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View,Animated} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {appPurpleDark, ChatScreenRoute, ViewPetScreenRoute} from '../utilities/constants';
import React, {useContext, useEffect, useState} from 'react';
import call from 'react-native-phone-call';
import {useNavigation} from '@react-navigation/native';
import ChatServices from '../services/ChatServices';
import Chat from '../models/Chat';
import {CurrentUserContext} from '../providers/CurrentUserProvider';
import TransparentLoadingIndicator from './TransparentLoadingIndicator';
import UserServices from "../services/UserServices";
import PostServices from "../services/PostServices";
import {Portal, Provider} from "react-native-paper";
import {AdoptionPost} from "../models/Post";

/**
 * @param {Post} post
 */
const PostCard = ({post,isPoster}) => {
    const navigation=useNavigation();
    const {currentUser} = useContext(CurrentUserContext);
    const [isLoading,setIsLoading]= useState(false);
    const [isPostSaved,setIsPostSaved] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [fadedText,setFadedText] = useState("") ;
    const addedToSavedText = "Added to saved posts!";
    const removedFromSavedText = "Removed from saved posts!"
    let renderedPost;
    if (post instanceof AdoptionPost) {
        renderedPost = <AdoptionPostRenderer post={post} />;
     }
        // else if (post instanceof HostingPost) {
    //     renderedPost = <HostingPostRenderer post={post} />;
    // }

    useEffect(  () => {
    const checkIsPostSaved = async ()=>{
        const bool = await UserServices.isPostSaved(currentUser.uid,post.id);
        setIsPostSaved(bool);
    }
    checkIsPostSaved().then()
    },[])
    const callPhoneNumber = () => {
        call({
            number: post.userThatPostedPhoneNumber,
            prompt: false,
            skipCanOpen: true,
        });
    };

    const handleViewDetails = (post) => {
        navigation.navigate(ViewPetScreenRoute, {pet: post.pet});
    };
    const handleChatNavigation = async (post) => {
        setIsLoading(true);
        const chat = await ChatServices.getChat(post.userThatPostedId, currentUser.uid, post.id);
        if (chat) {
            setIsLoading(false);
            navigation.navigate(ChatScreenRoute, {chat: chat});
        } else {
            const newChat = new Chat('',
                [],
                post.pet.name,
                'Adoption',
                post.userThatPostedFullName,
                post.userThatPostedId,
                post.userThatPostedProfilePicture,
                currentUser.fullName,
                currentUser.uid,
                currentUser.profilePicture,
                post.id,
                0,
                0
            );
            newChat.id = await ChatServices.initializeChat(newChat);
            setIsLoading(false);
            navigation.navigate(ChatScreenRoute, {chat: newChat});
        }
    }
    const handleSavePostClick= async ()=>{

        if(isPostSaved){
            await UserServices.removeFromSavedPosts(currentUser.uid,post.id)
            setIsPostSaved(false)
            setFadedText(removedFromSavedText)
        }
        else {
            await UserServices.addToSavedPosts(currentUser.uid,post.id);
            setIsPostSaved(true)
            setFadedText(addedToSavedText)
        }
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500, // adjust as needed
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500, // adjust as needed
                    useNativeDriver: true,
                }).start();
            }, 1000); // adjust as needed
        });

    }
    const {width, height} = Dimensions.get('window');
// orientation must fixed
    const SCREEN_WIDTH = width < height ? width : height;

    const PostNumColumns = 1;
// item size
    const POST_ITEM_HEIGHT = 450;
    const POST_ITEM_MARGIN = 15;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
        },
        searchBarContainer: {
            marginTop: '1%',
            height: 42,
        },

        postContainer: {
            marginTop: '7%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            width: (SCREEN_WIDTH - (PostNumColumns + 1) * POST_ITEM_MARGIN) / PostNumColumns,
            height: POST_ITEM_HEIGHT + 50,
            //backgroundColor: "#e4e5eb",
            backgroundColor: '#e6e9fa',
            marginBottom: '7%',
            borderRadius: 5,

        },
        postHeader: {

            flexDirection: 'row',
            justifyContent: 'space-between',

        },
        profileContainer: {
            flex: 1,
            marginTop: '2%',
            marginLeft: '3%',
            flexDirection: 'row',

        },
        profileBtnIcon: {
            marginRight: '2%',
            borderRadius: 50,
            height: '120%',
            width: '15%',

        },
        postBody: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        postImage: {
            height: '100%',
            width: '100%',
        },
        postTitle: {
            fontSize: 20,
            color: 'black',
            fontWeight: 'bold',

        },
        imageContainer: {
            alignItems: 'center',
            width: '90%',
            height: '60%',
        },
        detailsButton: {
            flexDirection: 'row',
            marginTop: '2%',
            backgroundColor: appPurpleDark,
            borderRadius: 5,
            paddingLeft: '2%',
            paddingRight: '2%',
            paddingTop: '1%',
            paddingBottom: '1%',
        },
        horizontalSeparator: {
            borderBottomColor: 'grey',
            borderBottomWidth: 1,
            marginVertical: 10,
        },
        verticalSeparator: {
            borderRightColor: 'grey',
            borderRightWidth: 2,

            height: '120%',
        },

        postFooter: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
        },
        fadingComponent:{
            position: 'absolute',
            justifyContent:"center",
            alignItems:"center",
            top: 0,
            left:0,
            right:0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            opacity: fadeAnim,
            borderRadius:20,
            width: '50%',
            marginLeft: "20%",


        }
    });
    return (
      <View>
          {renderedPost}
      </View>
    );
    function AdoptionPostRenderer({ post }) {
        return (
            <Provider>

                <View style={styles.postContainer}>

                    {isLoading && <TransparentLoadingIndicator/>}

                    <View style={styles.postHeader}>



                        <View style={styles.profileContainer}>
                            {post.userThatPostedProfilePicture === ""  ?
                                <Image style={styles.profileBtnIcon} source={require('../assets/default_user.png')}></Image> :
                                <Image source={{uri: post.userThatPostedProfilePicture}}
                                       style={styles.profileBtnIcon}/>}
                            <View>
                                <Text
                                    style={{marginTop: '2%', marginLeft: '2%'}}>{post.userThatPostedFullName}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <FontAwesome name={'star'} style={{fontSize: 10}}></FontAwesome>
                                    <FontAwesome name={'star'} style={{fontSize: 10}}></FontAwesome>
                                    <FontAwesome name={'star'} style={{fontSize: 10}}></FontAwesome>
                                    <FontAwesome name={'star'} style={{fontSize: 10}}></FontAwesome>
                                    <FontAwesome name={'star-half-o'} style={{fontSize: 10}}></FontAwesome>
                                </View>

                            </View>
                        </View>

                        <View style={{marginRight: '0%', flexDirection: 'row', marginTop: '3%'}}>
                            <FontAwesome name={'map-marker'} style={{fontSize: 15}}></FontAwesome>
                            <Text style={{fontSize: 12, marginLeft: '2%'}}>{post.userThatPostedCity}</Text>
                            <TouchableOpacity onPress={()=>handleSavePostClick()}  style={{marginLeft: '10%'}}>
                                {isPostSaved &&
                                    <FontAwesome name={'bookmark'} style={{fontSize: 25, color: '#C99200' }}></FontAwesome>
                                }
                                {!isPostSaved &&
                                    <FontAwesome name={'bookmark'} style={{fontSize: 25, color: appPurpleDark}}></FontAwesome>
                                }

                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.postBody}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.postImage} source={{uri: post.pet.image}}></Image>
                        </View>
                        <Text style={styles.postTitle}>{post.pet.name}</Text>
                        <Text style={{
                            paddingLeft: '2%',
                            paddingRight: '2%',
                            color: 'black',
                        }}>{post.pet.description}</Text>
                        <TouchableOpacity onPress={()=>handleViewDetails(post)} style={styles.detailsButton}>
                            <FontAwesome name={'paw'}
                                         style={{fontSize: 21, marginRight: '2%', color: 'white'}}></FontAwesome>
                            <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Details</Text>
                        </TouchableOpacity>
                    </View>


                    {!isPoster &&
                        <View>
                            <View style={styles.horizontalSeparator}/>
                            <View style={styles.postFooter}>
                                <TouchableOpacity onPress={callPhoneNumber}>
                                    <FontAwesome name={'phone'} style={{fontSize: 30, color: appPurpleDark}}></FontAwesome>
                                </TouchableOpacity>
                                <View style={styles.verticalSeparator}/>
                                <TouchableOpacity onPress={()=>handleChatNavigation(post)}>
                                    <FontAwesome name={'commenting'} style={{fontSize: 30, color: appPurpleDark}}></FontAwesome>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }

                    <Portal >
                        <Animated.View style={styles.fadingComponent}>
                            <Text>{fadedText}</Text>
                        </Animated.View>
                    </Portal>

                </View>

            </Provider>
        );
    }
};

export default PostCard;
