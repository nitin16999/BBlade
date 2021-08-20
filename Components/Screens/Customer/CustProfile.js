import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, Alert, View, ScrollView, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview';
import LinearGradient from 'react-native-linear-gradient';
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustProfile = (props) => {
  const [uid, setuid] = useState(null)
  const [urole, seturole] = useState(null)
  const [nameText, setnameText] = useState("") //used for update the name data
  const [phoneText, setphoneText] = useState("")//used for update the phone data
  const [name, setname] = useState(null)//name data from database
  const [email, setemail] = useState(null)//email data from database
  const [phoneNo, setphoneNo] = useState(null)//phone no data from database
  const [userData, setuserData] = useState(true)//used for hide or show the update option
  useEffect(() => {
    getAsyncData()
  }, []);

  async function getAsyncData() {
    const userRole = await AsyncStorage.getItem('@user_role')
    const userId = await AsyncStorage.getItem('@user_id')
    setuid(userId)
    seturole(userRole)
    if (userRole == "Customer") {
      firestore().collection(userRole).doc(userId).get().then(doc => {
        setname(doc.data().name)
        setemail(doc.data().email)
        setphoneNo(doc.data().phone)

      })
    }
  }

  // This function used for log out the user out of the application and deleted the local storage 
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

  //Cancle the update process
  function cancle() {
    setnameText(null)
    setphoneText(null)
    setuserData(true)
  }

  //this function is used for validation of the name textinput
  function nameValidate() {
    var v = nameText
    var regex = /^[A-Za-z ]+$/;
    if (v != '') {
      if (regex.test(v) != true) { return false }
      else { return true }
    } else { return false }
  }
  //this function is used for validation of the phone textinput
  function phoneValidate() {
    var v = phoneText
    if (v != '') {
      var regex = /^[0-9]{10}$/;
      if (regex.test(v) != true) { return false }
      else { return true }
    } else { return false }
  }
  //Function is used for update the data in the firestore database 
  async function updateData() {
    if (nameValidate()) {
      if (phoneValidate()) {
        firestore().collection(urole).doc(uid).update({
          name: nameText,
          phone: phoneText
        }).then(
          setnameText(null),
          setphoneText(null),
          Alert.alert("Update Successfull", "Name & Phone No Updated!"),
          getAsyncData(),
          setuserData(true)
        ).catch((error) => {
          Alert.alert("Update Failed", error.message)
        })
      } else {
        Alert.alert("Enter Valid Input", "Please enter correct phone no")
      }
    } else {
      Alert.alert("Enter Valid Input", "Please enter correct name")
    }
  }


  // Component created to display the user data and it is called in the main return function
  const Info = () => {
    return (
      <>
        <View style={{ flexDirection: "row" }} >
          <Text style={{ color: "#000", fontSize: 25 }}>Welcome </Text>
          <Text style={{ color: "#000", fontWeight: "bold", fontSize: 25 }}>{name}</Text>
        </View >
        <Text style={{ color: "#000", fontSize: 10 }}>__________________________________________________________________________________________</Text>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <Text style={{ color: "#000", fontSize: 20 }}>Email: </Text>
          <Text style={{ color: "#000", fontWeight: "bold", fontSize: 20 }}>{email}</Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <Text style={{ color: "#000", fontSize: 20 }}>Phone number: </Text>
          <Text style={{ color: "#000", fontWeight: "bold", fontSize: 20 }}>{phoneNo}</Text>
        </View>
        <TouchableOpacity style={{ width: wp('34%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 10, alignSelf: 'center', marginTop: 30 }} onPress={() => { setuserData(false) }}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: 'center' }}>Edit Profile</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <LinearGradient colors={['#f1f1f1', '#fff']} style={styles.container} >

          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <Text style={styles.logoText}>Profile Page</Text>

          <CardView
            //flex={1}
            cardElevation={10}
            cornerRadius={40}
            style={{
              width: wp("93%"),
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
              marginTop: 120,
              marginBottom: 160
            }}>
            {userData ? <Info /> :
              <View>
                <TextInput style={styles.inputBox}
                  placeholder="Edit Name"
                  placeholderTextColor="#000"
                  selectionColor="#D0D0D0"
                  color="#000"
                  keyboardType='default'
                  onChangeText={nameText => setnameText(nameText)}
                  defaultValue={nameText}
                />
                <TextInput style={styles.inputBox}
                  placeholder="Edit Phone Number"
                  placeholderTextColor="#000"
                  selectionColor="#D0D0D0"
                  color="#000"
                  keyboardType='phone-pad'
                  onChangeText={phoneText => setphoneText(phoneText)}
                  defaultValue={phoneText}
                />

                <View flexDirection="row" style={{ justifyContent: "center" }}>
                  <TouchableOpacity style={{ width: wp('34%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 10, alignSelf: 'center', marginTop: 30, marginRight: 20 }} onPress={() => cancle()}>
                    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: 'center' }}>Cancle</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: wp('34%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 10, alignSelf: 'center', marginTop: 30 }} onPress={() => updateData()}>
                    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: 'center' }}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>}
          </CardView>

          <TouchableOpacity style={styles.button} onPress={() => Logout()}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>

        </LinearGradient >
      </View>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    height: hp('86%'),
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  logoText: {
    marginBottom: 10,
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
    textShadowColor: '#d1d1d1',
    textShadowOffset: { width: 1, height: 4 },
    textShadowRadius: 5
  },
  button: {
    width: wp('50%'),
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 12,
    alignSelf: 'center',
    marginTop: 0
  },
  buttonText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  inputBox: {
    width: wp('84%'),
    backgroundColor: 'rgba(40, 40,40,0.15)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 17,
    marginTop: 14
  },
});

export default CustProfile;


// 

