import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from "native-base";
import { ScrollView } from 'react-native-gesture-handler'
import { getAuthToken, removeAuthToken } from '../../../functions/authTokenFunctions'
import MyProfile from '../../../components/MyProfile';
import apiRequest from '../../../utils/apiRequest';

export default function MyProfileScreen ({ navigation }) {
    const [tokenLoading, setTokenLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [myProfileData, setData] = useState([]);

    useEffect(() => {
        getAuthToken().then((token) => setAuthToken(token))
            .finally(() => setTokenLoading(false));
        if (!tokenLoading)
            getData();
    }, [tokenLoading, myProfileData]);

    const getData = async () => {
        await apiRequest(
            {
                url: "Account/my-profile"
            }
        )
            .then((response) => setData(response.data))
            .catch((e) => console.log('e', e.toString()))
            .finally(() => setDataLoading(false))
    }

    const logout = async () => {
        removeAuthToken();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }], // This is inside your AuthStack
        });
    }

    return (
        <SafeAreaView
            style={ { backgroundColor: "white", flex: 1 } }>
            <View style={ styles.container }>
                <Text style={ styles.mainTitle }>My Profile</Text>
                { dataLoading ? <ActivityIndicator /> : (
                    <View>
                        <ScrollView>
                            <MyProfile myProfile={ myProfileData } />
                        </ScrollView>
                    </View>
                ) }

                <View style={ styles.buttonContainer }>
                    <Button
                        _text={ {
                            color: '#0891B1',
                            fontSize: '14',
                            marginLeft: -2,
                            paddingLeft: 0 // Text color in the normal state
                        } }
                        variant={ 'outline' }
                        size={ "md" }
                        style={ styles.button }
                        onPress={ () => navigation.navigate("EditProfile", { myProfile: myProfileData }) }>
                        Edit Profile
                    </Button>
                    <Button
                        _text={ {
                            color: '#0891B1',
                            fontSize: '14',
                            marginLeft: -2,
                            paddingLeft: 0 // Text color in the normal state
                        } }
                        variant={ 'outline' }
                        size={ "md" }
                        style={ [styles.button, { marginTop: 10 }] }
                        onPress={ () => navigation.navigate("ChangePassword") }>
                        Change Password
                    </Button>
                </View>

                <View style={ styles.logoutButtonContainer }>
                    <Button
                        _text={ {
                            fontSize: '14',
                            marginLeft: -2,
                            paddingLeft: 0 // Text color in the normal state
                        } }
                        size={ "md" }
                        style={ [styles.button, { backgroundColor: '#0891B1' }] }
                        onPress={ () => logout() }>Log Out</Button>
                </View>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'left',
        width: '100%',
        padding: 20
    },
    mainTitle: {
        width: "100%",
        paddingTop: Platform.OS === "android" ? 20 : 0,
        paddingBottom: 20,
        fontSize: 24,
        fontWeight: "600",
        color: "#0891B1",
        textAlign: "center"
    },
    buttonContainer: {
        alignItems: 'center', // Center horizontally
        marginTop: 20, // Space above buttons
    },
    logoutButtonContainer: {
        position: "absolute", // Apsolutno pozicioniranje
        bottom: 20, // Udaljenost od dna
        left: 0, // Početak od leve strane
        right: 0, // Kraj do desne strane
        justifyContent: "center", // Centriranje po horizontali
        alignItems: "center", // Centriranje po horizontali
    },
    button: {
        borderRadius: 30, // Zaokružene ivice
        paddingVertical: 12, // Vertikalni padding
        paddingHorizontal: 20, // Horizontalni padding
        shadowColor: '#000', // Boja senke za iOS
        borderColor: '#0891B1',
        backgroundColor: 'white', // Boja pozadine
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
