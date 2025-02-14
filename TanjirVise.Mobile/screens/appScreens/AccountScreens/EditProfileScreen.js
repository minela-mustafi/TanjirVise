import { SafeAreaView, View, StyleSheet, Text, Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState } from 'react'
import { Button, Toast } from 'native-base';
import apiRequest from "../../../utils/apiRequest";
import CustomInput from '../../../components/CustomInput';
import { role } from '../../../utils/constants';

export default function EditProfileScreen({ route, navigation }) {
    const myProfile = route.params.myProfile;
    const [name, nameChange] = useState(myProfile.name);
    const [surname, surnameChange] = useState(myProfile.surname);
    const [restaurantName, restaurantNameChange] = useState(myProfile.restaurantName)
    const [address, addressChange] = useState(myProfile.address);
    const [phone, phoneChange] = useState(myProfile.phone);
    const [sumbitting, setSubmitting] = useState(false);

    const submit = async () => {
        setSubmitting(true);
        try {
            const response = await apiRequest(
                {
                    method: "post",
                    data: {
                        name: name,
                        surname: surname,
                        restaurantName: restaurantName,
                        address: address,
                        phone: phone
                    },
                    url: "Account/my-profile/edit"
                }
            );
            if (response && response.data) {
                navigation.navigate('MyProfile')
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
                title: "Editing profile failed",
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
                    {role[myProfile.role]?.value === "Volunteer"
                        || role[myProfile.role]?.value === "User"
                        ? <CustomInput
                            label="Name"
                            value={name}
                            onChangeText={nameChange}
                        />
                        : <CustomInput
                            label="Name"
                            value={restaurantName}
                            onChangeText={restaurantNameChange}
                        />
                    }

                    {surname ?
                        <CustomInput
                            label="Surname"
                            value={surname}
                            onChangeText={surnameChange}
                        />
                        : null
                    }

                    {address ?
                        <CustomInput
                            label="Address"
                            value={address}
                            onChangeText={addressChange}
                        />
                        : null
                    }

                    <CustomInput
                        label="Phone"
                        value={phone}
                        onChangeText={phoneChange}
                    />
                </ScrollView>

                <View style={styles.submitButtonContainer} >
                    <Button
                        style={styles.button}
                        size={"md"}
                        onPress={() => submit()}
                    >
                        Confirm
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
})
