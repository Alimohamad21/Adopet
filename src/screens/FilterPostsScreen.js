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
    TouchableHighlight, TextInput, Button,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import PetDetails from '../widgets/PetDetails';
import MenuImage from "../widgets/MenuImage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {appPurpleDark, appPurpleLight} from "../utilities/constants";
import {Checkbox, Slider, StatusBar, Switch} from "native-base";
import {Picker} from "@react-native-picker/picker";
import RangeSlider from 'react-native-range-slider';
import PostServices from "../services/PostServices";


const FilterPostsScreen = () => {
    const navigation = useNavigation();
    const [minAge, setMinAge] = useState("");
    const [maxAge,setMaxAge] = useState("");
    const handleMinAgeChange = (text) => {
        setMinAge(text);
    };
    const handleMaxAgeChange = (text) => {
        setMaxAge(text);
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
    const handleApplyFilter = async  ()=>{
          await PostServices.getAdoptionPostsFiltered(minAge,maxAge,selectedColors);
    }
    const [checkedList, setCheckedList] = useState([
        { label: "White", checked: false },
        { label: "Black", checked: false },
        { label: "Gray", checked: false },
        { label: "Brown", checked: false },
    ]);
    const [selectedColors, setSelectedColors] = useState([]);
    useEffect(() => {
        setSelectedColors(checkedList.filter((item) => item.checked).map((item) => item.label));
        console.log(selectedColors)
    }, [checkedList]);

    const handleCheckboxChange = (index) => {
        console.log("handleboxchange")
        const newList = [...checkedList];
        newList[index].checked = !newList[index].checked;
        setCheckedList(newList);
    };
    return (
        <View style={styles.root}>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
            <Text>Age:</Text>

            <TextInput   value={minAge} placeholder={"Min"}  onChangeText={handleMinAgeChange} style={{backgroundColor:"white",width:"10%"}}></TextInput>
            <TextInput value={maxAge} placeholder={"Max"}  onChangeText={handleMaxAgeChange} style={{marginTop:"2%",backgroundColor:"white",width:"10%"}} ></TextInput>

            <View>
                <Text>Color:</Text>
                <View>
                    {checkedList.map((item, index) => (
                        <View key={index} style={{ flexDirection: "row" }}>
                            <Checkbox
                                accessibilityLabel="Select this option"
                                value={item.checked}
                                // onValueChange={() => handleCheckboxChange(index)}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <Text> {item.label} </Text>
                        </View>
                    ))}
                </View>
                <Text>Selected colors: {selectedColors.join(", ")}</Text>
            </View>
                {/*<Text>Breed:</Text>*/}
            <Button  onPress={handleApplyFilter} title={"Apply Filter"} ></Button>






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
