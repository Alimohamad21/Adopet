import React, {Component, useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import PetDetails from '../widgets/PetDetails';
import MenuImage from "../widgets/MenuImage";
import {CurrentUserContext} from "../providers/CurrentUserProvider";
import {appPurpleDark} from "../utilities/constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SlideButton from "../widgets/SlideButton";

const ProfileScreen = () => {
    const [view,setView] = useState(1)
    const {currentUser, setCurrentUser} = useContext(CurrentUserContext);
    const  navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShadowVisible: false,

            headerTitle:"",
            // headerTitle:() => (
            //     <Image style={styles.logo} source={require('../assets/adopet_logo.png')}></Image>
            // ),
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
    const handlePostsSelect =() =>{
        console.log("Posts")
        setView(1)
    }
    const handlePetsSelect =() =>{
        setView(2)
        console.log("Pets")
    }
    return(
        <View>


            <View style={styles.profileIconContainer}>
                <Image  source={{uri: currentUser.profilePicture}} style={styles.profileIcon} ></Image>
            </View>
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

            <SlideButton onPostsPress={handlePostsSelect} onPetsPress={handlePetsSelect} ></SlideButton>

            {view === 1 &&
                <View >
                <Text>Posts</Text>
                </View>
            }
            { view ===2  &&
                <View>
                    <Text>Pets</Text>
                </View>

            }

        </View>




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

        resizeMode: 'cover',
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
