import React, {Component, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    TouchableHighlight, Animated, Button,
} from "react-native";
import {useNavigation, useRoute} from '@react-navigation/native';
import PetDetails from '../widgets/PetDetails';
import MenuImage from "../widgets/MenuImage";
import {CurrentUserContext} from "../providers/CurrentUserProvider";
import {
    appPurpleDark,
    ChatScreenRoute, EditPetDetailsScreenRoute,
    EditUserDetailsScreenRoute, ProfileScreenRoute,
    UploadImageScreenRoute,
    ViewPetScreenRoute,
} from "../utilities/constants";
import {  CreatePetProfileScreenRoute} from "../utilities/constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SlideButton from "../widgets/SlideButton";
import PostCard from "../widgets/PostCard";
import PostServices from "../services/PostServices";
import {FlatList} from "native-base";
import UserServices from "../services/UserServices";
import functions from '@react-native-firebase/functions';
import PetServices from "../services/PetServices";
const ProfileScreen = () => {
    const [view,setView] = useState(1)
    const {currentUser, setCurrentUser} = useContext(CurrentUserContext);
    const navigation = useNavigation();
    const [userPosts,setUserPosts] = useState(null);
    const [userPets,setUserPets] = useState(null);
    const [hideComponents, setHideComponents] = useState(false);
    const [previousOffset,setPreviousOffset] = useState(0);
    const animatedValue = useRef(new Animated.Value(1)).current;
    const fadeOut = useRef(null);
    const fadeIn = useRef(null);
    const [isLoading, setIsLoading] = useState(false);


    useMemo(() => {
        fadeOut.current = Animated.timing(animatedValue, { toValue: 0, useNativeDriver: true });
        fadeIn.current = Animated.timing(animatedValue, { toValue: 1, useNativeDriver: true });
    }, []);

    const handleScroll = (event) => {

        const currentOffset = event.nativeEvent.contentOffset.y;
        // console.log(currentOffset)
        const direction = currentOffset > 0 && currentOffset >= previousOffset ? 'down' : 'up';
        setHideComponents(direction === 'down');
        setPreviousOffset(currentOffset);

        if (direction === 'down' && fadeIn.current) {
            fadeIn.current.stop();
            fadeOut.current.start();
        } else if (direction === 'up' && fadeOut.current) {
            fadeOut.current.stop();
            fadeIn.current.start();
        }
    };
    useLayoutEffect(() => {

        navigation.setOptions({
            headerShadowVisible: false,

            headerTitle:"",

            headerLeft: () => (

                <MenuImage
                    onPress={() => {
                        navigation.openDrawer();
                    }}
                />

            ),
            headerRight: () =>(
                <Image style={styles.logo} source={require('../assets/adopet_logo.png')}></Image>



            ),
        });
        console.log(currentUser)
    }, []);
    useEffect(   () => {
        // functions()
        //     .httpsCallable('get_user_phone_number')({"text":currentUser.phoneNumber})
        //     .then(response => {
        //         console.log(response)
        //     });
        const getUserPosts = async () => {
            const res = await PostServices.getUserPosts(currentUser.uid)
            setUserPosts(res)
        }
        //
        // const unsubscribe = navigation.addListener('focus', async () => {
        //     const user = await UserServices.getUser(currentUser.uid);
        //     setCurrentUser(user);
        // });
        // return unsubscribe;

        //TO DO:  load Pets from database or from current user object
        const getUserPets = async () => {
            const pets = await UserServices.getUserPets(currentUser.uid);
            setUserPets(pets);
        }

        getUserPosts().then()
        getUserPets().then()



    },[navigation])


    const handlePostsSelect =() =>{
        console.log("Posts")
        setView(1)
    }
    // const handlePostsDelete =async () => {
    //     setIsLoading(true);
    //     await PostServices.deletePost(postId);
    //     setIsLoading(false);
    //     navigation.replace(ProfileScreenRoute);
    // }
    const handlePetsSelect =() =>{
        setView(2)
        console.log("Pets")
    }
    const handleViewDetails= (userPet)=>{
        navigation.navigate(ViewPetScreenRoute,{pet:userPet.pet});
    }

    const handleCreatePetProfileNavigation = () =>{
        navigation.navigate(CreatePetProfileScreenRoute)
    }
    const renderPost = ({item}) => {
        return (
            <PostCard post={item} isPoster={true}/>
        );
    };
    const renderPet = ({item}) => {
        return (
            <View style={{  alignItems:"center",paddingTop:"5%",paddingBottom:"10%"}}>
                <Image  source={{uri: item.pet.image}} style={styles.petIcon}/>
                <Text style={{fontWeight:"bold",fontSize:18}}>{item.pet.name}</Text>
                <TouchableOpacity onPress={()=>{
                    handleViewDetails(item)
                }} style={styles.petDetailsButton}>
                    <FontAwesome name={'paw'} style={{fontSize: 21, marginRight: '2%', color: 'white'}}></FontAwesome>
                    <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>handleEditPetDetails(item)} style={{flexDirection:"row",justifyContent:"center"}}>
                    <FontAwesome style={{fontSize: 19, color: appPurpleDark}} name={"edit"}></FontAwesome>
                    <Text style={styles.editDetails} >Edit Pet Details</Text>
                </TouchableOpacity>

            </View>
        );
    };
    const renderFooter = () => {
        return (
            <TouchableOpacity onPress={handleCreatePetProfileNavigation} style={{  alignItems:"center",marginTop:"15%"}}>
                <View style={{alignItems:"center",flexDirection:"row"}}>
                    <FontAwesome name={'plus-circle'} style={{fontSize: 30,color:appPurpleDark}}></FontAwesome>
                    <Text style={{fontSize:18,fontWeight:"bold",marginLeft:"7%"}}>Add Pet</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const handleEditDetails = () => {
        navigation.navigate(EditUserDetailsScreenRoute);
    };
    const handleEditPetDetails = (pet) => {
        navigation.navigate(EditPetDetailsScreenRoute,{userPet:pet});

    };

    return(
        <SafeAreaView style={{flex:1,backgroundColor:"white"}}>
            { !hideComponents &&
                <Animated.View style={{ opacity: animatedValue }}>
                    <View style={styles.profileIconContainer}>

                        {
                            currentUser.profilePicture !== '' ?
                                <Image source={{uri: currentUser.profilePicture}} style={styles.profileIcon}/> :
                                <Image source={require('../assets/default_user.png') }
                                       style={styles.profileIcon}/>}
                    </View>


                    <View style={{alignItems:"center"}}>
                        <View style={{flexDirection:"row",justifyContent:"center"}}>
                            <Text style={styles.nameText}>{currentUser.fullName}</Text>
                        </View>
                        <View style={{flexDirection:"row",justifyContent:"center"}}>
                            <Text style={styles.location}>{currentUser.city}</Text>
                        </View>
                        <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                            <FontAwesome style={{fontSize: 19, color: appPurpleDark}} name={"phone"}></FontAwesome>
                            <Text style={styles.phone}>{currentUser.phoneNumber}</Text>
                        </View>
                        <TouchableOpacity onPress={handleEditDetails} style={{flexDirection:"row",justifyContent:"center"}}>
                            <FontAwesome style={{fontSize: 19, color: appPurpleDark}} name={"edit"}></FontAwesome>
                            <Text style={styles.editDetails} >Edit details</Text>
                        </TouchableOpacity>
                    </View>

                </Animated.View>
            }
            <View style={{height:"5%",marginTop:"2%"}}>
                <SlideButton onFirstPress={handlePostsSelect} onSecondPress={handlePetsSelect} firstText={"Posts"} secondText={"Pets"} ></SlideButton>
            </View>



            {view === 1 &&
                <View  style={{alignItems:"center",paddingTop:"10%",
                    height: hideComponents ===1 ? "50%" : "80%",

                }}>
                    {userPosts &&

                        <FlatList showsVerticalScrollIndicator={false} vertical={true} numColumns={1}
                                  data={userPosts} renderItem={renderPost}
                                  keyExtractor={(adoptionPost) => `${adoptionPost.id}`}
                                  // onScroll={handleScroll}
                            // onScrollBeginDrag={handleScroll}
                                 onScrollEndDrag={handleScroll}
                        />
                    }
                </View>
            }
            { view ===2  &&
                <View style={{ alignItems:"center",marginTop:"15%",height: hideComponents ===1 ? "50%" : "100%",}}>
                    {userPets && userPets.length > 0 ? (
                        <FlatList  showsVerticalScrollIndicator={false} vertical={true} numColumns={1}
                                   data = {userPets} renderItem={renderPet}
                                   keyExtractor={(pet) => `${pet.id}`}
                                   //onScroll={handleScroll}
                                   onScrollEndDrag={handleScroll}
                            // contentContainerStyle={{}}

                                   ListFooterComponent={renderFooter}

                        />) : (renderFooter())
                    }

                </View>

            }

        </SafeAreaView>




    );

};
const { width, height } = Dimensions.get('window');
const imageSize = Math.min(width, height) * 0.4; // adjust the factor as needed
const borderRadius = imageSize / 2;
const petImageSize = Math.min(width, height) * 0.18; // adjust the factor as needed
const petBorderRadius = imageSize / 2;
const styles = StyleSheet.create({
    logo: {

        marginRight:"41%",
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    profileIconContainer: {

        backgroundColor:appPurpleDark,
        width:"100%",
        height:height/6,
        flexDirection:"row",
        justifyContent:"center"
    },
    profileIcon: {

        position:"absolute",
        borderRadius: borderRadius,
        width:imageSize,
        height:imageSize,


    },
    nameText:{
        marginTop:"7%",
        fontSize:20,
        fontWeight:"bold"

    },
    location:{

        fontSize:15,
        fontWeight:"500"
    },
    phone:{
        marginLeft:"2%",
        fontSize:15,
        fontWeight:"500"
    },
    editDetails:{
        marginLeft:"2%",
        fontSize:15,
        fontWeight:"500"
    },
    petIcon:{

        borderRadius: petBorderRadius,
        height: petImageSize,
        width: petImageSize,

    },
    petDetailsButton: {
        flexDirection: 'row',
        marginTop: '2%',
        backgroundColor: appPurpleDark,
        borderRadius: 5,
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingTop: '3%',
        paddingBottom: '3%',
    },
})
export default ProfileScreen;
