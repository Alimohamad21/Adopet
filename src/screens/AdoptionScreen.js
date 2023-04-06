import React, {Component, useLayoutEffect} from 'react';
import {StyleSheet, View,Text} from "react-native";
import MenuImage from "../widgets/MenuImage";
import SearchBarComponent from "../widgets/SearchBarComponent";


const AdoptionScreen = ({navigation}) => {
    useLayoutEffect(() => {
        navigation.setOptions({


            headerRight: () => (
               <SearchBarComponent/>
            )

        });
    }, []);

    return(
        <View>
            <SearchBarComponent/>
        </View>

    );
};
const styles = StyleSheet.create({

});

export default AdoptionScreen;
