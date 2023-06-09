import React, {useState} from 'react';
import {View, Text, Button, TextInput, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {Rating,AirbnbRating} from 'react-native-ratings';
import {CheckBox} from 'react-native-elements';
import TransparentLoadingIndicator from './TransparentLoadingIndicator';
import Dialog from "react-native-dialog";


const RatingPopUp = ({isVisible, onSubmit}) => {
    const [rating, setRating] = useState(3);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading]=useState(false);

    const handleRatingChange = (value) => {
        setRating(value);
    };


    const handleCommentChange = (text) => {
        setComment(text);
    };

    const handleSubmit = async () => {
        setIsLoading(true)
        await onSubmit(rating, comment);
        setIsLoading(false)
        setRating(0);
        setComment('');
    };

    return (
        <View>
        <Dialog.Container visible={isVisible}>
                {isLoading && <TransparentLoadingIndicator/>}
                <Dialog.Description>Rate your experience:</Dialog.Description>
                <AirbnbRating
                    count={5}
                    reviews={["Terrible", "Bad", "Good", "Very Good", "Excellent"]}
                    defaultRating={3}
                    size={20}
                    onFinishRating={handleRatingChange}
                />
                <TextInput
                    value={comment}
                    onChangeText={handleCommentChange}
                    placeholder="Enter your comment..."
                />
                <Dialog.Button onPress={handleSubmit} label="Submit" />
        </Dialog.Container>
        </View>
    );
};
const styles = StyleSheet.create({});

export default RatingPopUp;
