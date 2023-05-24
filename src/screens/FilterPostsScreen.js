import ScreenLoadingIndicator from '../widgets/ScreenLoadingIndicator';
import React, {Component, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState} from 'react';
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
import Slider from 'rn-range-slider';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
    AdoptionScreenRoute,
    appPurpleDark,
    appPurpleLight,
    egyptianCatBreeds,
    egyptianDogBreeds
} from "../utilities/constants";
import {StatusBar, Switch} from "native-base";
import {RadioButton} from 'react-native-paper';
import PostServices from "../services/PostServices";
import Thumb from "../widgets/SliderWidgets/Thumb";
import Rail from "../widgets/SliderWidgets/Rail";
import RailSelected from "../widgets/SliderWidgets/RailSelected";
import Label from "../widgets/SliderWidgets/Label";
import Notch from "../widgets/SliderWidgets/Notch";


const FilterPostsScreen = ({route}) => {

    let prevFilters = route.params

    const navigation = useNavigation();

    const [viewPetTypeFilter, setViewPetTypeFilter] = useState(true);
    const [viewAgeFilter, setViewAgeFilter] = useState(true);
    const [viewBreedFilter, setViewBreedFilter] = useState(true);
    const [viewNeuteredFiltered, setViewNeuteredFilter] = useState(true);


    const [petType, setPetType] = useState(null);
    const [minAge, setMinAge] = useState(0);
    const [maxAge, setMaxAge] = useState(15);
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    const [isNeutered, setIsNeutered] = useState();


    const [breedsList, setBreedsList] = useState([...egyptianCatBreeds, ...egyptianDogBreeds]);



    const handleClose = () => {
        navigation.goBack();
    }

    const handleApplyFilter = async () => {
        let ageRange = {
            "min": minAge,
            "max": maxAge,
        }

        let filters = {
            "ageRange": ageRange,
            "petType": petType,
            "selectedBreeds": selectedBreeds,
            "isNeutered": isNeutered === "any" ? null : isNeutered
        }
        navigation.navigate(prevFilters.prevScreenRoute, {"isFiltered": true, "filters": filters})

    }
    const handelResetFilter = () => {
        setMaxAge(15)
        setMinAge(0)
        setBreedsList([...egyptianCatBreeds, ...egyptianDogBreeds])
        setSelectedBreeds([])
        setIsNeutered(null)
        setPetType(null)
        prevFilters.filters = null

    }

    const handleBreedFilterChange = (index) => {
        const newBreedsList = [...breedsList];
        newBreedsList[index] = {
            ...newBreedsList[index],
            checked: !newBreedsList[index].checked,
        };
        setBreedsList(newBreedsList);
        console.log(newBreedsList)
        setSelectedBreeds(newBreedsList.filter((item) => item.checked).map((item) => item.label))
    }

    const renderThumb = useCallback((text) => <Thumb name={text} min={minAge} max={maxAge}/>, [minAge, maxAge]);
    const renderRail = useCallback(() => <Rail/>, []);
    const renderRailSelected = useCallback(() => <RailSelected/>, []);
    const handleValueChange = useCallback((low, high) => {
        setMinAge(low)
        setMaxAge(high)
    }, []);

    /* HANDLES SWITCHING BETWEEN DOGS BREEDS AND CATS BREEDS IN THE BREEDS LIST */
    useEffect(() => {

        if (prevFilters.filters != null ){
            let breeds;
            if (petType === "Dog")
                breeds = [...egyptianDogBreeds];
            else if (petType === "Cat")
                breeds = [...egyptianCatBreeds];
            else {
                breeds = [...egyptianCatBreeds, ...egyptianDogBreeds]
            }
            breeds = breeds.map((breed) => {
                const isChecked = prevFilters.filters.selectedBreeds.includes(breed.label);
                return { ...breed, checked: isChecked };
            });
            //Update the state with the new breeds array
            setBreedsList(breeds);
            setSelectedBreeds(breeds.filter((item) => item.checked).map((item) => item.label))
            // prevFilters.filters = null
        }
        else {
            let breeds;
            if (petType === "Dog")
                breeds = [...egyptianDogBreeds];
            else if (petType === "Cat")
                breeds = [...egyptianCatBreeds];
            else {
                breeds = [...egyptianCatBreeds, ...egyptianDogBreeds]
            }

            //Update the state with the new breeds array
            setBreedsList(breeds);

        }

    }, [petType]);


    useLayoutEffect(() => {
        navigation.setOptions({
            headerTintColor: appPurpleDark,
            headerStyle: {
                backgroundColor: 'white',
            },
            headerLeft: () => <View/>,
            headerRight: () => {
                return (
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginLeft: "70%"
                    }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            marginTop: "5%",
                            marginBottom: "5%",
                            marginRight: "15%"
                        }}>
                            <TouchableOpacity onPress={handelResetFilter} style={styles.resetFilters}>
                                <Text style={{
                                    color: appPurpleDark,
                                    fontWeight: "600",
                                    fontSize: 18,
                                    textAlign: "center"
                                }}>Reset </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity>
                            <FontAwesome onPress={handleClose} name={"times"}
                                         style={{fontSize: 20, marginBottom: "35%"}}></FontAwesome>
                        </TouchableOpacity>
                    </View>
                )
            },
        });

        /*LOADS THE FILTERS SCREEN WITH THE PREVIOUS FILTERS*/
        const loadPrevFilters = async () => {
            if (prevFilters.filters) {
                if (prevFilters.filters.petType)
                    setPetType(prevFilters.filters.petType)

                setMinAge(prevFilters.filters.ageRange.min)
                setMaxAge(prevFilters.filters.ageRange.max)
                if (prevFilters.filters.selectedBreeds.length > 0) {


                    let breeds;
                    if (prevFilters.filters.petType === "Dog")
                        breeds = [...egyptianDogBreeds];
                    else if (prevFilters.filters.petType === "Cat")
                        breeds = [...egyptianCatBreeds];
                    else
                        breeds = [...egyptianCatBreeds, ...egyptianDogBreeds]

                    breeds = breeds.map((breed) => {
                        const isChecked = prevFilters.filters.selectedBreeds.includes(breed.label);
                        return {...breed, checked: isChecked};
                    });
                    // Update the state with the new breeds array
                    setBreedsList(breeds);
                    setSelectedBreeds(breeds.filter((item) => item.checked).map((item) => item.label))

                }
                if (prevFilters.filters.isNeutered)
                    setIsNeutered(prevFilters.filters.isNeutered)

            }
        }
        loadPrevFilters().then(() => {
        })
    }, []);

    return (
        <ScrollView style={styles.root}>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content"/>

            <View>


                <TouchableOpacity onPress={() => setViewPetTypeFilter(!viewPetTypeFilter)} style={styles.filterTitle}>
                    <Text style={styles.filterTitleText}>Pet Type</Text>
                    {!viewPetTypeFilter &&
                        <FontAwesome style={styles.filterTitleText} name={"chevron-down"}></FontAwesome>
                    }
                    {viewPetTypeFilter &&
                        <FontAwesome style={styles.filterTitleText} name={"chevron-up"}></FontAwesome>
                    }

                </TouchableOpacity>


                {viewPetTypeFilter &&
                    <View style={{justifyContent: "center", marginLeft: "6%", marginRight: "6%"}}>

                        <RadioButton.Group onValueChange={newValue => setPetType(newValue)} value={petType}>
                            <RadioButton.Item label="Dog" value={"Dog"} labelStyle={{fontWeight: "bold"}}
                                              color={appPurpleDark}/>
                            <RadioButton.Item label="Cat" value={"Cat"} labelStyle={{fontWeight: "bold"}}
                                              color={appPurpleDark}/>

                        </RadioButton.Group>
                    </View>
                }

            </View>
            <View style={{
                borderBottomWidth: 2,
                borderColor: "#D3D3D3",
                marginTop: 10,
                marginBottom: 10,
                marginLeft: "4%",
                marginRight: "4%"
            }}/>


            <TouchableOpacity onPress={() => setViewAgeFilter(!viewAgeFilter)} style={styles.filterTitle}>
                <Text style={styles.filterTitleText}>Age</Text>
                {!viewAgeFilter &&
                    <FontAwesome style={styles.filterTitleText} name={"chevron-down"}></FontAwesome>
                }
                {viewAgeFilter &&
                    <FontAwesome style={styles.filterTitleText} name={"chevron-up"}></FontAwesome>
                }

            </TouchableOpacity>


            {viewAgeFilter &&
                <View>
                    <View style={styles.ageRangeInputsContainer}>

                    </View>

                    <Slider
                        style={styles.slider}
                        min={0}
                        max={15}
                        low={minAge}
                        high={maxAge}
                        step={1}
                        value={[minAge, maxAge]}
                        floatingLabel={false}
                        renderThumb={renderThumb}
                        renderRail={renderRail}
                        renderRailSelected={renderRailSelected}
                        onValueChanged={handleValueChange}
                    />
                </View>
            }
            <View>


                <View style={{
                    borderBottomWidth: 2,
                    borderColor: "#D3D3D3",
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: "4%",
                    marginRight: "4%"
                }}/>


                <TouchableOpacity onPress={() => setViewBreedFilter(!viewBreedFilter)} style={styles.filterTitle}>
                    <Text style={styles.filterTitleText}>Breed</Text>
                    {!viewBreedFilter &&
                        <FontAwesome style={styles.filterTitleText} name={"chevron-down"}></FontAwesome>
                    }
                    {viewBreedFilter &&
                        <FontAwesome style={styles.filterTitleText} name={"chevron-up"}></FontAwesome>
                    }

                </TouchableOpacity>


                {viewBreedFilter &&
                    <View>
                        <View style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "flex-start",
                            marginLeft: "3%",
                            marginRight: "3%"
                        }}>

                            {breedsList.map((item, index) => (

                                <TouchableOpacity onPress={() => handleBreedFilterChange(index)} key={index}
                                                  style={[styles.breedsFilterItem,
                                                      item.checked ? styles.checkedItem : styles.uncheckedItem]}>

                                    <Text style={{fontWeight: "bold", color: "black"}}>{item.label}</Text>

                                </TouchableOpacity>

                            ))}

                        </View>

                    </View>
                }

                <View style={{
                    borderBottomWidth: 2,
                    borderColor: "#D3D3D3",
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: "4%",
                    marginRight: "4%"
                }}/>
                <TouchableOpacity onPress={() => setViewNeuteredFilter(!viewNeuteredFiltered)}
                                  style={styles.filterTitle}>
                    <Text style={styles.filterTitleText}>Neutered</Text>
                    {!viewNeuteredFiltered &&
                        <FontAwesome style={styles.filterTitleText} name={"chevron-down"}></FontAwesome>
                    }
                    {viewNeuteredFiltered &&
                        <FontAwesome style={styles.filterTitleText} name={"chevron-up"}></FontAwesome>
                    }
                </TouchableOpacity>


                {viewNeuteredFiltered &&
                    <View style={{justifyContent: "center", marginLeft: "6%", marginRight: "6%"}}>
                        <View>
                            <RadioButton.Group onValueChange={newValue => setIsNeutered(newValue)} value={isNeutered}>
                                <RadioButton.Item label="No" value={false} labelStyle={{fontWeight: "bold"}}
                                                  color={appPurpleDark}/>
                                <RadioButton.Item label="Yes" value={true} labelStyle={{fontWeight: "bold"}}
                                                  color={appPurpleDark}/>
                                <RadioButton.Item label="Any" value={"any"} labelStyle={{fontWeight: "bold"}}
                                                  color={appPurpleDark}/>
                            </RadioButton.Group>
                        </View>
                    </View>
                }
            </View>
            {/*<Text>Breed:</Text>*/}
            <View style={{
                borderBottomWidth: 2,
                borderColor: "#D3D3D3",
                marginTop: 10,
                marginBottom: 10,
                marginLeft: "4%",
                marginRight: "4%"
            }}/>
            <View style={{flexDirection: "row", justifyContent: "center", marginTop: "5%", marginBottom: "7%"}}>
                <TouchableOpacity onPress={handleApplyFilter} style={styles.applyFilters}>
                    <Text style={{color: "white", fontWeight: "600", fontSize: 18, textAlign: "center"}}>Apply
                        Filters</Text>
                </TouchableOpacity>
            </View>


        </ScrollView>
    );
};
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white",

    },
    filterTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    },
    filterTitleText: {
        fontSize: 17,
        margin: "5%",
        color: "#818589",
        fontWeight: "bold"
    },
    breedsFilterItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderStyle: "solid",
        borderWidth: 1,
        width: "32%",
        marginBottom: "2%",
        padding: "1%",
        borderRadius: 10,
        marginLeft: "1%"
    },
    checkedItem: {
        borderColor: appPurpleDark,
        borderWidth: 1.5,
        backgroundColor: appPurpleLight
    },
    uncheckedItem: {
        borderColor: "#D3D3D3",
        borderWidth: 1.5
    },
    slider: {
        flex: 1,
        width: "85%",
        marginLeft: "7%"

    },
    ageRangeInputsContainer: {
        flexDirection: "row",
        justifyContent: "center",

    },
    ageRangeInputs: {

        width: "20%",
        marginLeft: "10%",
        marginRight: "10%",
        flexDirection: "row",
        textAlign: "center",
        borderColor: "#D3D3D3",
        borderWidth: 1.5,
        borderRadius: 10,
        fontWeight: "bold"
    },
    applyFilters: {
        borderRadius: 5,
        backgroundColor: appPurpleDark,
        width: "90%",
        padding: "1%"
    },
    resetFilters: {
        borderRadius: 7,
        backgroundColor: "white",
        width: "80%",
        borderWidth: 2,
        borderColor: appPurpleDark,
        padding: "1%"
    }
});


export default FilterPostsScreen;
