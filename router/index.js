import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ChatRoom from '../Screen/ChatRoom';
import CreateRoom from '../Screen/CreateRoom';
import Home from '../Screen/Home';
import SignIn from '../Screen/SignIn';
import SignUp from '../Screen/SignUp';

const Stack = createStackNavigator();

const Router = () => {
    return (
        <Stack.Navigator screenOptions={{ header: () => null }}>
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="CreateRoom" component={CreateRoom} />
            <Stack.Screen name="ChatRoom" component={ChatRoom} />
        </Stack.Navigator>
    );
};

export default Router;