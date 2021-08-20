import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Service from "./AdminService"
import Barber from "./AdminBarber"
import Profile from "./AdminProfile"
import Schedule from "./Schedule"
const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Schedule"
      activeColor="#fff"
      inactiveColor="#000"
      barStyle={{ backgroundColor: '#000' }}
    >
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        options={{
          tabBarLabel: ' Schedule',
          tabBarIcon: () => (
            <MaterialIcons name="schedule" color={"#fff"} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Service"
        component={Service}
        options={{
          tabBarLabel: 'Service',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="book-open" color={"#fff"} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Barber"
        component={Barber}
        options={{
          tabBarLabel: '   Barber',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="account-plus" color={"#fff"} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ' Profile',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="account" color={"#fff"} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

class AdminHome extends Component {

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = () => {
    BackHandler.exitApp();
  };
  render() {
    return (
      <MyTabs />
    );
  }
}

export default AdminHome;
