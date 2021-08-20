import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Customer from "./Customer"
import CustHistory from "./CustHistory"
import CustProfile from "./CustProfile"
const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Book"
      activeColor="#fff"
      inactiveColor="#000"
      barStyle={{ backgroundColor: '#000' }}
      shifting = {true}
    >
      <Tab.Screen
        name="Book"
        component={Customer}
        options={{
          gestureEnabled: true, gestureDirection: 'horizontal',
          tabBarLabel: 'Book',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="storefront" color={"#fff"} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={CustHistory}
        options={{
          gestureEnabled: true, gestureDirection: 'horizontal',
          tabBarLabel: 'History',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="book-open" color={"#fff"} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={CustProfile}
        options={{
          gestureEnabled: true, gestureDirection: 'horizontal',
          tabBarLabel: 'Profile',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="account" color={"#fff"} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

class CustomerHome extends Component {

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

export default CustomerHome;
