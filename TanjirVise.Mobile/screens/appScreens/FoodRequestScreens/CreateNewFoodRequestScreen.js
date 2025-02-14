import { SafeAreaView, View, StyleSheet, Text, Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState } from 'react'
import { Button, Toast } from 'native-base';
import apiRequest from "../../../utils/apiRequest";
import CustomInput from '../../../components/CustomInput';

export default function CreateNewFoodRequestScreen({ navigation }) {
    const [location, locationChange] = useState('');
    const [quantity, quantityChange] = useState('');
    const [note, noteChange] = useState('');
    const [sumbitting, setSubmitting] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);
    const [showErrors, setShowErrors] = useState(false);


    const submit = async () => {
        setSubmitting(true);
        try {
            const response = await apiRequest(
                {
                    method: "post",
                    data: {
                        destination: location,
                        quantity: quantity,
                        note: note
                    },
                    url: "FoodRequests/request-food"
                }
            );
            if (response && response.data) {
                navigation.navigate('UserFoodRequestScreen', { id: response.data.id })
            }
            else {
                Toast.show({
                    title: " ",
                    description: "Something went wrong. Please try again.",
                    status: "error",
                    duration: 4000,
                    placement: "top"
                });
                navigation?.goBack();
            }
        }
        catch (e) {
            Toast.show({
                title: "Creating new Food Request failed",
                description: e.toString(),
                status: "error",
                duration: 4000,
                placement: "top"
            });
            navigation?.goBack();
        }
        finally {
            setSubmitting(false);
        }
    }

    return (
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
            <View style={styles.container}>
                <ScrollView style={{ width: '100%', padding: 10 }}>
                    <CustomInput
                        label="Location"
                        value={location}
                        onChangeText={locationChange}
                        isRequired={true}
                        showErrors={locationError}
                        onErrorChange={setLocationError}
                    />
                    <View style={{ marginVertical: 10 }}>
                        <CustomInput
                            label="Quantity"
                            type="number"
                            value={quantity}
                            onChangeText={quantityChange}
                            isRequired={true}
                            showErrors={quantityError}
                            onErrorChange={setQuantityError}
                        />
                    </View>
                    <CustomInput
                        label="Note"
                        type="note"
                        value={note}

                        onChangeText={noteChange}
                        showErrors={showErrors}
                    />
                </ScrollView>

                <View style={styles.submitButtonContainer}>
                    <Button
                        style={styles.button}
                        size={"md"}
                        onPress={() => submit()}
                        isLoading={sumbitting}
                        isDisabled={
                            locationError || quantityError ||
                            location === "" || quantity === ""
                        }
                        _disabled={{
                            bg: "gray.400",
                            _text: { color: "gray.700" }
                        }}
                        _hover={{
                            bg: "primary.600"
                        }}
                    >
                        Submit
                    </Button>
                </View>
            </View>
        </SafeAreaView>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 0,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    mainTitle: {
        width: "100%",
        paddingTop: Platform.OS === "android" ? 20 : 0,
        fontSize: 24,
        fontWeight: "600",
        color: "#0891B1",
        textAlign: "center"
    },
    submitButtonContainer: {
        position: "absolute", // Apsolutno pozicioniranje
        bottom: 20, // Udaljenost od dna
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        padding: 10,
        margin: 10,
        width: 200,
        borderRadius: 30,
    }
});
