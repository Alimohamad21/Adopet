import React, {useContext, useLayoutEffect} from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity, Image, TouchableHighlight, Dimensions} from 'react-native';
import {capitalizeWords} from '../utilities/stringUtilities';
import AuthServices from '../services/AuthServices';

import {
    AdoptionScreenRoute,
    appPurpleDark,
    LoginScreenRoute,
    services,
    UploadImageScreenRoute
} from '../utilities/constants';
import {FlatList, NativeBaseProvider, StatusBar} from 'native-base';
import MenuImage from '../widgets/MenuImage';
import NotificationServices from '../services/NotificationServices';


const HomeScreen = ({navigation}) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <MenuImage
                    onPress={() => {
                        navigation.openDrawer();
                    }}
                />
            ),
            headerRight: () => <View/>,
        });
    }, []);

    const onPressService = (route) => {

        navigation.navigate(route);
    };

    const renderServices = ({item}) => (

        <TouchableHighlight  style={styles.serviceContainer} activeOpacity={0.6} underlayColor="transparent"
                            onPress={() => onPressService(item.name)}>
            <View style={styles.container}>
                <Image style={styles.photo} source={item.imageUri}/>
                <Text style={styles.title}>{item.name}</Text>
            </View>
        </TouchableHighlight>

    );

    return (

        <View>
            {/*<StatusBar backgroundColor={appPurpleDark} barStyle="light-content"/>*/}
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />

            <FlatList vertical showsVerticalScrollIndicator={false} numColumns={2}
                      data={services} renderItem={renderServices} keyExtractor={(item) => `${item.serviceId}`}/>


        </View>

    );
};
const {width, height} = Dimensions.get('window');
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;

const ServiceNumColums = 2;
// item size
const SERVICE_ITEM_HEIGHT = 150;
const SERVICE_ITEM_MARGIN = 15;
const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: SERVICE_ITEM_MARGIN,
        marginTop: 20,
        width: (SCREEN_WIDTH - (ServiceNumColums + 1) * SERVICE_ITEM_MARGIN) / ServiceNumColums,
        height: SERVICE_ITEM_HEIGHT + 50,
        borderColor: '#cccccc',
        borderWidth: 0.5,
        borderRadius: 15,
    },
    photo: {
        width: (SCREEN_WIDTH - (ServiceNumColums + 1) * SERVICE_ITEM_MARGIN) / ServiceNumColums,
        height: SERVICE_ITEM_HEIGHT,
        borderRadius: 12,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    title: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#444444',
        marginTop: 10,
        marginRight: 5,
        marginLeft: 5,
    },
    category: {},
    serviceContainer: {


        borderRadius: 15,

    },
});


export default HomeScreen;
