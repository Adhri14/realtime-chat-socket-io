import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ListMessage({ isMe, message, name, isAdmin }) {
    return (
        <View style={isMe ? styles.container : styles.containerOther}>
            <Text style={styles.username}>{name} {isAdmin}</Text>
            <Text style={styles.textMessage}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        maxWidth: '80%',
        minWidth: '30%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        borderTopRightRadius: 12,
        backgroundColor: "#2B2844",
        alignSelf: 'flex-end',
        marginBottom: 20
    },
    containerOther: {
        minWidth: '30%',
        maxWidth: '80%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderTopRightRadius: 12,
        backgroundColor: "#252836",
        alignSelf: 'flex-start',
        marginBottom: 20
    },
    textMessage: {
        color: 'white',
    },
    username: {
        fontSize: 10,
        fontWeight: '600',
        color: 'white',
        fontStyle: 'italic',
        marginBottom: 5,
    }
});