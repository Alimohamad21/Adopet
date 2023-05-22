import React, {memo} from 'react';
import {View, StyleSheet,Text} from 'react-native';

const THUMB_RADIUS_LOW = 12;
const THUMB_RADIUS_HIGH = 16;

const Thumb = ({name,min,max}) => {
    console.log(name)
    return (
        <View style={{paddingTop:20}}>
            <View style={name === 'high' ? styles.rootHigh : styles.rootLow} />
            {
                name === 'high' &&
                <Text style={{textAlign:"center",fontWeight:"bold",fontSize:17,color:"black"}}>{max}</Text>

            }
            {
                name === 'low' &&
                <Text style={{textAlign:"center",fontWeight:"bold",fontSize:17,color:"black"}}>{min}</Text>
            }
        </View>

    );
};

const styles = StyleSheet.create({
    rootLow: {
        width: THUMB_RADIUS_LOW * 2,
        height: THUMB_RADIUS_LOW * 2,
        borderRadius: THUMB_RADIUS_LOW,
        borderWidth: 2,
        borderColor: '#7f7f7f',
        backgroundColor: '#aaaaaa',

    },
    rootHigh: {
        width: THUMB_RADIUS_LOW * 2,
        height: THUMB_RADIUS_LOW * 2,
        borderRadius: THUMB_RADIUS_LOW,
        borderWidth: 2,
        borderColor: '#7f7f7f',
        backgroundColor: '#aaaaaa',

    },
});

export default memo(Thumb);