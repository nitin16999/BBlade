import React, { Component } from 'react';
import { StyleSheet, Text, StatusBar, View, TouchableOpacity, Image, BackHandler, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused } from "@react-navigation/native"

function Main(props) {
  const isFocused = useIsFocused();
  return <Project {...props} isFocused={isFocused} />;
}

class Project extends Component {

  backAction = () => {
    const { isFocused } = this.props;
    //console.log(isFocused);
    if (isFocused) {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Image style={{ width: 250, height: 250, marginTop: 5 }} source={require("../Img/Logo1.png")} />
        <Text style={styles.logoText}>Barber's Balde</Text>

        <TouchableOpacity style={styles.button}
          onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
          onPress={() => this.props.navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>SignUp</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 19, fontWeight: "bold", marginBottom: 40, marginTop: 10, color: "#000" }}>Don't have an account yet?</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: hp('92%'),
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  logoText: {
    marginStart: 5,
    marginBottom: 100,
    fontSize: 35,
    fontWeight: 'bold',
    color: "#000"
  },
  button: {
    width: wp('65%'),
    backgroundColor: '#000',
    borderRadius: 25,
    marginTop: 50,
    paddingVertical: 12,
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  }
});

export default Main;


