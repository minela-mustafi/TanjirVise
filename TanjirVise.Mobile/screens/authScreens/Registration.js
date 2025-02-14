import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { ScrollView } from 'react-native-gesture-handler'
import { Picker } from '@react-native-picker/picker';
import { Button, Toast, FormControl } from "native-base";
import apiRequest from "../../utils/apiRequest";
import CustomInput from "../../components/CustomInput";
import { role } from "../../utils/constants";

export default function Registration ({ route, navigation }) {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [surnameError, setSurnameError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null)
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        if (passwordConfirmation !== "" && passwordConfirmation !== password)
        {
            setConfirmPasswordError(true)
        }
        else setConfirmPasswordError(false)
    }, [password, passwordConfirmation])

    // Funkcija za registraciju
    const register = async () => {
        if (!name || !email || !password || !passwordConfirmation ||
            !selectedRole?.key || (selectedRole?.value === "Restaurant"
                ? !address : !surname))
        {
            setShowErrors(true);
            return;
        }

        setSubmitting(true);
        try
        {
            const url = selectedRole?.value === "Restaurant" ? "restaurant" :
                selectedRole?.value === "Volunteer" ? "volunteer" : "user"

            const data = selectedRole?.value === "Restaurant" ?
                {
                    name: name,
                    address: address,
                    phone: phone,
                    email: email,
                    password: password,
                    confirmPassword: passwordConfirmation
                }
                :
                {
                    name: name,
                    surname: surname,
                    phone: phone,
                    email: email,
                    password: password,
                    confirmPassword: passwordConfirmation
                }

            const response = await apiRequest({
                method: "post",
                data: data,
                url: "Auth/register/" + url,
            });

            if (response && response.data)
            {
                Toast.show({
                    title: "Registration successful. Please verify your email address.",
                    status: "success",
                    duration: 4000,
                    placement: "top",
                });
                navigation.navigate('Login', { role: selectedRole?.key });
            }
        } catch (e)
        {
            Toast.show({
                title: "Registration failed",
                description: e.toString(),
                status: "error",
                duration: 4000,
                placement: "top",
            });
        } finally
        {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={ { backgroundColor: "white", flex: 1 } }>
            <ScrollView contentContainerStyle={ { flexGrow: 1 } } style={ { flex: 1 } }>
                <View style={ styles.container }>
                    <View style={ styles.inputContainer }>
                        <FormControl >
                            <FormControl.Label>
                                <Text style={ { color: '#333', fontSize: 16 } }>
                                    Role*
                                </Text>
                            </FormControl.Label>
                            <View style={ styles.pickerContainer }>
                                <Picker
                                    selectedValue={ selectedRole }
                                    style={ [styles.picker, { color: selectedRole === null ? '#888' : '#000' }] }
                                    onValueChange={ (itemValue, itemIndex) =>
                                        setSelectedRole(itemValue)
                                    }>
                                    <Picker.Item label="Select a role" value={ null } enabled={ false } />
                                    { role.slice(0, -1)?.map((r) =>
                                        <Picker.Item label={ r?.value } value={ r } key={ r.key } />
                                    ) }
                                </Picker>
                            </View>
                        </FormControl>
                    </View>
                    <View style={ styles.inputContainer }>
                        <CustomInput
                            label="Name"
                            value={ name }
                            onChangeText={ setName }
                            isRequired={ true }
                            validateType="text"
                            showErrors={ nameError }
                            onErrorChange={ setNameError }
                        />
                    </View>
                    { selectedRole?.key !== null ? selectedRole?.value === "Restaurant" ? (
                        <View style={ styles.inputContainer }>
                            <CustomInput
                                label="Address"
                                value={ address }
                                onChangeText={ setAddress }
                                isRequired={ true }
                                validateType="address"
                                showErrors={ selectedRole?.value === "Restaurant" && addressError }
                                onErrorChange={ setAddressError }
                            />
                        </View>
                    ) : (
                        <View style={ styles.inputContainer }>
                            <CustomInput
                                label="Surname"
                                value={ surname }
                                onChangeText={ setSurname }
                                isRequired={ false }
                                validateType="text"
                                showErrors={ selectedRole?.value !== "Restaurant" && surnameError }
                                onErrorChange={ setSurnameError }
                            />
                        </View>
                    ) : <></> }

                    <View style={ styles.inputContainer }>
                        <CustomInput
                            label="Email"
                            type="email"
                            value={ email }
                            onChangeText={ setEmail }
                            isRequired={ true }
                            validateType="email"
                            showErrors={ emailError }
                            onErrorChange={ setEmailError }
                        />
                    </View>

                    <View style={ styles.inputContainer }>
                        <CustomInput
                            label="Phone"
                            value={ phone }
                            onChangeText={ setPhone }
                            isRequired={ true }
                            validateType="phone"
                            showErrors={ phoneError }
                            onErrorChange={ setPhoneError }
                        />
                    </View>

                    <View style={ styles.inputContainer }>
                        <CustomInput
                            label="Password"
                            type="password"
                            value={ password }
                            onChangeText={ setPassword }
                            isRequired={ true }
                            validateType="password"
                            showErrors={ passwordError }
                            onErrorChange={ setPasswordError }
                        />
                    </View>

                    <View style={ styles.inputContainer }>
                        <CustomInput
                            label="Confirm Password"
                            type="password"
                            value={ passwordConfirmation }
                            onChangeText={ setPasswordConfirmation }
                            isRequired={ true }
                            validateType="password"
                            showErrors={ confirmPasswordError }
                            errorMessage={ confirmPasswordError && passwordConfirmation !== password && "Passwords do not match" }
                        // onErrorChange={setConfirmPasswordError}
                        />
                    </View>

                    <View style={ styles.localContainer } >
                        <Button
                            size={ "md" }
                            isDisabled={ passwordError ||
                                emailError ||
                                confirmPasswordError ||
                                nameError ||
                                phoneError ||
                                (selectedRole?.value === "Restaurant" ?
                                    (address === "" || addressError)
                                    : (surname === "" || surnameError)) ||
                                password === "" ||
                                passwordConfirmation === "" ||
                                name === "" ||
                                email === "" ||
                                phone === "" ||
                                submitting }
                            onPress={ register }
                            isLoading={ submitting }
                            _disabled={ {
                                bg: "gray.400",
                                _text: { color: "gray.700" }
                            } }
                            _hover={ {
                                bg: "primary.600"
                            } }
                            borderRadius={ 20 }
                            bg="#0891B1" // Normal state background color
                            _text={ {
                                fontSize: 16,
                                color: 'white' // Text color in the normal state
                            } }
                            style={ [styles.button, { marginTop: 20 }] }
                        >
                            Register
                        </Button>
                    </View>
                </View >
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
        flex: 1, // Ensures the container takes up all available space
    },
    button: {
        padding: 10,
        margin: 10,
        width: 200
    },
    localContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    inputContainer: {
        width: '100%',
        marginBottom: 10
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
});
