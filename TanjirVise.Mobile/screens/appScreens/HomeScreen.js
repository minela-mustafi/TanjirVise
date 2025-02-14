import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableWithoutFeedback, Platform } from "react-native";
import { getAuthToken } from "../../functions/authTokenFunctions";
import apiRequest from "../../utils/apiRequest";
import { Button } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import { requestStatus } from "../../utils/constants";
import { ScrollView } from "react-native-gesture-handler";
import FoodRequestList from "../../components/FoodRequestList";

export default function HomeScreen ({ route, navigation }) {
    const [tokenLoading, setTokenLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [foodRequestData, setData] = useState([]);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState(null);
    const [selectedAssignFilter, setSelectedAssignFilter] = useState(null);
    const myRequest = route?.params?.myRequest ?? false;


    useEffect(() => {
        getAuthToken().then((token) => setAuthToken(token))
            .finally(() => setTokenLoading(false));
        if (!tokenLoading)
            getData();
    }, [tokenLoading]);

    useEffect(() => {
        if (selectedStatusFilter !== null)
        {
            getDataByStatus(selectedStatusFilter);
        }
        else if (selectedAssignFilter !== null)
        {
            getAssignedData();
        }
        else
        {
            getData();
        }
    }, [selectedStatusFilter, selectedAssignFilter]);

    useFocusEffect(
        React.useCallback(() => {
            getData();
            setSelectedStatusFilter(null);
            setSelectedAssignFilter(null);
        }, [])
    );

    const getData = async () => {
        const url = myRequest ? "Account/my-food-requests" : "FoodRequests";
        await apiRequest(
            {
                url: url,
            },
        ).then((response) => setData(response.data))
            .catch((e) => console.log('e', e.toString()))
            .finally(() => setDataLoading(false))
    }

    const getDataByStatus = async (status) => {
        const url = myRequest ? "Account/my-food-requests/status/" : "FoodRequests/status/";
        await apiRequest(
            {
                url: url + status
            },
        ).then((response) => setData(response.data))
            .catch((e) => console.log('e', e.toString()))
            .finally(() => setDataLoading(false))
    }

    const getAssignedData = async () => {
        const url = selectedAssignFilter === 0 ? "FoodRequests/no-volunteer"
            : selectedAssignFilter === 1 ? "FoodRequests/no-restaurant" : null;
        await apiRequest(
            {
                url: url
            },
        ).then((response) => setData(response.data))
            .catch((e) => console.log('e', e.toString()))
            .finally(() => setDataLoading(false))
    }


    return (
        <SafeAreaView
            style={ { backgroundColor: "white", flex: 1 } }>
            <View style={ styles.container }>
                <View style={ styles.titleContainer }>
                    { myRequest ?
                        <Text style={ styles.mainTitle }>
                            My Food Requests
                        </Text>
                        :
                        <Text style={ styles.mainTitle }>
                            Food Requests
                        </Text>
                    }
                </View>
                { dataLoading ? <ActivityIndicator /> : (
                    <>
                        <View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={ false }
                                contentContainerStyle={ {
                                    display: "flex",
                                    padding: 10,
                                    paddingTop: 20,
                                    flexDirection: "row"
                                } }
                            >
                                <Button
                                    size={ "md" }
                                    padding={ 0 }
                                    style={ [
                                        selectedStatusFilter === 0 ? styles.activeButton : styles.disabledButton,
                                        styles.button
                                    ] }
                                    onPress={ () => {
                                        if (selectedStatusFilter === 0)
                                        {
                                            setSelectedStatusFilter(null);
                                        } else
                                        {
                                            setSelectedAssignFilter(null);
                                            setSelectedStatusFilter(0);
                                        }
                                    } }
                                >
                                    Open
                                </Button>

                                <Button
                                    size={ "md" }
                                    padding={ 0 }
                                    style={ [
                                        selectedStatusFilter === 1 ? styles.activeButton : styles.disabledButton,
                                        styles.button
                                    ] }
                                    onPress={ () => {
                                        if (selectedStatusFilter === 1)
                                        {
                                            setSelectedStatusFilter(null);
                                        } else
                                        {
                                            setSelectedAssignFilter(null);
                                            setSelectedStatusFilter(1);
                                        }
                                    } }
                                >
                                    On the Way
                                </Button>

                                <Button
                                    size={ "md" }
                                    padding={ 0 }
                                    style={ [
                                        selectedStatusFilter === 2 ? styles.activeButton : styles.disabledButton,
                                        styles.button
                                    ] }
                                    onPress={ () => {
                                        if (selectedStatusFilter === 2)
                                        {
                                            setSelectedStatusFilter(null);
                                        } else
                                        {
                                            setSelectedAssignFilter(null);
                                            setSelectedStatusFilter(2);
                                        }
                                    } }
                                >
                                    Delivered
                                </Button>

                                { myRequest ? null : (
                                    <View style={ { flexDirection: "row" } }>
                                        <Button
                                            padding={ 0 }
                                            size={ "md" }
                                            style={ [
                                                selectedAssignFilter === 0 ? styles.activeButton : styles.disabledButton,
                                                styles.button
                                            ] }
                                            onPress={ () => {
                                                if (selectedAssignFilter === 0)
                                                {
                                                    setSelectedAssignFilter(null);
                                                } else
                                                {
                                                    setSelectedStatusFilter(null);
                                                    setSelectedAssignFilter(0);
                                                }
                                            } }
                                        >
                                            No Volunteer
                                        </Button>

                                        <Button
                                            padding={ 0 }
                                            size={ "md" }
                                            style={ [
                                                selectedAssignFilter === 1 ? styles.activeButton : styles.disabledButton,
                                                styles.button
                                            ] }
                                            onPress={ () => {
                                                if (selectedAssignFilter === 1)
                                                {
                                                    setSelectedAssignFilter(null);
                                                } else
                                                {
                                                    setSelectedStatusFilter(null);
                                                    setSelectedAssignFilter(1);
                                                }
                                            } }
                                        >
                                            No Restaurant
                                        </Button>
                                    </View>
                                ) }
                            </ScrollView>
                        </View>

                        <FoodRequestList
                            screen={ 'FoodRequestScreen' }
                            foodRequestData={ foodRequestData }
                            navigation={ navigation }
                        />
                    </>
                ) }
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
    activeButton: {
        width: 100
    },
    disabledButton: {
        backgroundColor: "#9EADB5",
        width: 100
    },
    button: {
        borderRadius: 18, // Rounded corners
        width: 100,
        height: 27,
        fontSize: 14,
        marginLeft: 10,
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

});
