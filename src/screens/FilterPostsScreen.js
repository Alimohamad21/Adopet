import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import React, {Component, useContext, useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    TouchableHighlight, TextInput, Button
} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';

import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
    AdoptionScreenRoute,
    appPurpleDark,
    appPurpleLight,
    egyptianCatBreeds,
    egyptianDogBreeds
} from "../utilities/constants";
import { Slider, StatusBar, Switch} from "native-base";
import { RadioButton } from 'react-native-paper';
import PostServices from "../services/PostServices";


const FilterPostsScreen = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTintColor: appPurpleDark,
            headerStyle: {
                backgroundColor: 'white', // Change the header background color
            },
            headerLeft: ()=> <View/>,
            headerRight: () => {
                return (
                    <TouchableOpacity>
                        <FontAwesome onPress={handleClose} name={"times"} style={{fontSize:20}}></FontAwesome>
                    </TouchableOpacity>
                )
            },
        });
    }, []);
    const handleClose=()=>{
        navigation.goBack();
    }

    const [viewPetTypeFilter,setViewPetTypeFilter] = useState(false);
    const [viewAgeFilter,setViewAgeFilter] = useState(false);
    const [viewColorFilter,setViewColorFilter] = useState(false);
    const [viewBreedFilter,setViewBreedFilter] = useState(false);
    const [viewNeuteredFiltered,setViewNeuteredFilter] = useState(false);

    //const [selectedPetTypes, setSelectedPetTypes] = useState([]);
    const [petType, setPetType] = useState(null);
    const [minAge, setMinAge] = useState("0");
    const [maxAge,setMaxAge] = useState("20");
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    const [isNeutered,setIsNeutered] = useState();

    // const [petTypeList, setPetTypeList] = useState([
    //     { label: "Dog", checked: false },
    //     { label: "Cat", checked: false },
    //  ])
    // const memoizedPetTypeList = useMemo(() => petTypeList, []);
    // const [colorsList, setColorsList] = useState([
    //     { label: "White", checked: false },
    //     { label: "Black", checked: false },
    //     { label: "Gray", checked: false },
    //     { label: "Brown", checked: false },
    // ]);
    const [breedsList, setBreedsList] = useState([...egyptianCatBreeds, ...egyptianDogBreeds]);
    // const [breedsList, setBreedsList] = useState([...egyptianCatBreeds, ...egyptianDogBreeds].map((breed) => ({
    //     label: breed,
    //     checked: false,
    // })));
    // const memoizedBreedsList = useMemo(() => breedsList, [breedsList]);


    const handleMinAgeChange = (text) => {
        setMinAge(text);
    };
    const handleMaxAgeChange = (text) => {
        setMaxAge(text);
    };



    const handleApplyFilter = async  ()=>{
        let ageRange = {
            "min": minAge,
            "max": maxAge,
        }

        let filters = {
            "ageRange": ageRange,
            "petType" : petType,
            "selectedBreeds" : selectedBreeds,
            "isNeutered" : isNeutered
        }
        navigation.navigate(AdoptionScreenRoute, { "isFiltered": true, "filters": filters })
        // await PostServices.getAdoptionPostsFiltered(petType,ageRange,selectedBreeds,isNeutered);
    }


    // useEffect(() => {
    //     setSelectedColors(colorsList.filter((item) => item.checked).map((item) => item.label));
    //
    // }, [colorsList]);

    // useEffect(() => {
    //     let breeds = []
    //     if(petTypeList[0].checked)
    //         breeds = breeds.concat(egyptianDogBreeds)
    //     if(petTypeList[1].checked)
    //         breeds = breeds.concat(egyptianCatBreeds)
    //
    //     setBreedsList(breeds);
    //
    // }, [petTypeList]);

    // const handleColorFilterChange = (index) => {
    //     const newList = [...colorsList];
    //     newList[index].checked = !newList[index].checked;
    //     setColorsList(newList);
    // };
    const handleBreedFilterChange = (index,value) =>{
        // const newList = [...breedsList];
        // newList[index].checked = !newList[index].checked;
        // setSelectedBreeds(newList.filter((item) => item.checked).map((item) => item.label))
        // setBreedsList(newList)
        // const updatedBreedsList = [...breedsList];
        // updatedBreedsList[index].checked = !updatedBreedsList[index].checked;
        let updatedBreedsList = breedsList
        updatedBreedsList[index].checked = value
        setBreedsList(updatedBreedsList);
        console.log(updatedBreedsList)
    }

    // const handlePetTypeChange = (index)=>{
    //     const newList = [...petTypeList];
    //     newList[index].checked = !newList[index].checked;
    //     setPetTypeList(newList)
    //     let breeds = []
    //     if(newList[0].checked)
    //         breeds = breeds.concat(egyptianDogBreeds)
    //     if(newList[1].checked)
    //         breeds = breeds.concat(egyptianCatBreeds)
    //
    //     if(!newList[0].checked && !newList[1].checked)
    //         breeds = [...egyptianCatBreeds, ...egyptianDogBreeds]
    //     setPetType(petTypeList[index].label)
    //
    //     // setSelectedPetTypes(newList.filter((item) => item.checked).map((item) => item.label))
    //     // setBreedsList(breeds);
    // }
    return (
        <ScrollView style={styles.root}>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
            <View>
                <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between"}}>
                    <Text>Pet Type:</Text>
                    <TouchableOpacity onPress={()=>setViewPetTypeFilter(!viewPetTypeFilter)}>
                        <FontAwesome name={"chevron-down"} style={{marginRight:"5%"}}></FontAwesome>
                    </TouchableOpacity>

                </View>

                {viewPetTypeFilter &&
                    <View>

                        <RadioButton.Group onValueChange={newValue => setPetType(newValue)} value={petType}>
                            <RadioButton.Item label= "Dog" value={"Dog"} />
                            <RadioButton.Item label= "Cat" value= {"Cat"} />

                        </RadioButton.Group>
                    </View>
                }

            </View>


            <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between"}}>
                <Text>Age:</Text>
                <TouchableOpacity onPress={()=>setViewAgeFilter(!viewAgeFilter)}>
                    <FontAwesome name={"chevron-down"} style={{marginRight:"5%"}}></FontAwesome>
                </TouchableOpacity>

            </View>
            {viewAgeFilter &&
                <View>
                    <TextInput   value={minAge} placeholder={"Min"}  onChangeText={handleMinAgeChange} style={{backgroundColor:"white",width:"10%"}}></TextInput>
                    <TextInput value={maxAge} placeholder={"Max"}  onChangeText={handleMaxAgeChange} style={{marginTop:"2%",backgroundColor:"white",width:"10%"}} ></TextInput>
                </View>
            }


            {/*<View>*/}
            {/*    <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between"}}>*/}
            {/*        <Text>Color:</Text>*/}
            {/*        <TouchableOpacity onPress={()=>setViewColorFilter(!viewColorFilter)}>*/}
            {/*            <FontAwesome name={"chevron-down"} style={{marginRight:"5%"}}></FontAwesome>*/}
            {/*        </TouchableOpacity>*/}

            {/*    </View>*/}
            {/*    {viewColorFilter &&*/}
            {/*        <View>*/}
            {/*            <View>*/}
            {/*                {colorsList.map((item, index) => (*/}
            {/*                    <View key={index} style={{ flexDirection: "row" }}>*/}
            {/*                        <Checkbox*/}
            {/*                            accessibilityLabel="Select this option"*/}
            {/*                            value={item.checked}*/}
            {/*                            isChecked={item.checked}*/}
            {/*                            // onValueChange={() => handleCheckboxChange(index)}*/}
            {/*                            onChange={() => handleColorFilterChange(index)}*/}
            {/*                        />*/}
            {/*                        <Text> {item.label} </Text>*/}
            {/*                    </View>*/}
            {/*                ))}*/}
            {/*            </View>*/}
            {/*            <Text>Selected colors: {selectedColors.join(", ")}</Text>*/}
            {/*       */}
            {/*        </View>*/}
            {/*    }*/}

            {/*</View>*/}

            <View>
                <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between"}}>
                    <Text>Breed:</Text>
                    <TouchableOpacity onPress={()=>setViewBreedFilter(!viewBreedFilter)}>
                        <FontAwesome name={"chevron-down"} style={{marginRight:"5%"}}></FontAwesome>
                    </TouchableOpacity>

                </View>
                {viewBreedFilter &&
                    <View>
                        <View>
                            {/*{breedsList.map((item, index) => (*/}
                            {/*    <View key={index} style={{ flexDirection: "row" }}>*/}
                            {/*        <CheckBox*/}
                            {/*            value={item.checked}*/}
                            {/*            onValueChange={(newValue) => handleBreedFilterChange(index, newValue)}*/}
                            {/*        />*/}
                            {/*        <Text> {item.label} </Text>*/}
                            {/*    </View>*/}
                            {/*))}*/}
                        </View>
                        <Text>Selected colors: {selectedColors.join(", ")}</Text>
                    </View>
                }
                <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between"}}>
                    <Text>Neutered:</Text>
                    <TouchableOpacity onPress={()=>setViewNeuteredFilter(!viewNeuteredFiltered)}>
                        <FontAwesome name={"chevron-down"} style={{marginRight:"5%"}}></FontAwesome>
                    </TouchableOpacity>

                </View>
                {viewNeuteredFiltered &&
                    <View>
                        <View>
                            <RadioButton.Group onValueChange={newValue => setIsNeutered(newValue)} value={isNeutered}>
                                <RadioButton.Item label= "No" value={false} />
                                <RadioButton.Item label= "Yes" value= {true} />
                                <RadioButton.Item label= "Any" value= {null} />
                            </RadioButton.Group>
                        </View>
                    </View>
                }

            </View>
            {/*<Text>Breed:</Text>*/}
            <Button  onPress={handleApplyFilter} title={"Apply Filter"} ></Button>






        </ScrollView>
    );
};
const styles = StyleSheet.create({
    root: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor:appPurpleLight,
    },

});


export default FilterPostsScreen;
