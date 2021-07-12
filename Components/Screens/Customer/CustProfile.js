import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustProfile = (props) => {
  const [uid, setuid] = useState(null)
  const [urole, seturole] = useState(null)
  useEffect(() => {
    console.log("useEffect called")
    getAsyncData()
  }, []);

  async function getAsyncData() {
    const userRole = await AsyncStorage.getItem('@user_role')
    const userId = await AsyncStorage.getItem('@user_id')
    setuid(userId)
    seturole(userRole)
    if (userRole == "Customer") {
      firestore().collection(userRole).doc(userId).get().then(doc => {
        console.log(doc.data().name)
        console.log(doc.data().email)
        console.log(doc.data().phone)
      })
    }

  }

  async function Logout() {
    Alert.alert(
      'Logout',
      'Logout from the account?', [{
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: 'Ok',
        onPress: () => auth().signOut().then(async () => {
          await AsyncStorage.removeItem('@user_role');
          await AsyncStorage.removeItem("@user_id")
          props.navigation.navigate('Main')
        })
          .catch((error) => Alert.alert("Logout Failed", error.message))
      },], {
      cancelable: false
    }
    )
  }



  return (
    <LinearGradient colors={['#fff', '#fff']} style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Text style={styles.logoText}>Customer Profile Page</Text>
      <TouchableOpacity onPress={() => Logout()}>
        <Text style={{ fontSize: 17, color: '#000', fontWeight: "bold" }}>Log out</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

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

export default CustProfile;

