import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { HOST } from '../config/host';

const SignIn = ({ navigation }) => {
    const [form, setForm] = useState({
        username: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(async () => {
        setIsLoading(true);
        axios.post(HOST + '/api/v1/auth/sign-in', form).then(res => {
            if (res.data.status === 200) {
                console.log('res : ', res.data);
                Keychain.setGenericPassword(form.username, JSON.stringify({ key: res.data.data }), {
                    service: 'session-user',
                    securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE || null,
                    authenticationPrompt: null,
                    storage: Keychain.STORAGE_TYPE.AES || null
                }).then(() => {
                    setIsLoading(false);
                    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
                })
            }
        }).catch(err => {
            console.log(err.response.data);
            setIsLoading(false);
        });
    }, [navigation, form]);

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
            <Text style={styles.title}>Sign In</Text>

            <TextInput placeholder='Username' placeholderTextColor="gray" style={styles.input} keyboardType="twitter" value={form.username} onChangeText={val => onChangeText('username', val)} />
            <TextInput placeholder='Password' placeholderTextColor="gray" style={styles.input} secureTextEntry value={form.password} onChangeText={val => onChangeText('password', val)} />

            <Pressable style={styles.button} onPress={onSubmit}>
                <Text style={styles.textButton}>Sign In</Text>
            </Pressable>

            <Text style={styles.textAction} onPress={() => navigation.navigate('SignUp')}>Create user?</Text>
        </View>
    );
};

export default SignIn;

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