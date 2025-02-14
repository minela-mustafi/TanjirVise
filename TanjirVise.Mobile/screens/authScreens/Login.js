import React, { useState } from "react";
import { StyleSheet, View, Image, Text, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import { storeAuthToken, getRoleFromToken } from "../../functions/authTokenFunctions";
import { Button, Toast } from "native-base";
import apiRequest from "../../utils/apiRequest";
import CustomInput from "../../components/CustomInput";
import { ScrollView } from "react-native-gesture-handler";

export default function Login ({ route, navigation }) {
    const [email, emailChange] = useState('');
    const [password, passwordChange] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const logIn = async () => {
        setSubmitting(true);
        try
        {
            const response = await apiRequest({
                method: "post",
                data: { email, password },
                url: "Auth/login",
            });

            if (response && response.data)
            {
                await storeAuthToken(response.data);
                const userRole = await getRoleFromToken(response.data);
                navigation.navigate(userRole === "User" ? 'AppUser' : 'App');
            } else
            {
                navigation.navigate('Auth');
            }
        } catch (e)
        {
            Toast.show({
                title: "Login failed",
                description: e.toString(),
                status: "error",
                duration: 4000,
                placement: "top"
            });
        } finally
        {
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={ Platform.OS === "ios" ? "padding" : "height" }
            style={ { flex: 1 } }
        >
            <ScrollView contentContainerStyle={ styles.container } keyboardShouldPersistTaps="handled">
                <View style={ { width: '100%', marginTop: 120 } }>
                    <View style={ styles.titleContainer }>
                        <View style={ styles.logoContainer }>
                            <Image source={ require('../../assets/logoT.png') } style={ styles.image } resizeMode="contain" />
                        </View>
                        <Text style={ styles.title }>Welcome to TanjirVise</Text>
                    </View>
                    <View style={ styles.inputContainer }>
                        <CustomInput
                            label="Email"
                            type="email"
                            value={ email }
                            onChangeText={ emailChange }
                            isRequired={ true }
                            validateType="email"
                            showErrors={ emailError }
                            onErrorChange={ setEmailError }
                        />
                    </View>
                    <View style={ styles.inputContainer }>
                        <CustomInput
                            label="Password"
                            type="password"
                            value={ password }
                            onChangeText={ passwordChange }
                            isRequired={ true }
                            validateType="password"
                            showErrors={ passwordError }
                            onErrorChange={ setPasswordError }
                        />
                    </View>
                    <View style={ styles.localContainer }>
                        <Button
                            style={ styles.button }
                            size="md"
                            onPress={ logIn }
                            isLoading={ submitting }
                            isDisabled={ passwordError || emailError || email === "" || password === "" }
                            _disabled={ { bg: "gray.400", _text: { color: "gray.700" } } }
                            _hover={ { bg: "primary.600" } }
                            borderRadius={ 30 }
                            bg="#0891b2"
                            _text={ { fontSize: 16, color: 'white' } }
                        >
                            Log in
                        </Button>
                    </View>
                </View>
                <View style={ styles.localContainer }>
                    <Text style={ { fontSize: 14, color: '#070707' } }>Don't have an account?</Text>
                    <Button
                        variant="ghost"
                        _text={ { color: '#0891B1', fontSize: 14, marginLeft: -2, paddingLeft: 0 } }
                        onPress={ () => navigation.navigate('Registration') }
                    >
                        Register!
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        height: 'auto',
        marginBottom: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 50,
        margin: 10,
        width: 200
    },
    localContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    image: {
        width: 50,
        height: 50
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        height: 90,
        width: 90,
        borderRadius: 45,
        backgroundColor: '#0891B1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: "600",
        fontSize: 24,
        color: '#0891B1',
        marginTop: 10,
        marginBottom: 30,
    }
});
