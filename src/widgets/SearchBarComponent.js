

import React, {useState} from "react";
import { Searchbar } from 'react-native-paper';
import {StyleSheet, View} from "react-native";


const SearchBarComponent =()=>{
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
        // Implement search logic here
    };

    return (
        <View style={styles.container}>
            <Searchbar style={styles.search}
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onIconPress={() => handleSearch(searchQuery)}
            onSubmitEditing={() => handleSearch(searchQuery)}
            />
            {/* Add search results component here */}
        </View>
        );
 };

const styles = StyleSheet.create({

    container:{
        width:"60%",
        height:"100%"
    },
    search:{
        marginTop:"5%",
        marginBottom:"5%",
        width:"100%",
        height:"60%",

        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
    }
}
);
export  default  SearchBarComponent;
