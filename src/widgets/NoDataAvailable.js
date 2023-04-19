import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';

function NoPostsAvailable({text}) {
    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <Text style={styles.text}>{text}</Text>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default NoPostsAvailable;
