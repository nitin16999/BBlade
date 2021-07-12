import React, { Component } from "react";
import { View, Image, StyleSheet, StatusBar, Text } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Splash extends Component {

  //Moving to the Main screen After a 2 sec. delay...
  componentDidMount = () => {
    //console.log(useColorScheme())
    setTimeout(async () => {
      let userRole = await AsyncStorage.getItem("@user_role")
      let userId = await AsyncStorage.getItem("@user_id")
      if (userRole && userId) {
        console.log("Available")
        if (userRole == "Customer") {
          this.props.navigation.navigate("CustomerHome")
        } else if (userRole == "Barber") {
          this.props.navigation.navigate("BarberHome")
        } else if (userRole == "Admin") {
          this.props.navigation.navigate("AdminHome")
        }
      }
      else {
        console.log('Not Available')
        this.props.navigation.navigate('Main')
      }
    }, 2000)
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Image style={{ width: 250, height: 250, marginTop: 5 }} source={require("../Img/Logo1.png")} />
        <Text style={styles.logoText}>Barber's Balde</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: hp('92%'),
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#fff"
  },
  logoText: {
    marginVertical: 5,
    fontSize: 35,
    fontWeight: 'bold',
    color: "#000"
  },
});

export default Splash;