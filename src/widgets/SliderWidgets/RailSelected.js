import React, { memo } from 'react';
import {StyleSheet, View} from 'react-native';
import {appPurpleDark} from "../../utilities/constants";

const RailSelected = () => {
    return (
        <View style={styles.root}/>
    );
};

export default memo(RailSelected);

const styles = StyleSheet.create({
    root: {
        height: 4,
        backgroundColor: appPurpleDark,
        borderRadius: 2,

    },
});