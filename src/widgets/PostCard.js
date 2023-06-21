import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View,Animated} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {appPurpleDark, appPurpleLight, ChatScreenRoute, ViewPetScreenRoute} from '../utilities/constants';
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
import {AdoptionPost, FoundPost, HostingPost, LostPost} from "../models/Post";


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
    const [userRating, setUserRating] = useState(null);
    const [userReviewsCount,setUserReviewsCount]=useState(null);
    const addedToSavedText = "Added to saved posts!";
    const removedFromSavedText = "Removed from saved posts!"
    let renderedPost;
    // console.log("post card \n",post)
    if (post instanceof AdoptionPost) {
        renderedPost = <AdoptionPostRenderer post={post} />;
    }
    else if (post instanceof LostPost ) {
        renderedPost = <LostAndFoundPostRenderer post={post} type={"Lost"} />;
    }
    else if (post instanceof FoundPost ) {
        renderedPost = <LostAndFoundPostRenderer post={post} type={"Found"} />;
    }
    else if (post instanceof HostingPost ) {
        renderedPost = <HostPostRenderer post={post} type={"Found"} />;
    }

    useEffect(  () => {
        const checkIsPostSaved = async ()=>{
            const bool = await UserServices.isPostSaved(currentUser.uid,post.id);
            setIsPostSaved(bool);
        }
        const getUserRating = async () => {
            const user = await UserServices.getUser(post.userThatPostedId);
            // console.log(`RATING: ${user.getAverageRating()}`);
            setUserReviewsCount(user.ratingsCount)
            setUserRating(user.getAverageRating());
        };
        getUserRating().then();
        checkIsPostSaved().then()
    },[])
    const callPhoneNumber = () => {
        call({
            number: post.userThatPostedPhoneNumber,
            prompt: false,
            skipCanOpen: true,
        });
    };
    const RatingsWidget = () => {
        const ratingInt = Math.floor(userRating);

        const emptyStars = 5 - ratingInt;

        const fullStars = Array(ratingInt).fill().map((_, index) => (
            <FontAwesome key={`star-${index}`} name={'star'} style={{ fontSize: 10 }} />
        ));

        const halfStar = userRating - ratingInt !== 0 && (
            <FontAwesome key="star-half" name={'star-half-o'} style={{ fontSize: 10 }} />
        );


        const emptyStarsArray = Array(emptyStars).fill().map((_, index) => (
            <FontAwesome key={`star-empty-${index}`} name={'star-o'} style={{ fontSize: 10 }} />
        ));
        let starsRating
        if (!halfStar){
            starsRating=  [
                ...fullStars,
                ...emptyStarsArray,
            ];
        }
        else{
            starsRating = [
                ...fullStars,
                halfStar,
                ...emptyStarsArray,
            ];
        }

        starsRating = starsRating.length > 5 ? starsRating.slice(0,5) : starsRating;
        return starsRating
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
                post.type,
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
    const POST_ITEM_HEIGHT = isPoster ?  height/3 : (height/3 + height/20);
    const POST_ITEM_MARGIN = 15;
    const POST_BORDERS_WIDTH = 0;
    const styles = StyleSheet.create({
        root: {
            flex: 1,
            // position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
        },
        searchBarContainer: {
            marginTop: '1%',
            height: 42,
        },

        postContainer: {
            // marginTop: '2%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            width: (SCREEN_WIDTH - (PostNumColumns + 1) * POST_ITEM_MARGIN +17) / PostNumColumns,
            height: POST_ITEM_HEIGHT ,
            backgroundColor: "white",
            // backgroundColor: '#e6e9fa',
            // borderWidth:1,
            borderColor:appPurpleDark,
            // marginBottom: '7%',
            borderRadius: 5,

        },
        postHeader: {

            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom:"2%",
            borderWidth:POST_BORDERS_WIDTH,
            borderColor:appPurpleDark,
            borderTopLeftRadius:7,
            borderTopRightRadius:7,
            // backgroundColor: "#e6e9fa"
            backgroundColor: "#dcddf7",
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
            height: SCREEN_WIDTH/9.5,
            width: SCREEN_WIDTH/9.5,

        },
        postBody: {
            flexDirection:"row",
            // justifyContent: 'center',
            // alignItems: 'center',
            // borderBottomWidth:1,
            // borderTopWidth:1,
            borderRightWidth:POST_BORDERS_WIDTH,
            borderColor:appPurpleDark,
            borderBottomWidth: isPoster ? POST_BORDERS_WIDTH : 0 ,
            borderBottomRightRadius: 0,
            //backgroundColor: "#dcddf7",
            backgroundColor: "#e6e9fa",
            borderBottomLeftRadius: 0
        },
        postImage: {

            // marginRight:"2%",
            height: SCREEN_WIDTH/2.7,
            width: SCREEN_WIDTH/2.7,
        },
        postTitle: {
            paddingLeft:"1%",
            fontSize: 16,
            color: 'black',
            fontWeight: 'bold',

        },
        imageContainer: {
            // marginLeft:"7%",
            // alignItems: 'center',
            // width: '90%',
            // height: '60%',
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
            borderBottomColor: appPurpleDark,
            borderBottomWidth: 1,
            marginVertical: 10,
        },
        verticalSeparator: {
            borderRightColor: appPurpleDark,
            borderRightWidth: 1,

            // height: '120%',
        },

        postFooter: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            borderWidth:POST_BORDERS_WIDTH,
            borderColor:appPurpleDark,
            paddingTop:"2%",
            paddingBottom:"2%",
            borderBottomLeftRadius:7,
            borderBottomRightRadius:7,
            //backgroundColor: "#e6e9fa",
            backgroundColor: "#dcddf7",

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
                            {post.userThatPostedProfilePicture === "" ?
                                <Image style={styles.profileBtnIcon}
                                       source={require('../assets/default_user.png')}></Image> :
                                <Image source={{uri: post.userThatPostedProfilePicture}}
                                       style={styles.profileBtnIcon}/>}
                            <View>
                                <Text
                                    style={{marginTop: '2%', marginLeft: '2%'}}>{post.userThatPostedFullName}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <RatingsWidget/>
                                    <Text style={{fontSize: 12}}> ({userReviewsCount})</Text>
                                </View>

                            </View>
                        </View>

                        <View style={{marginRight: '0%', flexDirection: 'row', marginTop: '3%'}}>
                            <FontAwesome name={'map-marker'} style={{fontSize: 15}}></FontAwesome>
                            <Text style={{fontSize: 12, marginLeft: '2%'}}>{post.userThatPostedCity}</Text>
                            <TouchableOpacity onPress={() => handleSavePostClick()} style={{marginLeft: '10%'}}>
                                {isPostSaved &&
                                    <FontAwesome name={'bookmark'}
                                                 style={{fontSize: 25, color: '#C99200'}}></FontAwesome>
                                }
                                {!isPostSaved &&
                                    <FontAwesome name={'bookmark'}
                                                 style={{fontSize: 25, color: appPurpleDark}}></FontAwesome>
                                }

                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => handleViewDetails(post)} style={styles.postBody}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.postImage} source={{uri: post.pet.image}}></Image>
                        </View>
                        <View style={{flexDirection: "column"}}>
                            <Text style={styles.postTitle}>{post.pet.name}</Text>
                            <Text style={{
                                paddingLeft: '2%',
                                paddingRight: '2%',
                                color: 'black',
                            }}>{post.pet.description}</Text>
                        </View>

                        {/*<TouchableOpacity style={styles.detailsButton}>*/}
                        {/*    <FontAwesome name={'paw'}*/}
                        {/*                 style={{fontSize: 21, marginRight: '2%', color: 'white'}}></FontAwesome>*/}
                        {/*    <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Details</Text>*/}
                        {/*</TouchableOpacity>*/}
                    </TouchableOpacity>


                    {!isPoster &&
                        <View>
                            {/*<View style={styles.horizontalSeparator}/>*/}
                            <View style={styles.postFooter}>
                                <TouchableOpacity onPress={callPhoneNumber}>
                                    <FontAwesome name={'phone'}
                                                 style={{fontSize: 30, color: appPurpleDark}}></FontAwesome>
                                </TouchableOpacity>
                                <View style={styles.verticalSeparator}/>
                                <TouchableOpacity onPress={() => handleChatNavigation(post)}>
                                    <FontAwesome name={'commenting'}
                                                 style={{fontSize: 30, color: appPurpleDark}}></FontAwesome>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }

                    <Portal>
                        <Animated.View style={styles.fadingComponent}>
                            <Text>{fadedText}</Text>
                        </Animated.View>
                    </Portal>

                </View>

            </Provider>
        );
    }
    function HostPostRenderer({ post}) {
        return(
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
                                <View style={{flexDirection: 'row',alignItems:'center'}}>
                                    <RatingsWidget/>
                                    <Text style={{fontSize:12}}> ({userReviewsCount})</Text>
                                </View>

                            </View>
                        </View>
                        <View style={{marginTop: '3%',marginLeft:"40%"}}>
                            <View style={{marginRight: '0%', flexDirection: 'row'}}>
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
                            {/*<Text style={{fontSize: 12, marginLeft: '2%'}}>{post.createdAt.toDate().toString()}</Text>*/}
                        </View>
                    </View>
                    <TouchableOpacity onPress={()=>handleViewDetails(post)} style={styles.postBody}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.postImage} source={{uri: post.pet.image}}></Image>
                        </View>
                        <View style={{
                            alignItems:"flex-start",
                            marginLeft:"1%",

                        }}>
                            <Text style={styles.postTitle}>{post.pet.name}</Text>
                            <Text style={{
                                paddingLeft: '1%',
                                paddingRight: '2%',

                                width: SCREEN_WIDTH/1.8,
                                flexShrink: 1,
                                color: 'grey',
                                fontSize:13,
                            }}>{post.pet.description}</Text>

                                <View style={{marginTop:"2%"}}>
                                    <View style={{flexDirection:"row",alignItems:"center",marginTop:"2%"}}>
                                        <Text style={{color:"black",fontSize:13,textAlign:"center",marginLeft:"1%"}}>Start Date:</Text>
                                        <Text style={{fontWeight:"bold", color:"black",textAlign:"center",marginLeft:"2%"}}>{post.startDate}</Text>
                                    </View>
                                    <View style={{flexDirection:"row",alignItems:"center",marginTop:"2%"}}>
                                        <Text style={{color:"black",fontSize:13,marginLeft:"1%"}}>End Date:</Text>
                                        <Text style={{fontWeight:"bold", color:"black",textAlign:"center",marginLeft:"2%"}}>{post.endDate}</Text>
                                    </View>
                                    <View style={{flexDirection:"row",alignItems:"center",marginTop:"2%"}}>
                                        <Text style={{color:"black",fontSize:13,marginLeft:"1%"}}>Duration:</Text>
                                        <Text style={{fontWeight:"bold", color:"black",textAlign:"center",marginLeft:"2%"}}>{post.duration}</Text>
                                    </View>

                                </View>

                        </View>
                    </TouchableOpacity>
                    {!isPoster &&
                        <View style={styles.postFooter}>
                            <TouchableOpacity onPress={callPhoneNumber}>
                                <FontAwesome name={'phone'} style={{fontSize: 30, color: appPurpleDark}}></FontAwesome>
                            </TouchableOpacity>
                            <View style={styles.verticalSeparator}/>
                            <TouchableOpacity onPress={()=>handleChatNavigation(post)}>
                                <FontAwesome name={'commenting'} style={{fontSize: 30, color: appPurpleDark}}></FontAwesome>
                            </TouchableOpacity>
                        </View>
                    }

                    <Portal>
                        <Animated.View style={styles.fadingComponent}>
                            <Text>{fadedText}</Text>
                        </Animated.View>
                    </Portal>

                </View>

            </Provider>
        );
    }
    function LostAndFoundPostRenderer({ post,type }) {
        return(
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
                                <View style={{flexDirection: 'row',alignItems:'center'}}>
                                    <RatingsWidget/>
                                    <Text style={{fontSize:12}}> ({userReviewsCount})</Text>
                                </View>

                            </View>
                        </View>
                        <View style={{marginTop: '3%',marginLeft:"40%"}}>
                            <View style={{marginRight: '0%', flexDirection: 'row'}}>
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
                            {/*<Text style={{fontSize: 12, marginLeft: '2%'}}>{post.createdAt.toDate().toString()}</Text>*/}
                        </View>
                    </View>
                    <TouchableOpacity onPress={()=>handleViewDetails(post)} style={styles.postBody}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.postImage} source={{uri: post.pet.image}}></Image>
                        </View>
                        <View style={{
                            alignItems:"flex-start",
                            marginLeft:"1%",

                        }}>
                            <Text style={styles.postTitle}>{post.pet.name}</Text>
                            <Text numberOfLines={2}  ellipsizeMode="tail" style={{
                                paddingLeft: '1%',
                                paddingRight: '2%',

                                width: SCREEN_WIDTH/1.8,
                                flexShrink: 1,
                                color: 'grey',
                                fontSize:13,
                            }}>{post.pet.description}</Text>
                            {
                                type === "Lost" &&

                                <View style={{marginTop:"2%"}}>
                                    <View style={{flexDirection:"row",alignItems:"center",marginTop:"2%"}}>
                                        <Text  style={{fontWeight:"bold",color:"black",fontSize:13,textAlign:"center",marginLeft:"1%"}}>Lost Near:</Text>
                                        <Text  style={{ color:"black",textAlign:"center",fontSize:12,marginLeft:"2%"}}>{post.lostLocation}</Text>
                                    </View>
                                    <View style={{flexDirection:"row",alignItems:"center",marginTop:"2%"}}>
                                        <Text style={{fontWeight:"bold",color:"black",fontSize:13,marginLeft:"1%"}}>Date Lost:</Text>
                                        <Text   style={{ color:"black",textAlign:"center",fontSize:12,marginLeft:"2%"}}>{post.lostDateAndTime}</Text>
                                    </View>

                                </View>


                            }
                            {
                                type === "Found" &&

                                <View style={{marginTop:"2%"}}>
                                    <View style={{flexDirection:"row",alignItems:"center",marginTop:"2%"}}>
                                        <Text style={{fontWeight:"bold",color:"black",fontSize:13,textAlign:"center",marginLeft:"1%"}}>Found Near:</Text>
                                        <Text style={{ color:"black",textAlign:"center",fontSize:12,marginLeft:"2%"}}>{post.foundLocation}</Text>
                                    </View>
                                    <View style={{flexDirection:"row",alignItems:"center",marginTop:"2%"}}>
                                        <Text style={{fontWeight:"bold",color:"black",fontSize:13,marginLeft:"1%"}}>Date Found:</Text>
                                        <Text style={{ color:"black",textAlign:"center",fontSize:12,marginLeft:"2%"}}>{post.foundDateAndTime}</Text>
                                    </View>

                                </View>


                            }

                            {/*<TouchableOpacity onPress={()=>handleViewDetails(post)} style={styles.detailsButton}>*/}
                            {/*    <FontAwesome name={'paw'}*/}
                            {/*                 style={{fontSize: 21, marginRight: '2%', color: 'white'}}></FontAwesome>*/}
                            {/*    <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Details</Text>*/}
                            {/*</TouchableOpacity>*/}

                        </View>
                    </TouchableOpacity>
                    {!isPoster &&
                        <View style={styles.postFooter}>
                            <TouchableOpacity onPress={callPhoneNumber}>
                                <FontAwesome name={'phone'} style={{fontSize: 30, color: appPurpleDark}}></FontAwesome>
                            </TouchableOpacity>
                            <View style={styles.verticalSeparator}/>
                            <TouchableOpacity onPress={()=>handleChatNavigation(post)}>
                                <FontAwesome name={'commenting'} style={{fontSize: 30, color: appPurpleDark}}></FontAwesome>
                            </TouchableOpacity>
                        </View>
                    }

                    <Portal>
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
