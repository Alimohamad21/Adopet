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
import MenuImage from '../widgets/MenuImage';

import SearchBar from '../widgets/SearchBar';
import {red} from 'react-native-reanimated/src';
import {FlatList, KeyboardAvoidingView} from 'native-base';
import {appPurpleDark, postGrey, services} from '../utilities/constants';
import {blueGrey100, blueGrey300, blueGrey50} from 'react-native-paper/src/styles/themes/v2/colors';
import {CurrentUserContext} from '../providers/CurrentUserProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import PostServices from '../services/PostServices';
import AdoptionPostCard from '../widgets/AdoptionPostCard';


const AdoptionScreen = ({navigation}) => {
    const [searchPhrase, setSearchPhrase] = useState('');
    const [clicked, setClicked] = useState(false);
    const [adoptionPosts, setAdoptionPosts] = useState(null);


    const renderPost = ({item}) =>{
        return  (
            <AdoptionPostCard adoptionPost={item}/>
        );
    }

    function NoPostsAvailable() {
        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.container}>
                    <Text style={styles.text}>No posts available</Text>
                </View>
            </SafeAreaView>
        );
    }



    useEffect(() => {
        const getPosts = async () => {
            const posts = await PostServices.getAdoptionPosts();
            setAdoptionPosts(posts);
        };
        getPosts();
    }, []);

    if (!adoptionPosts) {
        return <ScreenLoadingIndicator/>;
    } else if (adoptionPosts.length === 0) {
        return <NoPostsAvailable/>;
    } else {
        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.searchBarContainer}>

                    <SearchBar
                        searchPhrase={searchPhrase}
                        setSearchPhrase={setSearchPhrase}
                        clicked={clicked}
                        setClicked={setClicked}
                    />
                </View>

               <FlatList showsVerticalScrollIndicator={false} vertical={true} numColumns={1}
                          data={adoptionPosts} renderItem={renderPost} keyExtractor={(adoptionPost) => `${adoptionPost.id}`}/>
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
    searchBarContainer: {
        marginTop: '1%',
        height: 42,
    },
});


export default AdoptionScreen;
