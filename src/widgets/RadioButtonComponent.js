import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {appPurpleDark} from "../utilities/constants";

const RadioButton = ({ options, selectedOption, onSelect }) => {
    return (
        <View style={{flexDirection: 'row', marginLeft: -210, width: 100,
            margin: '3%',}}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    onPress={() => onSelect(option)}
                    style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10}}
                >
                    <View
                        style={{
                            height: 24,
                            width: 24,
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: option.value === selectedOption.value ? appPurpleDark : '#777',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {
                            option.value === selectedOption.value ? (
                                <View style={{
                                    height: 12,
                                    width: 12,
                                    borderRadius: 6,
                                    backgroundColor: appPurpleDark,
                                }} />
                            ) : null
                        }
                    </View>
                    <Text style={{ marginLeft: 8 }}>{option.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default RadioButton;
