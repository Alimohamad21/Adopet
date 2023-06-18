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
import SlideButton from "../widgets/SlideButton";


const LostAndFoundScreen = ({route}) => {
    const { isFiltered, filters } = route.params;
    const [view,setView] = useState(1)
    const [searchPhrase, setSearchPhrase] = useState('');
    const [clicked, setClicked] = useState(false);
    const [lostPosts, setLostPosts] = useState(null);
    const [foundPosts,setFoundPosts] = useState(null);
    const [prevLastLostDocument, setPrevLastLostDocument] = useState();
    const [prevLastFoundDocument, setPrevLastFoundDocument] = useState();
    const [isAllPostsLoaded, setIsAllPostsLoaded] = useState(false);
    const [isPaginating, setIsPaginating] = useState(false);
    const navigation = useNavigation();
    const lostPostType = "Lost"
    const foundPostType = "Found"
    const handleLostSelect =() =>{
        console.log("Lost")
        setView(1)
    }
    const handleFoundSelect =() =>{
        setView(2)
        console.log("Found")
    }
    const renderPost = ({item}) => {
        return (
            <PostCard post={item} isPoster={false}/>
        );
    };


    const onLostEndReached = async () => {
        console.log("all posts loaded:",isAllPostsLoaded)
        if (!lostPosts.length || isAllPostsLoaded) {
            // don't load more data if scrolling up or if no data has been loaded yet
            return;
        }

        setIsPaginating(true);

        if (isFiltered){
            const {newPosts, lastDocument} = await PostServices.getPostsFilteredPaginated(filters,prevLastLostDocument,lostPostType);
            setLostPosts([...lostPosts, ...newPosts]);
            setIsPaginating(false);
            setPrevLastLostDocument(lastDocument);
            if(newPosts<5)
                setIsAllPostsLoaded(true);
        }
        else{
            const {newPosts, lastDocument} = await PostServices.getPostsPaginated(prevLastLostDocument,lostPostType);
            setLostPosts([...lostPosts, ...newPosts]);
            setIsPaginating(false);
            setPrevLastLostDocument(lastDocument);
            if(newPosts<5)
                setIsAllPostsLoaded(true);
        }

    };
    const onFoundEndReached = async () => {
        console.log("all posts loaded:",isAllPostsLoaded)
        if (!lostPosts.length || isAllPostsLoaded) {
            // don't load more data if scrolling up or if no data has been loaded yet
            return;
        }

        setIsPaginating(true);

        if (isFiltered){
            const {newPosts, lastDocument} = await PostServices.getPostsFilteredPaginated(filters,prevLastFoundDocument,foundPostType);
            setFoundPosts([...lostPosts, ...newPosts]);
            setIsPaginating(false);
            setPrevLastFoundDocument(lastDocument);
            if(newPosts<5)
                setIsAllPostsLoaded(true);
        }
        else{
            const {newPosts, lastDocument} = await PostServices.getPostsPaginated(prevLastFoundDocument,foundPostType);
            setFoundPosts([...foundPosts, ...newPosts]);
            setIsPaginating(false);
            setPrevLastFoundDocument(lastDocument);
            if(newPosts<5)
                setIsAllPostsLoaded(true);
        }

    };


    useEffect(() => {
        console.log(isFiltered,filters)
        const getLostPosts = async () => {
            const {newPosts, lastDocument} = await PostServices.getPostsInitial(lostPostType);

            setLostPosts(newPosts);
            setPrevLastLostDocument(lastDocument);
            // console.log(view)
            //  console.log(newPosts)
        };
        const getFoundPosts = async () => {
            const {newPosts, lastDocument} = await PostServices.getPostsInitial(foundPostType);

            setFoundPosts(newPosts);
            setPrevLastFoundDocument(lastDocument);
            console.log(view)
            console.log(newPosts)
        };
        const getLostPostsFiltered = async () => {
            const {newPosts, lastDocument} = await PostServices.getPostsFiltered(filters,lostPostType);
            console.log(newPosts)
            setLostPosts(newPosts);
            setPrevLastLostDocument(lastDocument);
            setIsAllPostsLoaded(false)
        };
        const getFoundPostsFiltered = async () => {
            const {newPosts, lastDocument} = await PostServices.getPostsFiltered(filters,foundPostType);
            console.log(newPosts)
            setFoundPosts(newPosts);
            setPrevLastFoundDocument(lastDocument);
            setIsAllPostsLoaded(false)
        };

        isFiltered ? (getLostPostsFiltered(),getFoundPostsFiltered()) : (getLostPosts() , getFoundPosts())


    }, [route]);
    const handleFilterPress=()=>{
        navigation.navigate(FilterPostsScreenRoute,{"filters": filters,"prevScreenRoute":LostAndFoundScreenRoute} );
    }
    if (!lostPosts) {
        return <ScreenLoadingIndicator/>;

    } else if (lostPosts.length === 0) {
        return (

            <View style={{flex:1}}>
                <View style={{flex: 0.5}}>
                    <SlideButton onPostsPress={handleLostSelect} onPetsPress={handleFoundSelect} ></SlideButton>
                </View>
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
                {/*<View style={{backgroundColor:"red"}}>*/}
                {/*    <SlideButton onPostsPress={handleLostSelect} onPetsPress={handleFoundSelect} ></SlideButton>*/}
                {/*</View>*/}

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

                    <SlideButton onFirstPress={handleLostSelect} onSecondPress={handleFoundSelect} firstText={"Lost"} secondText={"Found"} ></SlideButton>


                {view ===1 &&

                        <FlatList showsVerticalScrollIndicator={false} vertical={true} numColumns={1}
                                  data={lostPosts} renderItem={renderPost}
                                  keyExtractor={(lostPost) => `${lostPost.id}`}
                             onEndReached={onLostEndReached}
                                refreshing={isPaginating}
                                  extraData={route}
                                  removeClippedSubviews={true}
                        />



                }
                {view === 2 &&

                        <FlatList showsVerticalScrollIndicator={false} vertical={true} numColumns={1}
                                  data={foundPosts} renderItem={renderPost}
                                  keyExtractor={(foundPost) => `${foundPost.id}`}
                             onEndReached={onFoundEndReached}
                                  extraData={route}
                        />



                }

                { isPaginating && <View style={styles.paginationIndicator}><ScreenLoadingIndicator/>
                </View> }
            </SafeAreaView>
        );
    }
};
const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"white"
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
