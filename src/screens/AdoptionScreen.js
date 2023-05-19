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
import {FlatList, KeyboardAvoidingView, StatusBar} from 'native-base';
import {appPurpleDark, FilterPostsScreenRoute, postGrey, services, ViewPetScreenRoute} from '../utilities/constants';
import {blueGrey100, blueGrey300, blueGrey50} from 'react-native-paper/src/styles/themes/v2/colors';
import {CurrentUserContext} from '../providers/CurrentUserProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import PostServices from '../services/PostServices';
import AdoptionPostCard from '../widgets/AdoptionPostCard';
import NoDataAvailable from '../widgets/NoDataAvailable';
import {useNavigation} from "@react-navigation/native";


const AdoptionScreen = () => {
    const [searchPhrase, setSearchPhrase] = useState('');
    const [clicked, setClicked] = useState(false);
    const [adoptionPosts, setAdoptionPosts] = useState(null);
    const [prevLastDocument, setPrevLastDocument] = useState();
    const [isAllPostsLoaded, setIsAllPostsLoaded] = useState(false);
    const [isPaginating, setIsPaginating] = useState(false);
    const navigation = useNavigation();

    const renderPost = ({item}) => {
        return (
            <AdoptionPostCard adoptionPost={item} isPoster={false}/>
        );
    };

    const onEndReached = async () => {
        if (!adoptionPosts.length || isAllPostsLoaded) {
            // don't load more data if scrolling up or if no data has been loaded yet
            return;
        }
        setIsPaginating(true);
        const {newPosts, lastDocument} = await PostServices.getAdoptionPostsPaginated(prevLastDocument);
        setAdoptionPosts([...adoptionPosts, ...newPosts]);
        setIsPaginating(false);
        setPrevLastDocument(lastDocument);
        if(newPosts<5)
            setIsAllPostsLoaded(true);
    };


    useEffect(() => {
        const getPosts = async () => {
            const {newPosts, lastDocument} = await PostServices.getAdoptionPostsInitial();
            setAdoptionPosts(newPosts);
            setPrevLastDocument(lastDocument);
        };
        getPosts();
    }, []);
    const handleFilterPress=()=>{
        navigation.navigate(FilterPostsScreenRoute);
    }

    if (!adoptionPosts) {
        return <ScreenLoadingIndicator/>;
    } else if (adoptionPosts.length === 0) {
        return <NoDataAvailable text="No posts available"/>;
    } else {
        return (
            <SafeAreaView style={styles.root}>
                {/*<View style={styles.searchBarContainer}>*/}

                {/*    <SearchBar*/}
                {/*        searchPhrase={searchPhrase}*/}
                {/*        setSearchPhrase={setSearchPhrase}*/}
                {/*        clicked={clicked}*/}
                {/*        setClicked={setClicked}*/}

                {/*    />*/}
                {/*</View>*/}
                <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
                <TouchableOpacity onPress={handleFilterPress} style={{flexDirection:"row",justifyContent: 'flex-end',alignItems:"center",marginLeft:"75%"}}>
                    <Text>Filter</Text>
                    <FontAwesome name={"chevron-down"} style={{marginLeft:"5%"}} ></FontAwesome>
                </TouchableOpacity>
                <FlatList showsVerticalScrollIndicator={false} vertical={true} numColumns={1}
                          data={adoptionPosts} renderItem={renderPost}
                          keyExtractor={(adoptionPost) => `${adoptionPost.id}`}
                          onEndReached={onEndReached}
                />
               {isPaginating && <View style={styles.paginationIndicator}><ScreenLoadingIndicator/></View>}
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
    paginationIndicator: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom:'10%'
    },
    searchBarContainer: {
        marginTop: '1%',
        height: 42,
    },
});


export default AdoptionScreen;
