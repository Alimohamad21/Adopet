import React from "react";
import {TouchableOpacity, Image, StyleSheet} from "react-native";
import PropTypes from "prop-types";
import FontAwesome from "react-native-vector-icons/FontAwesome";


const MenuImage =(props) => {
    return (
        <TouchableOpacity style={styles.headerButtonContainer} onPress={props.onPress}>
            {/*<Image style={styles.headerButtonImage} source={require("../assets/menu.png")} />*/}
            <FontAwesome name="bars" style={styles.btnIcon}/>
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
    },
    btnIcon:{
        marginLeft:"5%",
        marginTop: "5%",
        fontSize:23,
        color:"white"
    }
});

export default MenuImage;

MenuImage.propTypes = {
    onPress: PropTypes.func,
};
