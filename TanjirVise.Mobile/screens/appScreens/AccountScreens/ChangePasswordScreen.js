import { SafeAreaView, View, StyleSheet, Text, Platform, Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState, useEffect } from 'react'
import { Button, Toast } from 'native-base';
import apiRequest from "../../../utils/apiRequest";
import { removeAuthToken } from '../../../functions/authTokenFunctions';
import CustomInput from '../../../components/CustomInput';

export default function ChangePasswordScreen({ navigation }) {
    const [oldPassword, oldPasswordChange] = useState('');
    const [newPassword, newPasswordChange] = useState('');
    const [confirmPassword, confirmPasswordChange] = useState('');
    const [sumbitting, setSubmitting] = useState(false);
    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        if (confirmPassword !== "" && confirmPassword !== newPassword) {
            setConfirmPasswordError(true)
        }
        else setConfirmPasswordError(false)
    }, [newPassword, confirmPassword])

    const submit = async () => {
        setSubmitting(true);
        try {
            const response = await apiRequest(
                {
                    method: "post",
                    data: {
                        oldPassword: oldPassword,
                        password: newPassword,
                        confirmPassword: confirmPassword
                    },
                    url: "Account/my-profile/change-password"
                }
            );
            if (response && response.data) {
                removeAuthToken();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                });
            }
            else {
                Toast.show({
                    title: "",
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
                title: "Change password failed",
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
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }} >
            <View style={styles.container}>
                <ScrollView style={{ width: '100%', padding: 10, paddingTop: 0 }}>
                    <CustomInput
                        label="Old Password"
                        type="password"
                        value={oldPassword}
                        onChangeText={oldPasswordChange}
                        isRequired={true}
                        validateType="password"
                        showErrors={oldPasswordError}
                        onErrorChange={setOldPasswordError}
                    />
                    <CustomInput
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChangeText={newPasswordChange}
                        isRequired={true}
                        validateType="password"
                        showErrors={newPasswordError}
                        onErrorChange={setNewPasswordError}
                    />
                    <CustomInput
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChangeText={confirmPasswordChange}
                        isRequired={true}
                        validateType="password"
                        showErrors={confirmPasswordError}
                        errorMessage={confirmPasswordError && confirmPassword !== newPassword && "Passwords do not match"}
                    />
                </ScrollView>
                <View style={styles.submitButtonContainer} >
                    <Button
                        style={styles.button}
                        size={"md"}
                        onPress={() => submit()}
                        isLoading={sumbitting}
                        isDisabled={
                            oldPasswordError || newPasswordError || confirmPasswordError ||
                            oldPassword === "" || newPassword === "" || confirmPassword === ""
                        }
                        _disabled={{
                            bg: "gray.400",
                            _text: { color: "gray.700" }
                        }}
                        _hover={{
                            bg: "primary.600"
                        }}
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
        paddingTop: 10,
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
