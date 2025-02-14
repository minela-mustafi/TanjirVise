import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Toast } from "native-base";
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import apiRequest from '../utils/apiRequest';
import { requestStatus } from '../utils/constants';

export default function ChangeStatus ({ route, navigation }) {
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [sumbitting, setSubmitting] = useState(false);
    const id = route.params.id;

    const handleChangeStatus = (value) => {
        if (value !== null)
        {
            setSelectedStatus(value);
        }
    };

    const changeStatus = async () => {
        setSubmitting(true);
        try
        {
            const numericStatus = parseInt(selectedStatus, 10);
            const response = await apiRequest(
                {
                    method: "post",
                    params: {
                        requestStatus: numericStatus
                    },
                    url: "Account/my-food-requests/change-status/" + id
                }
            );
            if (response && response.data)
            {
                navigation.navigate('FoodRequestScreen', { id: id })
            }
            else
            {
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
        catch (e)
        {
            Toast.show({
                title: "Changing status failed",
                description: e.toString(),
                status: "error",
                duration: 4000,
                placement: "top"
            });
            navigation?.goBack();
        }
        finally
        {
            setSubmitting(false);
        }
    }

    return (
        <Modal
            isVisible={ true }
            onBackdropPress={ () => navigation.goBack() }
        >
            <View style={ styles.container }>
                <Text style={ styles.title }>Change Status</Text>
                <View>
                    <View style={ styles.pickerContainer }>
                        <Picker
                            selectedValue={ selectedStatus }
                            style={ [styles.picker, { color: selectedStatus === null ? '#888' : '#000' }] }
                            onValueChange={ (itemValue, itemIndex) =>
                                handleChangeStatus(itemValue)
                            }>
                            <Picker.Item label="Select a status" value={ null } enabled={ false } />
                            { requestStatus.map((s) =>
                                <Picker.Item label={ s?.value } value={ s.key } key={ s.key } />
                            ) }
                        </Picker>
                    </View>
                </View>

                <View style={ styles.buttonContainer }>
                    <Button
                        _text={ {
                            fontSize: '14',
                            textAlign: 'center'
                        } }
                        size={ "md" }
                        style={ styles.button }
                        onPress={ () => {
                            if (selectedStatus !== null)
                                changeStatus();
                            else
                                navigation.goBack();
                        } }>
                        Confirm
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: "#0891B1"
    },
    pickerContainer: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 13, // Rounded corners
        overflow: "hidden", // Ensures Picker fits within the rounded container
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 10, // Horizontal padding
        height: 40, // Set height of the container
        justifyContent: "center", // Align content in the cente
    },
    picker: {
        height: 50,
        backgroundColor: "white",
        borderRadius: 13
    },
    buttonContainer: {
        marginTop: 20,
        justifyContent: "center", // Centriranje po horizontali
        alignItems: "center", // Centriranje po horizontali
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30, // Zaokružene ivice
        paddingVertical: 12, // Vertikalni padding
        paddingHorizontal: 20, // Horizontalni padding
        shadowColor: '#000', // Boja senke za iOS
        borderColor: '#0891B1',
        backgroundColor: '#0891B1', // Boja pozadine
        shadowOffset: {
            width: 0,
            height: 2,
        },
        width: 200,
        shadowOpacity: 0.2, // Opacitet senke za iOS
        shadowRadius: 4, // Radijus senke za iOS
        elevation: 5, // Senka za Android
    }
});
