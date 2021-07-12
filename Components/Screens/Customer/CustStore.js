import React, { Component } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

class CustStore extends Component {
  render() {
    return (
      <LinearGradient colors={['#fff', '#fff']} style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Text style={styles.logoText}>Customer Store Page</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Barbers')}>
          <Text style={{ fontSize: 17, color: '#000', fontWeight: "bold" }}>Select Barber</Text>
        </TouchableOpacity>
      </LinearGradient>
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
    marginVertical: 5,
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold'
  }
});

export default CustStore;
