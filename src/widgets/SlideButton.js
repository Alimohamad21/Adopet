import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native'

const SlideButton = ({onPostsPress,onPetsPress}) => {
    const [active, setActive] = useState(false)
    let transformX = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (active) {
            Animated.timing(transformX, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start()
        } else {
            Animated.timing(transformX, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start()
        }
    }, [active]);

    const rotationX = transformX.interpolate({
        inputRange: [0, 1],
        outputRange: [2, Dimensions.get('screen').width / 2.5]
    })


    return (
        <SafeAreaView style={{
            flex: 1,
            alignItems: 'center'
        }}>
            <View style={{
                flexDirection: 'row',
                position: 'relative',
                height: 50,
                width:"80%",
                borderRadius: 22,
                backgroundColor: '#efebf0',

            }}>
                <Animated.View
                    style={{
                        position: 'absolute',
                        height: 50 - 2*2,
                        top: 2,
                        bottom: 2,
                        borderRadius: 22,
                        width: "50%",
                        transform: [
                            {
                                translateX: rotationX
                            }
                        ],
                        backgroundColor: 'white',
                    }}
                >
                </Animated.View>
                <TouchableOpacity style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} onPress={() => {
                    onPostsPress();
                    setActive(false)

                }

                }>
                    <Text>
                        Posts
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',

                }} onPress={() => {
                    onPetsPress();
                    setActive(true)
                }
                }>
                    <Text>
                        Pets
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export default SlideButton