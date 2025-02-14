import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator, Platform } from "react-native";
import { getAuthToken } from "../../functions/authTokenFunctions";
import apiRequest from "../../utils/apiRequest";
import { Button } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import FoodRequestList from "../../components/FoodRequestList";


export default function UserHomeScreen({ navigation }) {
    const [tokenLoading, setTokenLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [foodRequestData, setData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null)

    useEffect(() => {
        getAuthToken().then((token) => setAuthToken(token))
            .finally(() => setTokenLoading(false));
        if (!tokenLoading)
            getData();
    }, [tokenLoading]);

    useEffect(() => {
        if (selectedFilter !== null) {
            getDataByStatus(selectedFilter);
        }
        else {
            getData();
        }
    }, [selectedFilter]);

    useFocusEffect(
        React.useCallback(() => {
            getData();
            setSelectedFilter(null);
        }, [])
    );

    const getData = async () => {
        await apiRequest(
            {
                url: "Account/my-food-requests",
            },
        ).then((response) => setData(response.data))
            .catch((e) => console.log('e', e.toString()))
            .finally(() => setDataLoading(false))
    }

    const getDataByStatus = async (status) => {
        await apiRequest(
            {
                url: "Account/my-food-requests/status/" + status
            },
        ).then((response) => setData(response.data))
            .catch((e) => console.log('e', e.toString()))
            .finally(() => setDataLoading(false))
    }


    return (
        <SafeAreaView
            style={{ backgroundColor: "white", flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>
                        My Food Requests
                    </Text>
                </View>
                {dataLoading ? <ActivityIndicator /> : (
                    <>
                        <View style={{
                            display: "flex",
                            padding: 20,
                            width: "100%", flexDirection: "row", justifyContent: "space-between"
                        }}>
                            <Button
                                padding={0}
                                style={[selectedFilter === 0 ?
                                    styles.activeButton : styles.disabledButton,
                                styles.button]}
                                _text={{
                                    color: 'white',
                                    fontSize: '14',
                                    paddingLeft: 0 // Text color in the normal state
                                }}
                                onPress={() => {
                                    if (selectedFilter === 0) {
                                        setSelectedFilter(null)
                                    }
                                    else
                                        setSelectedFilter(0)
                                }}>Open</Button>
                            <Button
                                padding={0}
                                style={[selectedFilter === 1 ? styles.activeButton : styles.disabledButton, styles.button]}
                                onPress={() => {
                                    if (selectedFilter === 1) {
                                        setSelectedFilter(null)
                                    }
                                    else
                                        setSelectedFilter(1)
                                }}>On the Way</Button>

                            <Button
                                padding={0}
                                style={[selectedFilter === 2 ? styles.activeButton : styles.disabledButton, styles.button]}
                                onPress={() => {
                                    if (selectedFilter === 2) {
                                        setSelectedFilter(null)
                                    }
                                    else
                                        setSelectedFilter(2)
                                }}>Delivered</Button>
                        </View>

                        <FoodRequestList
                            screen={'UserFoodRequestScreen'}
                            foodRequestData={foodRequestData}
                            navigation={navigation}
                        />
                    </>
                )}
            </View>
            <View style={styles.localContainer} >
                <Button style={styles.floatingButton} // Apply custom styles
                    size={"md"}
                    padding={0}
                    _text={{
                        fontSize: 25
                    }
                    }
                    onPress={() => navigation.navigate("CreateNewFoodRequestScreen")}>+</Button>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'left',
        justifyContent: 'center',
        width: '100%',
    },
    titleContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row"
    },
    mainTitle: {
        width: "100%",
        paddingTop: Platform.OS === "android" ? 40 : 0,
        fontSize: 24,
        fontWeight: "600",
        color: "#0891B1",
        textAlign: "center"
    },
    title: {
        paddingBottom: 10,
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: 'bold'
    },
    localContainer: {
        position: "relative", // Osigurava da floatingButton koristi roditelja za referencu
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
    },
    disabledButton: {
        backgroundColor: "#9EADB5",
    },
    button: {
        borderRadius: 18, // Rounded corners
        width: 100,
        height: 27,
        fontSize: 14,
        padding: 0,
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2, // Shadow opacity for iOS
        shadowRadius: 4, // Shadow blur for iOS
        elevation: 5, // Shadow for Android
        marginBottom: 10
    },
    floatingButton: {
        position: "absolute", // Pozicionira apsolutno u odnosu na roditelja
        bottom: 20, // Udaljenost od dna
        right: 20, // Udaljenost od desne ivice
        backgroundColor: "#0891B1", // Boja pozadine
        borderRadius: 50, // Zaokruživanje ivica
        width: 60, // Širina dugmeta
        height: 60, // Visina dugmeta
        justifyContent: "center", // Centriranje sadržaja po vertikali
        alignItems: "center", // Centriranje sadržaja po horizontali
        shadowColor: "#000", // Senka
        shadowOffset: { width: 0, height: 2 }, // Offset senke
        shadowOpacity: 0.25, // Opacitet senke
        shadowRadius: 3.84, // Radijus senke
        elevation: 5, // Senka za Android
    }
});
