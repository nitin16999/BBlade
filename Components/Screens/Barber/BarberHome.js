import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BarberMenu from "./BarberMenu"
import BarberProfile from "./BarberProfile"
const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Menu"
      activeColor="#fff"
      inactiveColor="#000"
      barStyle={{ backgroundColor: '#000' }}
      shifting={true}
    >
      <Tab.Screen
        name="Menu"
        component={BarberMenu}
        options={{
          tabBarLabel: 'Work',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="book-open" color={"#fff"} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={BarberProfile}
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

class BarberHome extends Component {

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

export default BarberHome;
