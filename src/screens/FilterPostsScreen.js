import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
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
    TouchableHighlight, TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import PetDetails from '../widgets/PetDetails';
import MenuImage from "../widgets/MenuImage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {appPurpleDark, appPurpleLight} from "../utilities/constants";
import {Checkbox, Slider, StatusBar, Switch} from "native-base";
import {Picker} from "@react-native-picker/picker";

const FilterPostsScreen = () => {
    const navigation = useNavigation();
    const [age, setAge] = useState(18);

    const handleAgeChange = (ageValue) => {
        setAge(ageValue);
    };
    const handleClose=()=>{
        navigation.goBack();
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTintColor: appPurpleDark,
            headerStyle: {
                backgroundColor: 'white', // Change the header background color
            },
           headerLeft: ()=> <View/>,

            headerRight: () => {
                return (
                    <TouchableOpacity>
                        <FontAwesome onPress={handleClose} name={"times"} style={{fontSize:20}}></FontAwesome>
                    </TouchableOpacity>

                )
            },
        });
    }, []);
    return (
        <View style={styles.root}>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
            <Text>Age:</Text>
            <View >
                <View style={{flexDirection:"row"}}>
                <Checkbox/>
                <Text>  younger than 1</Text>
                </View>
                <View style={{flexDirection:"row"}}>
                    <Checkbox/>
                    <Text>  2-4</Text>
                </View>
                <View style={{flexDirection:"row"}}>
                    <Checkbox/>
                    <Text>  5-8</Text>
                </View>
                <View style={{flexDirection:"row"}}>
                    <Checkbox/>
                    <Text>  older than 8</Text>
                </View>

                <Text>Color:</Text>
                <View >
                    <View style={{flexDirection:"row"}}>
                        <Checkbox/>
                        <Text> White </Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Checkbox/>
                        <Text>Black</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Checkbox/>
                        <Text>Grey</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Checkbox/>
                        <Text>Orange</Text>
                    </View>
                    </View>
            </View>



        </View>
    );
};
const styles = StyleSheet.create({
    root: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor:appPurpleLight,
    },

});


export default FilterPostsScreen;