import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Slider from 'react-native-slider';

const TwoSlider = () => {
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(100);

    return (
        <View>
            <Text>Min Value: {minValue}</Text>
            <Slider
                value={minValue}
                onValueChange={(value) => setMinValue(value)}
                minimumValue={0}
                maximumValue={maxValue}
            />
            <Text>Max Value: {maxValue}</Text>
            <Slider
                value={maxValue}
                onValueChange={(value) => setMaxValue(value)}
                minimumValue={minValue}
                maximumValue={100}
            />
        </View>
    );
};

export default TwoSlider;
