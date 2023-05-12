import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {borderGrey, egyptianCities} from "../utilities/constants";




function DropdownComponent({placeholder,onSelect,data}){
    const [value, setValue] = useState(null);



    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value === value}
            </View>
        );
    };

    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}

            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            searchPlaceholder="Search..."
            value={value}
            onChange={item => {

                onSelect(item)

            }}
            // renderLeftIcon={() => (
            //     //<AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            // )}
            renderItem={renderItem}
        />
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    dropdown: {
        margin: "3%",
        fontFamily: 'sans-serif-medium',
        minWidth:"85%",
        height: 40,

        borderRadius: 0,
        padding: 12,
        borderColor:borderGrey,
        borderStyle:"solid",
        borderWidth:1,

    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        fontFamily: 'sans-serif-medium',
        flex: 1,
        fontSize: 14,
    },
    placeholderStyle: {
        fontFamily: 'sans-serif-medium',
        color:"grey",
        fontSize: 14,
    },
    selectedTextStyle: {
        fontFamily: 'sans-serif-medium',
        fontSize: 14,
    },
    iconStyle: {

        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        fontFamily: 'sans-serif-medium',
        height: 40,
        fontSize: 16,
    },
});
