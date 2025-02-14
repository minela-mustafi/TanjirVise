import React from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Platform } from "react-native";
import { requestStatus } from "../utils/constants";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const shadow = Platform.select({
    ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    android: {
        elevation: 8,
    },
});
export default function FoodRequestList ({ screen, foodRequestData, navigation }) {


    const foodRequestItem = ({ item, index }) => {
        return (
            <View style={ [styles.shadowContainer, shadow, foodRequestData.length - 1 === index ? { marginBottom: 40 } : null] }>
                <TouchableWithoutFeedback
                    style={ [styles.listings, { backgroundColor: "white", height: 90 }] }
                    onPress={ () => navigation.navigate(screen, { id: item.id }) }
                >
                    <View style={ { width: '100%', display: 'flex', flexDirection: 'row' } }>
                        <View style={ { width: '25%' } }>
                            <Text style={ styles.description }>Location:{ " " }</Text>
                            <Text style={ styles.description }>Quantity:{ " " }</Text>
                            <Text style={ styles.description }>Status:{ " " }</Text>
                        </View>
                        <View style={ { width: '75%' } }>
                            <Text style={ styles.data }>{ item.destination }</Text>
                            <Text style={ styles.data }>{ item.quantity }</Text>
                            <Text style={ styles.data }>{ requestStatus[item.status]?.value }</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    return (
        <FlatList
            contentContainerStyle={ {
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 20
            } }
            style={ { width: "100%" } }
            data={ foodRequestData }
            renderItem={ foodRequestItem }
            keyExtractor={ (item) => item.id }
        />
    );
}

const styles = StyleSheet.create({
    listings: {
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 20,
        borderColor: '#0891B1',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        // Removed shadow styles (handled with elevation for Android)
    },
    shadowContainer: { // Stil za vanjski View koji drži sjenu
        width: "95%",
        height: 90,
        marginBottom: 20,
        borderRadius: 10,
    },
    data: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontStyle: 'italic',
    },
    description: {
        color: "#0891B1",
        fontWeight: "500",
        fontStyle: "normal",
        fontSize: 16,
    },
});
