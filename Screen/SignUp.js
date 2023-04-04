import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { HOST } from '../config/host';

const SignUp = ({ navigation }) => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getSession();
    }, []);

    const getSession = useCallback(() => {
        Keychain.getGenericPassword({ service: "session-user" }).then(res => {
            if (res !== false && res.password !== null) {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            }
        });
    }, [navigation]);

    const onSubmit = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.post(HOST + '/api/v1/auth/sign-up', form);
            if (res.data.status === 201) {
                navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
            }
        } catch (error) {
            console.log(error.response);
        }
        setIsLoading(false);
    }, [form]);

    const onChangeText = (key, value) => {
        setForm({
            ...form,
            [key]: value,
        });
    };

    const renderLoading = () => {
        return (
            <View style={styles.containerLoading}>
                <ActivityIndicator size="large" />
                <Text style={styles.loading}>Loading...</Text>
            </View>
        )
    }

    return (
        <View style={styles.page}>
            {isLoading && renderLoading()}
            <Text style={styles.title}>Sign Up</Text>

            <TextInput placeholder='Username' placeholderTextColor="gray" style={styles.input} keyboardType="twitter" value={form.username} onChangeText={val => onChangeText('username', val)} />
            <TextInput placeholder='Email' placeholderTextColor="gray" style={styles.input} keyboardType="email-address" value={form.email} onChangeText={val => onChangeText('email', val)} />
            <TextInput placeholder='Password' placeholderTextColor="gray" style={styles.input} secureTextEntry value={form.password} onChangeText={val => onChangeText('password', val)} />

            <Pressable style={styles.button} onPress={onSubmit}>
                <Text style={styles.textButton}>Sign Up</Text>
            </Pressable>

            <Text style={styles.textAction} onPress={() => navigation.navigate('SignIn')}>Logged In?</Text>
        </View>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        textAlign: 'center',
        color: '#212121',
        marginBottom: 10,
    },
    input: {
        fontSize: 16,
        borderWidth: 0.5,
        borderColor: 'gray',
        padding: 13,
        marginBottom: 10,
        borderRadius: 10,
    },
    button: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 13,
        backgroundColor: '#FF815E',
        borderRadius: 30,
        marginTop: 30,
    },
    textButton: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    containerLoading: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    loading: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginTop: 10
    },
    textAction: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212131',
        textAlign: 'center',
        marginTop: 20,
    }
});