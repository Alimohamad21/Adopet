import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Image, FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import {Avatar, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CurrentUserContext} from '../providers/CurrentUserProvider';
import ChatServices from '../services/ChatServices';
import ChatCard from '../widgets/ChatCard';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import NoDataAvailable from '../widgets/NoDataAvailable';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ScrollView} from 'native-base';
import UserServices from "../services/UserServices";
import AdoptionPostCard from "../widgets/AdoptionPostCard";
import PostServices from "../services/PostServices";
import SearchBar from "../widgets/SearchBar";

const SavedPostsScreen = () => {
    const {currentUser} = useContext(CurrentUserContext);
    const [isLoading, setIsLoading] = useState(true);
    //const [mySavedPostsID,setMySavedPostsID] = useState([]);
    const [mySavedPosts,setMySavedPosts] = useState([]);
    const navigation = useNavigation();
    useEffect(() => {
        const getSavedPosts = async (ids)=>{
            const posts = await PostServices.getAdoptionPostsByID(ids);
            console.log("posts: ",posts)
            setMySavedPosts(posts);
            setIsLoading(false);
        }
        const getSavedPostsIDs =async ()=>{
            const ids = await UserServices.getSavedPosts(currentUser.uid);
            if (ids.length>0){
                await getSavedPosts(ids);
            }
            else{
                setMySavedPosts([])
                setIsLoading(false);
            }


        }

        getSavedPostsIDs().then()
    }, []);
    const renderPost = ({item}) => {
        // console.log("render post:",item)
        return (
            <AdoptionPostCard adoptionPost={item} isPoster={false}/>
        );
    };
    if (isLoading) {
        return <ScreenLoadingIndicator/>;
    } else if (mySavedPosts.length === 0) {
        return <NoDataAvailable text="No Saved posts"/>;
    } else {

        return (
            <SafeAreaView style={styles.root}>

                <FlatList showsVerticalScrollIndicator={false} vertical={true} numColumns={1}
                          data={mySavedPosts} renderItem={renderPost}
                          keyExtractor={(savedPost) => `${savedPost.id}`}

                />
            </SafeAreaView>
        );

    }
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    section: {
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    sectionTitle: {
        marginLeft: 10,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default SavedPostsScreen;
