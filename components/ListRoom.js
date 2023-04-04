import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function ListRoom({ name, description, username, onPress, onLongPress }) {
    return (
        <Pressable onPress={onPress} style={styles.container} onLongPress={onLongPress}>
            <View style={styles.wrapper}>
                <Text numberOfLines={1} style={styles.name}>{name}</Text>
                <Text numberOfLines={1} style={styles.desc}>{description}</Text>
            </View>
            <Text style={styles.admin}>Admin : {username}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    wrapper: {
        flex: 1,
        marginRight: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#242324',
        marginBottom: 6,
    },
    desc: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7b7b7b',
    },
    desc: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7b7b7b',
    }
});