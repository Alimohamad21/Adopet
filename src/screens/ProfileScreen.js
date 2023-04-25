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
    TouchableHighlight, Animated,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import PetDetails from '../widgets/PetDetails';
import MenuImage from "../widgets/MenuImage";
import {CurrentUserContext} from "../providers/CurrentUserProvider";
import {appPurpleDark} from "../utilities/constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SlideButton from "../widgets/SlideButton";
import AdoptionPostCard from "../widgets/AdoptionPostCard";
import PostServices from "../services/PostServices";
import {FlatList} from "native-base";
import firestore from '@react-native-firebase/firestore';
const ProfileScreen = () => {
    const [view,setView] = useState(1)
    const {currentUser, setCurrentUser} = useContext(CurrentUserContext);
    const navigation = useNavigation();
    const [userPosts,setUserPosts] = useState(null);
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
            const pet = {
                type: "dog",
                image: "https://example.com/dog.jpg",
                name: "Buddy",
                description: "A friendly and energetic dog who loves to play fetch.",
                age: 3,
                color: "brown",
                breed: "Golden Retriever",
                gender: "male",
                isNeutered: true,
                vaccinations: ["Rabies", "Distemper", "Parvovirus"]
            };

            const userDocRef = firestore.collection('users').doc(currentUser.uid);

            // Use update() method to add the pet object to the "pets" array field
            await userDocRef.update({
                pets: firestore.FieldValue.arrayUnion(pet) // Add the pet object to the "pets" array field
            });

            console.log('Pet added to user successfully');



        const res = await PostServices.getUserAdoptionPosts(currentUser.uid)
            console.log(res)
            setUserPosts(res)
        }
         getUserPosts().then()


    },[])


    const handlePostsSelect =() =>{
        console.log("Posts")
        setView(1)
    }
    const handlePetsSelect =() =>{
        setView(2)
        console.log("Pets")
    }
    const renderPost = ({item}) => {
        return (
            <AdoptionPostCard adoptionPost={item} isPoster={true}/>
        );
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


            <View>
                <View style={{flexDirection:"row",justifyContent:"center"}}>
                    <Text style={styles.nameText}>{currentUser.fullName}</Text>
                </View>
                <View style={{flexDirection:"row",justifyContent:"center"}}>
                    <Text style={styles.location}>{currentUser.city}</Text>
                </View>
                <View style={{flexDirection:"row",justifyContent:"center"}}>
                    <FontAwesome style={{fontSize: 20, color: appPurpleDark}} name={"phone"}></FontAwesome>
                    <Text style={styles.phone}>{currentUser.phoneNumber}</Text>
                </View>

            </View>

                </Animated.View>
            }
            <View style={{flex:1}}>
                <SlideButton onPostsPress={handlePostsSelect} onPetsPress={handlePetsSelect} ></SlideButton>
            </View>



            {view === 1 &&
                <View  style={{alignItems:"center",marginTop:"15%"}}>
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
                <View>
                    <Text>Pets</Text>
                </View>

            }

        </SafeAreaView>




    );

};
const { width, height } = Dimensions.get('window');
const imageSize = Math.min(width, height) * 0.4; // adjust the factor as needed
const borderRadius = imageSize / 2;
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

        resizeMode: 'contain',
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
    }
})
export default ProfileScreen;
