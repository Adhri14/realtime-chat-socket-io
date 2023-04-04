import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { RSA } from 'react-native-rsa-native';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import { io } from 'socket.io-client';
import { HOST } from '../config/host';
import Header from '../components/Header';
import ListUserLogin from '../components/ListUserLogin';
import ListRoom from '../components/ListRoom';
import { useIsFocused } from '@react-navigation/native';

const Home = ({ navigation }) => {
    let socket = useRef();
    const [currentUser, setCurrentUser] = useState();
    const [rooms, setRooms] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            socket.current = io(HOST);
            getRoom();
            getUser();
        }
    }, [isFocused]);

    useEffect(() => {
        if (refreshing) {
            getRoom();
        }
    }, [refreshing]);

    const deleteRoom = (id) => {
        Keychain.getGenericPassword({ service: 'session-user' }).then((keys) => {
            // console.log(keys.password);
            const { key } = JSON.parse(keys.password);
            const headers = {
                'Accept': 'application/json',
                Authorization: 'Bearer ' + key
            }
            axios.delete(HOST + '/api/v1/room/delete/' + id, { headers }).then(res => {
                if (res.data.status === 200) {
                    getRoom();
                }
            }).catch(err => {
                console.log(err.response.data);
                setRooms([]);
            })
        })
    }

    const showAlert = (id) => {
        Alert.alert('Perhatian', 'Apakah anda ingin menghapus room ini?', [{ text: 'cancel', onPress: () => null, }, { text: 'Ok', onPress: () => deleteRoom(id) }])
    }

    const getRoom = () => {
        Keychain.getGenericPassword({ service: 'session-user' }).then((keys) => {
            // console.log(keys.password);
            const { key } = JSON.parse(keys.password);
            const headers = {
                'Accept': 'application/json',
                Authorization: 'Bearer ' + key
            }
            axios.get(HOST + '/api/v1/room', { headers }).then(res => {
                setRooms(res.data.data);
                setRefreshing(false);
                console.log(res.data.data);
            }).catch(err => {
                console.log(err.response.data);
                setRooms([]);
                setRefreshing(false);
            })
        })
    }

    const getUser = () => {
        Keychain.getGenericPassword({ service: 'session-user' }).then((keys) => {
            // console.log(keys.password);
            const { key } = JSON.parse(keys.password);
            const headers = {
                'Accept': 'application/json',
                Authorization: 'Bearer ' + key
            }
            axios.get(HOST + '/api/v1/auth/user', { headers }).then(res => {
                setCurrentUser(res.data.data);
            }).catch(err => {
                console.log(err);
                console.log(err.response.data);
            })
        })
    }

    const onSubmit = async () => {
        Keychain.getGenericPassword({ service: 'session-user' }).then((keys) => {
            const { key } = JSON.parse(keys.password);
            console.log('cek key : ', key);
            const headers = {
                'Accept': 'application/json',
                Authorization: 'Bearer ' + key
            }
            axios.post(HOST + '/api/v1/auth/logout', {}, { headers }).then(res => {
                Keychain.resetGenericPassword({ service: 'session-user' }).then(() => {
                    navigation.replace('SignIn');
                    socket.current.disconnect();
                })
            }).catch(err => {
                console.log(err.response);
            })
        })
    }

    const componentHeader = () => {
        return (
            <View style={styles.row}>
                <Text style={styles.title}>Users</Text>
                <Pressable style={styles.btnAdd} onPress={() => navigation.navigate('CreateRoom')}>
                    <Text style={styles.add}>Add room</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <View style={styles.page}>
            <Header title="Home" onPress={onSubmit} />
            <View style={styles.container}>
                <FlatList
                    refreshing={refreshing}
                    onRefresh={() => setRefreshing(true)}
                    contentContainerStyle={{ paddingHorizontal: 24, flexGrow: 1 }}
                    ListHeaderComponent={componentHeader()}
                    data={rooms}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) =>
                        <ListRoom

                            name={item.name}
                            description={item.description}
                            username={item.adminRoom.username}
                            onLongPress={() => showAlert(item._id)}
                            onPress={() => navigation.navigate('ChatRoom', { room: item._id, isAdmin: item.adminRoom._id, nameRoom: item.name })} />
                    }
                />
            </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
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
    }
})