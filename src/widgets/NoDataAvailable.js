import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';

function NoPostsAvailable({text}) {
    return (
        <View style={styles.root}>
            <View style={styles.container}>
                <Text style={styles.text}>{text}</Text>
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    root: {
        // flex: 1,
        marginTop:"50%",
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default NoPostsAvailable;
