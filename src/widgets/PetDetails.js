import React from 'react';
import { View, Text, Image,StyleSheet } from 'react-native';
import PetServices from "../services/PetServices";
/**
 * @param {Pet} pet
 */
const PetDetails = ({ pet }) => {

    const years = PetServices.getPetAge(pet.age)[0];
    const months = PetServices.getPetAge(pet.age)[1];

    const ageString = years > 0 ? `${years} years and ${months} months` : `${months} months`;

    return (
        <View style={styles.container}>
            <Image source={{ uri: pet.photo }} style={styles.image} />
            <Text style={styles.name}>{pet.name}</Text>
            <Text style={styles.description}>{pet.description}</Text>
            <View style={styles.detailsContainer}>
                <View style={styles.detailsColumn}>
                    <Text style={styles.detailsLabel}>Age:</Text>
                    <Text style={styles.detailsLabel}>Color:</Text>
                    <Text style={styles.detailsLabel}>Breed:</Text>
                    <Text style={styles.detailsLabel}>Gender:</Text>
                    <Text style={styles.detailsLabel}>Spayed/Neutered:</Text>
                    <Text style={styles.detailsLabel}>Vaccinations:</Text>
                </View>
                <View style={styles.detailsColumn}>
                    <Text style={styles.detailsValue}>{ageString}</Text>
                    <Text style={styles.detailsValue}>{pet.color}</Text>
                    <Text style={styles.detailsValue}>{pet.breed}</Text>
                    <Text style={styles.detailsValue}>{pet.gender}</Text>
                    <Text style={styles.detailsValue}>{pet.isSpayed ? 'Yes' : 'No'}</Text>
                    <Text style={styles.detailsValue}>{pet.vaccinations}</Text>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
       marginHorizontal: '5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '40%',
        marginTop:'1%',
        justifyContent: 'center'
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        marginLeft: 8,
        marginRight: 8,
    },
    description: {
        fontSize: 16,
        marginTop: 8,
        marginLeft: 8,
        marginRight: 8,
    },
    detailsContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    detailsColumn: {
        flex: 1,
        marginLeft: 8,
        marginRight: 8,
    },
    detailsLabel: {
        fontSize: 16,
        marginBottom: 8,
    },
    detailsValue: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'right',
    },
});
export default PetDetails;
