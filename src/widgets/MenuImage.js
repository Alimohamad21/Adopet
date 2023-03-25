import React from "react";
import {TouchableOpacity, Image, StyleSheet} from "react-native";
import PropTypes from "prop-types";


const MenuImage =(props) => {
    return (
        <TouchableOpacity style={styles.headerButtonContainer} onPress={props.onPress}>
            <Image style={styles.headerButtonImage} source={require("../assets/menu.png")} />
        </TouchableOpacity>
    );

};
const styles =  StyleSheet.create({
    headerButtonContainer: {
        padding: 10
    },
    headerButtonImage: {
        justifyContent: 'center',
        width: 25,
        height: 25,
        margin: 6
    }
});

export default MenuImage;

MenuImage.propTypes = {
    onPress: PropTypes.func,
};
