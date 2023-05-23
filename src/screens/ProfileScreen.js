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
    ChatScreenRoute,
    EditUserDetailsScreenRoute,
    UploadImageScreenRoute,
    ViewPetScreenRoute,
} from "../utilities/constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SlideButton from "../widgets/SlideButton";
import PostCard from "../widgets/PostCard";
import PostServices from "../services/PostServices";
import {FlatList} from "native-base";
import UserServices from "../services/UserServices";

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
    useMemo(() => {
        fadeOut.current = Animated.timing(animatedValue, { toValue: 0, useNativeDriver: true });
        fadeIn.current = Animated.timing(animatedValue, { toValue: 1, useNativeDriver: true });
    }, []);

    const handleScroll = (event) => {
        console.log(animatedValue)
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = currentOffset > 0 && currentOffset > previousOffset ? 'down' : 'up';
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
    useEffect(  () => {
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
        const pets = [
            {   id:0,
                age: 1,
                breed: "Persian",
                color: "orange",
                description: "Cute",
                gender: "Female",
                isNeutered: false,
                name: "Cheeto",
                ownerID: "MGcgEFgff8ZrVXbDNBTF7ZRFcxc2",
                image: "https://www.thehappycatsite.com/wp-content/uploads/2020/05/yellow-tabby-HC-long.jpg",
                type: "Cat",
                vaccinations: ["Basic"]

            },
            {   id:1,
                age: 1,
                breed: "Persian",
                color: "orange",
                description: "Cute",
                gender: "Female",
                isNeutered: false,
                name: "Cheeto",
                ownerID: "MGcgEFgff8ZrVXbDNBTF7ZRFcxc2",
                image: "https://www.thehappycatsite.com/wp-content/uploads/2020/05/yellow-tabby-HC-long.jpg",
                type: "Cat",
                vaccinations: ["Basic"]


            },

        ];
         setUserPets(pets)
         getUserPosts().then()


    },[navigation])


    const handlePostsSelect =() =>{
        console.log("Posts")
        setView(1)
    }
    const handlePetsSelect =() =>{
        setView(2)
        console.log("Pets")
    }
    const handleViewDetails= (pet)=>{
        navigation.navigate(ViewPetScreenRoute,{pet:pet});
    }
    const handleAddPetNavigation = ()=>{
       // navigation.navigate(AddPetScreenRoute);
    }
    const renderPost = ({item}) => {
        return (
            <PostCard post={item} isPoster={true}/>
        );
    };
    const renderPet = ({item}) => {
        return (
            <View style={{  alignItems:"center",paddingTop:"5%",paddingBottom:"10%"}}>
            <Image  source={{uri: item.image}} style={styles.petIcon}/>
                <Text style={{fontWeight:"bold",fontSize:18}}>{item.name}</Text>
        <TouchableOpacity onPress={()=>{
            handleViewDetails(item)
        }} style={styles.petDetailsButton}>
            <FontAwesome name={'paw'} style={{fontSize: 21, marginRight: '2%', color: 'white'}}></FontAwesome>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Details</Text>
        </TouchableOpacity>

            </View>
        );
    };
    const renderFooter = () => {
        return (
            <TouchableOpacity onPress={handleAddPetNavigation} style={{  alignItems:"center",marginTop:"15%"}}>
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

    return(
        <SafeAreaView style={{flex:1}}>
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
            <View style={{flex:0.2,marginTop:"2%"}}>
                <SlideButton onPostsPress={handlePostsSelect} onPetsPress={handlePetsSelect} ></SlideButton>
            </View>



            {view === 1 &&
                <View  style={{alignItems:"center",paddingTop:"15%"}}>
                    {userPosts &&

                        <FlatList showsVerticalScrollIndicator={true} vertical={true} numColumns={1}
                        data={userPosts} renderItem={renderPost}
                        keyExtractor={(adoptionPost) => `${adoptionPost.id}`}
                            onScroll={handleScroll}

                        />
                    }
                </View>
            }
            { view ===2  &&
                <View style={{ alignItems:"center",marginTop:"15%"}}>
                    {userPets && userPets.length > 0 ? (
                        <FlatList  showsVerticalScrollIndicator={false} vertical={true} numColumns={1}
                              data = {userPets} renderItem={renderPet}
                              keyExtractor={(pet) => `${pet.id}`}
                              onScroll={handleScroll}

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
