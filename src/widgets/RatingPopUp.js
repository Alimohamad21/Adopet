import React, {useState} from 'react';
import {View, Text, Button, TextInput, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {Rating,AirbnbRating} from 'react-native-ratings';
import {CheckBox} from 'react-native-elements';
import TransparentLoadingIndicator from './TransparentLoadingIndicator';

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
        <Modal visible={isVisible}>
            <View>
                {isLoading && <TransparentLoadingIndicator/>}
                <Text>Rate your experience:</Text>
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
                <Button title="Submit" onPress={handleSubmit}/>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({});

export default RatingPopUp;
