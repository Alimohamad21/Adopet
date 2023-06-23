import React, {Component, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableHighlight, Animated, Button, TextInput,
} from "react-native";
import {useNavigation, useRoute} from '@react-navigation/native';
import {CurrentUserContext} from "../providers/CurrentUserProvider";
import {
  AddAdoptionPostScreenRoute,
  AddHostingPostScreenRoute, AddLostPostScreenRoute,AddFoundPostScreenRoute,
  appPurpleDark, appPurpleLight,
  borderGrey,
  catAndDogColors,
  egyptianCatBreeds,
  egyptianDogBreeds,
  vaccinationOptions,
} from "../utilities/constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { StatusBar } from "native-base";
import TransparentLoadingIndicator from "../widgets/TransparentLoadingIndicator";
import RadioButtonComponent from "../widgets/RadioButtonComponent";
import DropdownComponent from "../widgets/DropdownComponent";
import AddLostPostScreen from "./AddLostPostScreen";
const PostTypesListScreen = () => {
  const navigation = useNavigation();
  const [view,setView] = useState(1)
  const {currentUser, setCurrentUser} = useContext(CurrentUserContext);

  const handleAddAdoptionPostPress=()=> {
    navigation.navigate(AddAdoptionPostScreenRoute)
  };
  const handleAddHostingPostPress=()=> {
    navigation.navigate(AddHostingPostScreenRoute)
  };

  const handleAddLostPostPress=()=> {
    navigation.navigate(AddLostPostScreenRoute)

    const handleAddFoundPostPress=()=> {
    navigation.navigate(AddFoundPostScreenRoute)
  };
  return (
    <View style={styles.screen}>

      <StatusBar backgroundColor={appPurpleDark} barStyle="light-content"/>
      {/*{isLoading && <TransparentLoadingIndicator/>}*/}
      <ScrollView showsVerticalScrollIndicator={false}
                  contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={styles.scrollView}>

        <View style={{alignItems: 'center'}}>
          <View style={{marginTop: 10, flex: 1, width: '100%', alignItems: 'center'}}>
            <TouchableOpacity style={styles.btnContainer} onPress={handleAddAdoptionPostPress}>
              <Text style={styles.btnText}>Adoption Post</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{alignItems: 'center'}}>
          <View style={{marginTop: 10, flex: 1, width: '100%', alignItems: 'center'}}>
            <TouchableOpacity style={styles.btnContainer} onPress={handleAddHostingPostPress}>
              <Text style={styles.btnText}>Hosting Post</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{alignItems: 'center'}}>
          <View style={{marginTop: 10, flex: 1, width: '100%', alignItems: 'center'}}>
            
            <TouchableOpacity style={styles.btnContainer} onPress={handleAddLostPostPress}>
              <Text style={styles.btnText}>Lost Post</Text>

            <TouchableOpacity style={styles.btnContainer} onPress={handleAddFoundPostPress}>
              <Text style={styles.btnText}>Found Post</Text>

            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  // container: {
  //   flex: 1,
  //   marginTop: '10%',
  //   alignItems: 'center',
  //
  // },
  btnContainer: {
    backgroundColor: appPurpleDark,
    alignItems: 'center',
    width: '85%',
    height: 35,
    borderRadius: 7,

  },
  btnText: {
    fontFamily: 'sans-serif-medium',
    marginTop: 6,
    color: 'white',
    fontSize: 15,
  },
});
export default PostTypesListScreen;
