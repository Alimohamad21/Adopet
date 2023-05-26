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

import {FlatList, KeyboardAvoidingView, StatusBar} from 'native-base';
import {
    AdoptionScreenRoute,
    appPurpleDark,
    appPurpleLight,
    FilterPostsScreenRoute, LostAndFoundScreenRoute,
    postGrey,
    services,
    ViewPetScreenRoute
} from '../utilities/constants';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import PostServices from '../services/PostServices';
import PostCard from '../widgets/PostCard';
import NoDataAvailable from '../widgets/NoDataAvailable';
import {useNavigation} from "@react-navigation/native";


const LostAndFoundScreen = ({route}) => {
    const { isFiltered, filters } = route.params;
    const [searchPhrase, setSearchPhrase] = useState('');
    const [clicked, setClicked] = useState(false);
    const [lostPosts, setLostPosts] = useState(null);
    const [foundPosts,setFoundPosts] = useState(null);
    const [prevLastDocument, setPrevLastDocument] = useState();
    const [isAllPostsLoaded, setIsAllPostsLoaded] = useState(false);
    const [isPaginating, setIsPaginating] = useState(false);
    const navigation = useNavigation();
    const lostPostType = "Lost"
const foundPostType = "Found"
    const renderPost = ({item}) => {
        return (
            <PostCard post={item} isPoster={false}/>
        );
    };


    // const onEndReached = async () => {
    //     console.log("all posts loaded:",isAllPostsLoaded)
    //     if (!lostPosts.length || isAllPostsLoaded) {
    //         // don't load more data if scrolling up or if no data has been loaded yet
    //         return;
    //     }
    //
    //     setIsPaginating(true);
    //
    //     if (isFiltered){
    //         const {newPosts, lastDocument} = await PostServices.getPostsFilteredPaginated(filters,prevLastDocument,postType);
    //         setAdoptionPosts([...adoptionPosts, ...newPosts]);
    //         setIsPaginating(false);
    //         setPrevLastDocument(lastDocument);
    //         if(newPosts<5)
    //             setIsAllPostsLoaded(true);
    //     }
    //     else{
    //         const {newPosts, lastDocument} = await PostServices.getPostsPaginated(prevLastDocument,postType);
    //         setAdoptionPosts([...adoptionPosts, ...newPosts]);
    //         setIsPaginating(false);
    //         setPrevLastDocument(lastDocument);
    //         if(newPosts<5)
    //             setIsAllPostsLoaded(true);
    //     }
    //
    // };


    useEffect(() => {
        console.log(isFiltered,filters)
        const getPosts = async () => {
            const {newPosts, lastDocument} = await PostServices.getPostsInitial(lostPostType);

            setLostPosts(newPosts);
            setPrevLastDocument(lastDocument);
        };
        const getPostsFiltered = async () => {
            const {newPosts, lastDocument} = await PostServices.getPostsFiltered(filters,lostPostType);
            setLostPosts(newPosts);
            setPrevLastDocument(lastDocument);
            setIsAllPostsLoaded(false)
        };
        isFiltered ? getPostsFiltered() : getPosts()


    }, [route]);
    const handleFilterPress=()=>{
        navigation.navigate(FilterPostsScreenRoute,{"filters": filters,"prevScreenRoute":LostAndFoundScreenRoute} );
    }
    if (!lostPosts) {
        return <ScreenLoadingIndicator/>;

    } else if (lostPosts.length === 0) {
        return (

            <View style={{flex:1}}>
                <NoDataAvailable text="No posts available"/>
                <TouchableOpacity onPress={handleFilterPress} style={{flexDirection: 'row',
                    marginTop: '3%', marginRight: '3%', marginBottom: '5%',
                    justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', bottom: 0, right: 0, zIndex: 999,
                    backgroundColor:appPurpleDark,
                    width:"13%",
                    borderRadius:7
                }}>
                    <Text style={{ fontSize: 15, color:"white",fontWeight:"bold" }}>Filters</Text>
                    <FontAwesome name={'filter'} style={{ marginLeft: '5%',fontWeight:"bold", fontSize: 15,color:"white"}}></FontAwesome>
                </TouchableOpacity>
            </View>

        )
    } else {
        return (
            <SafeAreaView style={styles.root}>

                <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />

                <TouchableOpacity onPress={handleFilterPress} style={{ flexDirection: 'row',
                    marginTop: '3%', marginRight: '3%', marginBottom: '5%',
                    justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', bottom: 0, right: 0, zIndex: 999,
                    backgroundColor:appPurpleDark,
                    width:"13%",
                    borderRadius:7
                }}>
                    <Text style={{ fontSize: 15, color:"white",fontWeight:"bold" }}>Filters</Text>
                    <FontAwesome name={'filter'} style={{ marginLeft: '5%',fontWeight:"bold", fontSize: 15,color:"white" }}></FontAwesome>
                </TouchableOpacity>

                <FlatList showsVerticalScrollIndicator={false} vertical={true} numColumns={1}
                          data={lostPosts} renderItem={renderPost}
                          keyExtractor={(adoptionPost) => `${adoptionPost.id}`}
                          // onEndReached={onEndReached}
                          extraData={route}
                />
                { isPaginating && <View style={styles.paginationIndicator}><ScreenLoadingIndicator/></View> }
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


export default LostAndFoundScreen;
