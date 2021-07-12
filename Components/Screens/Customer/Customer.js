import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import CustStore from "./CustStore"
import CustBarber from "./CustBarber"
import Booking from "./Booking"

const Stack = createStackNavigator();

const Customer = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName='CustStore' screenOptions={{ ...TransitionPresets.FadeFromBottomAndroid }}>
                <Stack.Screen name="CustStore" component={CustStore} options={{ headerShown: false }} />
                <Stack.Screen name="Barbers" component={CustBarber} options={{ headerShown: false }} />
                <Stack.Screen name="Booking" component={Booking} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Customer;