import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {appPurpleDark, ViewPetScreenRoute} from '../utilities/constants';
import React from 'react';
import {blueGrey100} from 'react-native-paper/src/styles/themes/v2/colors';
import call from 'react-native-phone-call';
import {useNavigation} from '@react-navigation/native';

/**
 * @param {AdoptionPost} adoptionPost
 */
const AdoptionPostCard = ({adoptionPost}) => {
    const navigation=useNavigation();
    const callPhoneNumber = () => {
        call({
            number: adoptionPost.userThatPostedPhoneNumber,
            prompt: false,
            skipCanOpen: true,
        });
    };

    const handleViewDetails= ()=>{
        navigation.navigate(ViewPetScreenRoute,{pet:adoptionPost.pet});
    }

    return (
        <View style={styles.postContainer}>
            <View style={styles.postHeader}>
                <View style={styles.profileContainer}>
                    {adoptionPost.userThatPostedProfilePicture == '' ?
                        <Image style={styles.profileBtnIcon} source={require('../assets/default_user.png')}></Image> :
                        <Image source={{uri: adoptionPost.userThatPostedProfilePicture}}
                               style={styles.profileBtnIcon}/>}
                    <View>
                        <Text style={{marginTop: '2%', marginLeft: '2%'}}>{adoptionPost.userThatPostedFullName}</Text>
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
                    <Text style={{fontSize: 12, marginLeft: '2%'}}>{adoptionPost.userThatPostedCity}</Text>
                    <TouchableOpacity style={{marginLeft: '10%'}}>
                        <FontAwesome name={'bookmark'} style={{fontSize: 25, color: appPurpleDark}}></FontAwesome>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.postBody}>
                <View style={styles.imageContainer}>
                    <Image style={styles.postImage} source={{uri: adoptionPost.pet.image}}></Image>
                </View>
                <Text style={styles.postTitle}>{adoptionPost.pet.name}</Text>
                <Text style={{
                    paddingLeft: '2%',
                    paddingRight: '2%',
                    color: 'black',
                }}>{adoptionPost.pet.description}</Text>
                <TouchableOpacity onPress={handleViewDetails} style={styles.detailsButton}>
                    <FontAwesome name={'paw'} style={{fontSize: 21, marginRight: '2%', color: 'white'}}></FontAwesome>
                    <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Details</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.horizontalSeparator}/>
            <View style={styles.postFooter}>
                <TouchableOpacity onPress={callPhoneNumber}>
                    <FontAwesome name={'phone'} style={{fontSize: 30, color: appPurpleDark}}></FontAwesome>
                </TouchableOpacity>
                <View style={styles.verticalSeparator}/>
                <TouchableOpacity>
                    <FontAwesome name={'commenting'} style={{fontSize: 30, color: appPurpleDark}}></FontAwesome>
                </TouchableOpacity>
            </View>
        </View>
    );
};
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
        marginTop: '4%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: (SCREEN_WIDTH - (PostNumColumns + 1) * POST_ITEM_MARGIN) / PostNumColumns,
        height: POST_ITEM_HEIGHT + 50,
        //backgroundColor: "#e4e5eb",
        backgroundColor: '#e6e9fa',
        marginBottom:'13%',
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
});
export default AdoptionPostCard;
