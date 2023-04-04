import { BackHandler, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RSA } from 'react-native-rsa-native';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import { io } from 'socket.io-client';
import { HOST } from '../config/host';
import Header from '../components/Header';
import ListUserLogin from '../components/ListUserLogin';
import ListRoom from '../components/ListRoom';
import ListMessage from '../components/ListMessage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const ChatRoom = ({ navigation, route }) => {
    const { room, isAdmin, nameRoom } = route.params;
    console.log('cek room id : ', room);
    let socket = useRef();
    let scrollRef = useRef();
    const [currentUser, setCurrentUser] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [arrivalMessage, setArrivalMessage] = useState();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            socket.current = io(HOST);
        }
    }, [isFocused]);

    // useEffect(() => {
    //     socket.current.on('get_user', )
    // }, [])

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (isFocused) {
            getMessage();
        }
    }, [isFocused]);

    useEffect(() => {
        socket.current.on('getMessage', data => {
            setMessages(data);
            scrollRef.current?.scrollToEnd({ animated: true });
        })
    }, [socket]);

    const getMessage = () => {
        Keychain.getGenericPassword({ service: 'session-user' }).then((keys) => {
            // console.log(keys.password);
            const { key } = JSON.parse(keys.password);
            const headers = {
                'Accept': 'application/json',
                Authorization: 'Bearer ' + key
            }
            axios.get(HOST + '/api/v1/message/' + room, { headers }).then(res => {
                console.log(res.data.data);
                setMessages(res.data.data);
            }).catch(err => {
                console.log(err.response.data);
                setMessages([]);
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
                const data = {
                    _id: res.data.data._id,
                    roomId: room,
                }
                socket.current.emit('add_user', data);
            }).catch(err => {
                console.log(err.response.data);
            })
        })
    }

    const sendMessage = () => {
        Keychain.getGenericPassword({ service: 'session-user' }).then((keys) => {
            // console.log(keys.password);
            const { key } = JSON.parse(keys.password);
            const headers = {
                'Accept': 'application/json',
                Authorization: 'Bearer ' + key
            }
            const body = {
                user: currentUser?._id,
                message,
                createdAt: Date.now(),
                room,
            }
            axios.post(HOST + '/api/v1/message/send', body, { headers }).then(res => {
                if (res.data.status === 200) {
                    console.log(res.data);
                    setMessage('');
                    const data = {
                        status: true,
                        roomId: room,
                        sender: currentUser?._id,
                    }
                    socket.current.emit('sendMesssage', data);
                    scrollRef.current.scrollToEnd({ animated: true });
                }
            }).catch(err => {
                console.log(err);
                // set([]);
            })
        })
    }

    const onLogout = async () => {
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

    const { height } = useWindowDimensions();

    const onFocus = () => {
        setIsFocus(true);
        setTimeout(() => {
            scrollRef.current.scrollToEnd({ animated: true });
        }, 500);
    };

    const onBlur = () => {
        setIsFocus(false);
    }

    const onBack = () => {
        socket.current.disconnect();
        navigation.goBack();
    }

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.goBack();
                socket.current.disconnect();
                return true;
            }

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [])
    );

    return (
        <View style={styles.page}>
            <Header title={nameRoom} onPress={onLogout} isBack onPressBack={onBack} />
            <View style={styles.container}>
                <FlatList
                    ref={scrollRef}
                    contentContainerStyle={{ paddingHorizontal: 24, flexGrow: 1, paddingTop: 24, }}
                    data={messages}
                    keyExtractor={(item, index) => item.createdAt}
                    renderItem={({ item }) => {
                        return (
                            <ListMessage isMe={item.user._id === currentUser?._id} message={item.message} name={item.user.username} isAdmin={item.user._id === isAdmin ? 'Admin' : ''} />
                        )
                    }}
                />
                <KeyboardAvoidingView shouldRasterizeIOS behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ height: Platform.OS === 'ios' ? isFocus ? height * 0.5 : 'auto' : 'auto' }}>
                    <View style={[styles.row, styles.inputContainer]}>
                        <TextInput value={message} onChangeText={(val) => setMessage(val)} placeholder='Coba input' placeholderTextColor="black" style={styles.input} onFocus={onFocus} onBlur={onBlur} onSubmitEditing={() => null} />
                        <Pressable style={styles.btnSend} onPress={sendMessage}>
                            <Text style={styles.textButton}>Send</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </View >
    )
}

export default ChatRoom;

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
    inputContainer: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    btnSend: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 13,
        backgroundColor: '#FF815E',
        borderRadius: 10,
        paddingHorizontal: 20,
    },
    input: {
        paddingVertical: Platform.OS === 'android' ? 10 : 13,
        backgroundColor: '#f4f4f4',
        borderRadius: 10,
        paddingHorizontal: 20,
        flex: 1,
        marginRight: 10
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