import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const Header = ({ onPress, title, isBack = false, onPressBack }) => {
    return (
        <View style={styles.container}>
            {isBack && <Pressable onPress={onPressBack} style={[styles.box, { width: 'auto' }]}>
                <Text style={styles.textButton}>Back</Text>
            </Pressable>}
            <Text style={styles.textHeader}>{title}</Text>
            <Pressable onPress={onPress} style={[styles.box, { width: 'auto' }]}>
                <Text style={styles.textButton}>Logout</Text>
            </Pressable>
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 13,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingHorizontal: 24,
    },
    box: {
        width: 50,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHeader: {
        fontSize: 16,
        color: '#242423',
        fontWeight: '600',
    },
    textButton: {
        fontSize: 12,
        color: 'red',
        fontWeight: '600',
    },
});