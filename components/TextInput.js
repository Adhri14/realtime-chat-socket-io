import React from "react";
import { View, Text, StyleSheet, TextInput as TextInputNative } from "react-native";

export default function TextInput() {
    return (
        <View>
            <Text>lable</Text>
            <TextInputNative placeholder="asdasd" />
        </View>
    );
}

const styles = StyleSheet.create({});