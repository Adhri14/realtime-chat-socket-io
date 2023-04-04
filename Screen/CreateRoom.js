import { FlatList, Pressable, StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RSA } from 'react-native-rsa-native';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import { io } from 'socket.io-client';
import { HOST } from '../config/host';
import Header from '../components/Header';
import ListUserLogin from '../components/ListUserLogin';
import ListRoom from '../components/ListRoom';

const CreateRoom = ({ navigation }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        adminRoom: '',
    });

    useEffect(() => {
        getUser();
    }, [])

    const getUser = () => {
        Keychain.getGenericPassword({ service: 'session-user' }).then((keys) => {
            // console.log(keys.password);
            const { key } = JSON.parse(keys.password);
            const headers = {
                'Accept': 'application/json',
                Authorization: 'Bearer ' + key
            }
            axios.get(HOST + '/api/v1/auth/user', { headers }).then(res => {
                setForm({ ...form, adminRoom: res.data.data })
            }).catch(err => {
                console.log(err.response.data);
            })
        })
    }

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(() => {
        setIsLoading(true);

        Keychain.getGenericPassword({ service: 'session-user' }).then((keys) => {
            // console.log(keys.password);
            const { key } = JSON.parse(keys.password);
            const headers = {
                'Accept': 'application/json',
                Authorization: 'Bearer ' + key
            }
            console.log(headers);
            axios.post(HOST + '/api/v1/room/create', form, { headers }).then(res => {
                if (res.data.status === 200) {
                    console.log('res : ', res.data);
                    if (res.status === 200) {
                        navigation.goBack();
                    }
                }
            }).catch(err => {
                console.log(err.response.data);
                setIsLoading(false);
            });
        })
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
            <Header title="Add Room" />
            <View style={styles.container}>
                <TextInput placeholder='Nama room' placeholderTextColor="gray" style={styles.input} keyboardType="twitter" value={form.name} onChangeText={val => onChangeText('name', val)} />
                <TextInput placeholder='Deskripsi room' placeholderTextColor="gray" style={styles.input} value={form.description} onChangeText={val => onChangeText('description', val)} />

                <Pressable style={styles.button} onPress={onSubmit}>
                    <Text style={styles.textButton}>Create Room</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default CreateRoom;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    image: {
        width: 270,
        height: 390,
        alignSelf: 'center'
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: "#CBCCD5",
        marginBottom: 4,
        marginTop: 50,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#212131',
    },
    button: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 13,
        backgroundColor: '#FF815E',
        borderRadius: 30,
    },
    textButton: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15
    },
    btnAdd: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    add: {
        color: '#242423',
        fontWeight: '600',
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
})