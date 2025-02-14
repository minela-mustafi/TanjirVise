import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from 'react-native-gesture-handler'
import { role } from '../utils/constants'

export default function MyProfile ({ myProfile }) {
    return (
        <View style={ styles.container }>
            <ScrollView style={ { width: '100%' } }>
                <View style={ {
                    display: "flex",
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: '#0891B1',
                    borderRadius: 10,
                    padding: 20,
                    backgroundColor: 'rgba(8, 145, 177, 0.02)',
                } }>
                    <View style={ { width: '22%' } }>
                        <Text style={ styles.description }>Name: </Text>
                        <Text style={ styles.description }>Email: </Text>
                        { role[myProfile.role]?.value === "Restaurant"
                            ? < Text style={ styles.description }>Address: </Text>
                            : null
                        }
                        <Text style={ styles.description }>Phone: </Text>
                        <Text style={ styles.description }>Role: </Text>
                    </View>
                    <View style={ { width: '78%' } }>
                        <Text style={ styles.data }>{ myProfile.fullName || myProfile.restaurantName }</Text>
                        <Text style={ styles.data }>{ myProfile.email }</Text>
                        { role[myProfile.role]?.value === "Restaurant"
                            ? <Text style={ styles.data }>{ myProfile.address }</Text>
                            : null
                        }
                        <Text style={ styles.data }>{ myProfile.phone }</Text>
                        <Text style={ styles.data }>{ role[myProfile.role]?.value }</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
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
})
