import React, {Component} from 'react';
import { StyleSheet, Text, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

class BarberMenu extends Component {
  render() {
    return (
      <LinearGradient colors={['#fff', '#fff']} style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <Text style={styles.logoText}>Barber Menu Page</Text>
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
    fontSize: 39,
    color: '#000',
    fontWeight: 'bold'
  }
});

export default BarberMenu;
