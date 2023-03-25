import React, {useContext, useLayoutEffect} from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity, Image, TouchableHighlight,Dimensions} from 'react-native';
import {capitalizeWords} from '../utilities/stringUtilities';
import AuthServices from '../services/AuthServices';

import {LoginScreenRoute, services, UploadImageScreenRoute} from '../utilities/constants';
import {FlatList, NativeBaseProvider} from "native-base";
import MenuImage from "../widgets/MenuImage";
import {CurrentUserProvider, CurrentUserContext} from '../providers/CurrentUserProvider';
// screen sizing

const HomeScreen = ({navigation}) => {

    //const {user} = route.params;
    const { currentUser,setCurrentUser } = useContext(CurrentUserContext);
    console.log(currentUser.fullName);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <MenuImage
                    onPress={() => {
                        navigation.openDrawer();
                    }}
                />
            ),
            headerRight: () => <View />,
        });
    }, []);

    const onPressService = (item) => {
        // navigation.navigate("Recipe", { item });
    };

    const renderServices = ({ item }) => (
        <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressService(item)}>
            <View style={styles.container}>
                <Image style={styles.photo} source={ require('../assets/cat.jpg') } />
                <Text style={styles.title}>{item.name}</Text>
            </View>
        </TouchableHighlight>
    );

    return (

        <View >


            <FlatList vertical showsVerticalScrollIndicator={false} numColumns={2}
                      data={services} renderItem={renderServices} keyExtractor={(item) => `${item.serviceId}`} />


        </View>

    );
};
const { width, height } = Dimensions.get('window');
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;

const recipeNumColums = 2;
// item size
const RECIPE_ITEM_HEIGHT = 150;
const RECIPE_ITEM_MARGIN = 20;
const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: RECIPE_ITEM_MARGIN,
        marginTop: 20,
        width: (SCREEN_WIDTH - (recipeNumColums + 1) * RECIPE_ITEM_MARGIN) / recipeNumColums,
        height: RECIPE_ITEM_HEIGHT + 75,
        borderColor: '#cccccc',
        borderWidth: 0.5,
        borderRadius: 15
    },
    photo: {
        width: (SCREEN_WIDTH - (recipeNumColums + 1) * RECIPE_ITEM_MARGIN) / recipeNumColums,
        height: RECIPE_ITEM_HEIGHT,
        borderRadius: 15,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    title: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#444444',
        marginTop: 3,
        marginRight: 5,
        marginLeft: 5,
    },
    category: {
        marginTop: 5,
        marginBottom: 5
    }
});


export default HomeScreen;
