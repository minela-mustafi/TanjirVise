import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, ActivityIndicator, Text, Platform } from "react-native";
import { getAuthToken } from "../../../functions/authTokenFunctions";
import FoodRequest from "../../../components/FoodRequest";
import { Button } from "native-base";
import apiRequest from "../../../utils/apiRequest";

export default function UserFoodRequestScreen({ route, navigation }) {
    const [tokenLoading, setTokenLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [foodRequestData, setData] = useState([]);
    const id = route.params.id;

    useEffect(() => {
        getAuthToken().then((token) => setAuthToken(token))
            .finally(() => setTokenLoading(false));
        if (!tokenLoading)
            getData();
    }, [tokenLoading]);

    const getData = async () => {
        await apiRequest(
            {
                url: "Account/my-food-requests/" + id
            }
        )
            .then((response) => setData(response.data))
            .catch((e) => console.log('e', e.toString()))
            .finally(() => setDataLoading(false))
    }

    const deleteFoodRequest = async () => {
        await apiRequest(
            {
                method: "delete",
                url: "Account/my-food-requests/delete/" + id
            }
        ).then(() => navigation?.goBack())
            .catch((e) => console.log('e', e.toString()))

    }

    return (
        <SafeAreaView
            style={{ backgroundColor: "white", flex: 1 }}>
            <View style={styles.container}>
                {dataLoading ? <ActivityIndicator /> : (
                    <FoodRequest foodRequest={foodRequestData} />
                )}
                <View style={styles.buttonContainer}>
                    <Button
                        _text={{
                            color: '#E6611E',
                            fontSize: '14',
                            marginLeft: -2,
                            paddingLeft: 0 // Text color in the normal state
                        }}
                        variant={'outline'}
                        size={"md"}
                        style={styles.button} // Apply custom styles
                        onPress={() => deleteFoodRequest()}>Delete</Button>
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
    title: {
        paddingBottom: 10,
        fontFamily: 'Inter',
        fontWeight: 'bold'
    },
    data: {
        fontFamily: 'Inter',
        fontStyle: 'italic'
    },
    buttonContainer: {
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
        borderColor: '#E6611E',
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
