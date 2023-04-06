import React from "react";
import {StyleSheet, TextInput, View, Keyboard, Button, TouchableOpacity, Text} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {appPurpleDark} from "../utilities/constants";


const SearchBar = ({clicked, searchPhrase, setSearchPhrase, setClicked}) => {

    return (
        <View style={styles.container}>

            <View
                style={
                    clicked
                        ? styles.searchBar__clicked
                        : styles.searchBar__unclicked
                }
            >
                {/* search Icon */}
                <Feather
                    name="search"
                    size={18}
                    color="black"

                />
                {/* Input field */}
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    value={searchPhrase}
                    onChangeText={setSearchPhrase}
                    onFocus={() => {
                        setClicked(true);
                    }}
                />
                {/* cross Icon, depending on whether the search bar is clicked or not */}
                {clicked && searchPhrase ? (
                    <Entypo name="cross" size={15} color="black" onPress={() => {
                        setSearchPhrase("")
                    }}/>
                ):null}
            </View>
            {/* cancel button, depending on whether the search bar is clicked or not */}
            {clicked && (
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss();
                            setClicked(false);
                        }}>
                        <Text style={styles.forgotPassText}>cancel</Text>
                    </TouchableOpacity>
                    {/*<Button*/}
                    {/*    title="Cancel"*/}
                    {/*    onPress={() => {*/}
                    {/*        Keyboard.dismiss();*/}
                    {/*        setClicked(false);*/}
                    {/*    }}*/}
                    {/*></Button>*/}
                </View>
            )}
        </View>
    );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
    container: {

        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        height:"100%"

    },

    searchBar__unclicked: {

        paddingLeft:"5%",
        paddingRight:"5%",
        flexDirection: "row",
        width: "97%",
        height:"85%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",

    },
    searchBar__clicked: {
        paddingLeft:"5%",
        paddingRight:"5%",
        flexDirection: "row",
        width: "80%",
        height:"85%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",

    },
    input: {
        paddingTop:"10%",
        fontSize: 15,
        marginLeft:"5%",

        width: "85%",
    },
    forgotPassText: {
        marginTop: 7,
        fontFamily: 'sans-serif-medium',
        color: appPurpleDark,
    },
});