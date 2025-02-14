import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, ActivityIndicator, Text, Platform } from "react-native";
import { getAuthToken } from "../../../functions/authTokenFunctions";
import FoodRequest from "../../../components/FoodRequest";
import { Button } from "native-base";
import apiRequest from "../../../utils/apiRequest";
import { getUserIdFromToken } from "../../../functions/authTokenFunctions";
import { getRoleFromToken } from "../../../functions/authTokenFunctions";

export default function FoodRequestScreen ({ route, navigation }) {
    const [tokenLoading, setTokenLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [foodRequestData, setData] = useState([]);
    const [assigneeId, setAssigneeId] = useState(null);
    const [role, setRole] = useState(null);
    const id = route.params.id;

    useEffect(() => {
        getAuthToken().then((token) => setAuthToken(token))
            .finally(() => setTokenLoading(false));
        if (!tokenLoading)
            getData();
    }, [tokenLoading, foodRequestData]);

    useEffect(() => {
        getUserIdFromToken().then((id) => setAssigneeId(id))
    }, [assigneeId]);

    useEffect(() => {
        getRoleFromToken().then((role) => setRole(role))
    }, [role]);

    const getData = async () => {
        await apiRequest(
            {
                url: "FoodRequests/" + id
            }
        )
            .then((response) => setData(response.data))
            .catch((e) => console.log('e', e.toString()))
            .finally(() => setDataLoading(false))
    }

    const assignToFoodRequest = async () => {
        const url = role === "Volunteer" ? "/assign-volunteer" : "/assign-restaurant"
        await apiRequest(
            {
                method: "post",
                url: "FoodRequests/" + id + url
            }
        ).then(() => navigation.navigate('FoodRequestScreen', { id: id }))
            .catch((e) => console.log('e', e.toString()))

    }

    const unassignFromFoodRequest = async () => {
        await apiRequest(
            {
                method: "post",
                url: "Account/my-food-requests/unassign/" + id
            }
        ).then(() => navigation?.goBack())
            .catch((e) => console.log('e', e.toString()))
    }


    return (
        <SafeAreaView
            style={ { backgroundColor: "white", flex: 1 } }>
            <View style={ styles.container }>
                <Text style={ styles.mainTitle }>Food Request</Text>
                { dataLoading ? <ActivityIndicator /> : (
                    <FoodRequest foodRequest={ foodRequestData } />
                ) }

                <View style={ styles.buttonContainer }>
                    { (role === "Volunteer" && String(assigneeId) === String(foodRequestData.volunteerId)) ||
                        (role === "Restaurant" && String(assigneeId) === String(foodRequestData.restaurantId)) ?
                        <Button
                            _text={ {
                                color: '#0891B1',
                                fontSize: '14',
                                marginLeft: -2,
                                paddingLeft: 0 // Text color in the normal state
                            } }
                            variant={ 'outline' }
                            size={ "md" }
                            style={ styles.button } // Apply custom styles
                            onPress={ () => unassignFromFoodRequest() }>
                            Unassign
                        </Button>
                        :
                        <Button
                            _text={ {
                                fontSize: '14',
                                marginLeft: -2,
                                paddingLeft: 0 // Text color in the normal state
                            } }
                            size={ "md" }
                            style={ [styles.button, { backgroundColor: '#0891B1' }] } // Apply custom styles
                            onPress={ () => assignToFoodRequest() }>
                            Assign
                        </Button>
                    }
                    { role === "Volunteer" &&
                        String(assigneeId) === String(foodRequestData.volunteerId) ?
                        <Button
                            _text={ {
                                fontSize: '14',
                                marginLeft: -2,
                                paddingLeft: 0 // Text color in the normal state
                            } }
                            size={ "md" }
                            style={ [styles.button, { marginTop: 10, backgroundColor: '#0891B1' }] } // Apply custom styles
                            onPress={ () => navigation.navigate('ChangeStatus', { id: id }) }>
                            Change Status
                        </Button>
                        :
                        null
                    }
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
