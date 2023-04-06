import React, {Component, useLayoutEffect, useState} from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView} from "react-native";
import MenuImage from "../widgets/MenuImage";

import SearchBar from "../widgets/SearchBar";
import {red} from "react-native-reanimated/src";
import {KeyboardAvoidingView} from "native-base";


const AdoptionScreen = ({navigation}) => {
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);
    const [fakeData, setFakeData] = useState();
    return(

        <SafeAreaView style={styles.root}>
        <View style={styles.searchBarContainer}>

            <SearchBar
                searchPhrase={searchPhrase}
                setSearchPhrase={setSearchPhrase}
                clicked={clicked}
                setClicked={setClicked}
            />
            </View>
            <ScrollView>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>

            </ScrollView>


        </SafeAreaView>


    );
};
const styles = StyleSheet.create({
    root: {
    flex:1,
        position:"absolute",
        justifyContent:"center",
        alignItems:"center"
    },
    searchBarContainer:{
        marginTop:"1%",
        height:42
    }
});

export default AdoptionScreen;
