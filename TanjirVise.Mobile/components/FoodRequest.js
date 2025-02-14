import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from 'react-native-gesture-handler'
import { requestStatus } from '../utils/constants'

export default function FoodRequest ({ foodRequest }) {
    return (
        <View style={ styles.container }>
            <ScrollView style={ { width: "100%" } }>
                <View style={ {
                    display: "flex",
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: '#0891B1',
                    borderRadius: 10,
                    padding: 20,
                    backgroundColor: 'rgba(8, 145, 177, 0.02)',
                } }>
                    <View style={ { width: '35%' } }>
                        <Text style={ styles.description }>Requested by: </Text>
                        <Text style={ styles.description }>Location: </Text>
                        <Text style={ styles.description }>Quantity: </Text>
                        <Text style={ styles.description }>Status: </Text>
                        <Text style={ styles.description }>Volunteer: </Text>
                        <Text style={ styles.description }>Restaurant: </Text>
                        <Text style={ styles.description }>Note: </Text>
                    </View>
                    <View style={ { width: '65%' } }>
                        <Text style={ styles.data }>{ foodRequest.userName }</Text>
                        <Text style={ styles.data }>{ foodRequest.destination }</Text>
                        <Text style={ styles.data }>{ foodRequest.quantity }</Text>
                        <Text style={ styles.data }>{ requestStatus[foodRequest.status]?.value }</Text>
                        <Text style={ styles.data }>{ foodRequest.volunteerName || "-" }</Text>
                        <Text style={ styles.data }>{ foodRequest.restaurantName || "-" }</Text>
                        <Text style={ styles.data }>{ foodRequest.note || "-" }</Text>
                    </View>
                </View>
            </ScrollView>
        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'left',
        width: "100%"
    },
    data: {
        flex: 1,
        fontStyle: 'italic',
        fontSize: 16,
        paddingLeft: 10,
    },
    description: {
        color: "#0891B1",
        fontWeight: "500",
        paddingBottom: 4,
        fontStyle: "normal",
        fontSize: 17,
    }
});
