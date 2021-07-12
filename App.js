import React from "react";
//import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Splash from "./Components/Screens/Splash";
import Main from "./Components/Screens/Main";
import SignUp from "./Components/Screens/SignUp";
import Login from "./Components/Screens/Login";
import Reset from "./Components/Screens/ResetPassword";
import AdminHome from "./Components/Screens/Admin/AdminHome";
import BarberHome from "./Components/Screens/Barber/BarberHome";
import CustHome from "./Components/Screens/Customer/CustHome";

const Stack = createStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash' screenOptions={{ ...TransitionPresets.FadeFromBottomAndroid }}>

        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />

        <Stack.Screen name="Main" component={Main} options={{
          headerLeft: null, headerStyle: { backgroundColor: '#fff' },
          title: "Welcome", headerTitleStyle: { fontSize: 25 }, headerTintColor: '#000'
        }} />

        <Stack.Screen name="Login" component={Login} options={{
          headerStyle: { backgroundColor: '#fff' },
          title: 'Login', headerTitleStyle: { fontSize: 25 }, headerTintColor: '#000'
        }}
          screenOptions={{ gestureEnabled: true, gestureDirection: 'horizontal' }} />

        <Stack.Screen name="Reset" component={Reset} options={{
          headerStyle: { backgroundColor: '#fff' },
          title: 'Reset Password', headerTitleStyle: { fontSize: 25 }, headerTintColor: '#000'
        }}
          screenOptions={{ gestureEnabled: true, gestureDirection: 'horizontal' }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{
          headerStyle: { backgroundColor: '#fff' },
          title: 'SignUp', headerTitleStyle: { fontSize: 25 }, headerTintColor: '#000'
        }}
          screenOptions={{ gestureEnabled: true, gestureDirection: 'horizontal' }} />

        <Stack.Screen name="CustomerHome" component={CustHome} options={{
          headerLeft: null, headerStyle: { backgroundColor: '#fff' },
          title: "Barber's Balde", headerTitleStyle: { fontSize: 25 }, headerTintColor: '#000'
        }}
          screenOptions={{ gestureEnabled: true, gestureDirection: 'horizontal' }} />

        <Stack.Screen name="BarberHome" component={BarberHome} options={{
          headerLeft: null, headerStyle: { backgroundColor: '#fff' },
          title: "Barber's-Blade", headerTitleStyle: { fontSize: 25 }, headerTintColor: '#000'
        }}
          screenOptions={{ gestureEnabled: true, gestureDirection: 'horizontal' }} />

        <Stack.Screen name="AdminHome" component={AdminHome} options={{
          headerLeft: null, headerStyle: { backgroundColor: '#fff' },
          title: "Barber's-Blade", headerTitleStyle: { fontSize: 25 }, headerTintColor: '#000'
        }}
          screenOptions={{ gestureEnabled: true, gestureDirection: 'horizontal' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );

}

export default App;