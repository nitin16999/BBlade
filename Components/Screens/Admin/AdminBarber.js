import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, ScrollView, Alert, View, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import CardView from 'react-native-cardview';
import firestore from "@react-native-firebase/firestore"
import AsyncStorage from '@react-native-async-storage/async-storage';


const AdminBarber = () => {
  useEffect(() => {
    getData()
  }, [])

  const [allBarberScreen, setallBarberScreen] = useState(false)
  const [addBarberScreen, setaddBarberScreen] = useState(true)
  const [statScreen, setstatScreen] = useState(false)
  const [barberName, setbarberName] = useState('')
  const [barberNumber, setbarberNumber] = useState('')
  const [barberEMail, setbarberEMail] = useState('')
  const [barbers, setbarbers] = useState([])


  function clearFields() {
    setbarberEMail(null)
    setbarberName(null)
    setbarberNumber(null)
  }

  function nameValidate() {
    var v = barberName
    var regex = /^[A-Za-z ]+$/;
    if (v != '') {
      if (regex.test(v) != true) { return false }
      else { return true }
    } else { return false }
  }
  function phoneValidate() {
    var v = barberNumber
    if (v != '') {
      var regex = /^[0-9]{10}$/;
      if (regex.test(v) != true) { return false }
      else { return true }
    } else { return false }
  }
  function emailValidate() {
    var v = barberEMail
    if (v != '') {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (regex.test(v) != true) { return false }
      else { return true }
    } else { return false }
  }

  async function addBarber() {
    if (nameValidate()) {
      if (phoneValidate()) {
        if (emailValidate()) {
          const userRole = await AsyncStorage.getItem('@user_role')
          if (userRole == "Admin") {
            const service = await firestore().collection("Barber").where("email", "==", barberEMail).get();
            if (service.empty) {
              firestore().collection("Barber").doc(barberEMail).set({
                name: barberName,
                phone: barberNumber,
                email: barberEMail
              }).then(
                Alert.alert("Process Completed", "New barber " + barberName + " is added to the barber's list."),
                clearFields(),
                getData()
              ).catch((error) => { Alert.alert("Something went wrong", error.message) })
            } else { Alert.alert("Process Failed!", "Barber With the same Email is already exist") }
          } else { Alert.alert("Something went wrong", "This account Don't have the premission to add services.") }
        } else { Alert.alert("Process Failed!", "Enter correct email address.") }
      } else { Alert.alert("Process Failed!", "Enter correct phone number.") }
    } else { Alert.alert("Process Failed!", "Enter correct name.") }
  }

  async function getData() {
    await firestore().collection("Barber").onSnapshot(snapshot => {
      setbarbers(snapshot.docs.map(doc => doc.data()))
    })
  }

  return (
    <LinearGradient colors={['#f1f1f1', '#fff']} style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <ScrollView nestedScrollEnabled={true}>
        {allBarberScreen ?
          //showing all the Barber code is from here......................................... 
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#000", fontWeight: "bold", fontSize: 30 }}>All Barber</Text>
            <CardView
              flex={1}
              cardElevation={10}
              cornerRadius={40}
              style={{
                width: wp("94%"),
                height: hp("65%"),
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 0,
                marginVertical: 25,
                backgroundColor: "#D9D9D9"
              }}>
              <ScrollView nestedScrollEnabled={true}>
                {
                  barbers.map((value) => {
                    return (
                      <CardView
                        flex={1}
                        cardElevation={10}
                        cornerRadius={40}
                        style={{
                          width: wp("80%"),
                          height: hp("20%"),
                          justifyContent: "center",
                          alignItems: "center",
                          paddingVertical: 0,
                          marginVertical: 25,
                          marginHorizontal: 8,
                          backgroundColor: "#fff"
                        }}>
                        <Text style={{ color: "#000", fontSize: 24, fontWeight: "bold" }}>{value.name}</Text>
                        <Text style={{ color: "#000", fontSize: 10 }}>______________________________________________________________________</Text>
                        <View flexDirection="row">
                          <Text style={{ color: "#000", fontSize: 22 }}>Phone no: </Text>
                          <Text style={{ color: "#000", fontSize: 22, fontWeight: "bold" }}>{value.phone}</Text>
                        </View>
                        <View flexDirection="row">
                          <Text style={{ color: "#000", fontSize: 22 }}>Email: </Text>
                          <Text style={{ color: "#000", fontSize: 22, fontWeight: "bold" }}>{value.email}</Text>
                        </View>
                        <View>
                          <TouchableOpacity style={{ width: wp('24%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 8, alignSelf: 'center', marginTop: 20, marginHorizontal: 15 }} onPress={() => deleteData(value.name)}>
                            <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold', textAlign: "center" }} >Delete</Text>
                          </TouchableOpacity>
                        </View>

                      </CardView>
                    )
                  })
                }
              </ScrollView>
            </CardView>

            <View flexDirection="row" style={{ justifyContent: "center" }}>
              <TouchableOpacity style={styles.button} onPress={() => { setaddBarberScreen(true), setallBarberScreen(false), setstatScreen(false) }}>
                <Text style={styles.buttonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>



          //Adding new Barber code is from here........................................................
          : addBarberScreen ?
            <View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#000", fontWeight: "bold", fontSize: 30, marginTop: 20, marginBottom: 40 }}>Add new Barber</Text>
                <CardView
                  flex={1}
                  cardElevation={10}
                  cornerRadius={40}
                  style={{
                    width: wp("96%"),
                    height: hp("45%"),
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 0,
                    marginTop: 25,
                    backgroundColor: "#fff",
                    marginHorizontal: 8,
                    marginBottom: 60
                  }}>
                  {/* Barber name textbox  */}
                  <View flexDirection="row" style={{ justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
                    <Text style={{ color: "#000", fontSize: 19, fontWeight: "bold", paddingLeft: 26 }}>Barber name:</Text>
                    <TextInput style={styles.inputBox}
                      placeholder="here..."
                      placeholderTextColor="#000"
                      selectionColor="#D0D0D0"
                      color="#000"
                      keyboardType='default'
                      onChangeText={barberName => setbarberName(barberName)}
                      defaultValue={barberName}
                    />
                  </View>
                  {/* Barber phone number textbox  */}
                  <View flexDirection="row" style={{ justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
                    <Text style={{ color: "#000", fontSize: 19, fontWeight: "bold" }}>Barber phone no:</Text>
                    <TextInput style={styles.inputBox}
                      placeholder="here..."
                      placeholderTextColor="#000"
                      selectionColor="#D0D0D0"
                      color="#000"
                      keyboardType='phone-pad'
                      onChangeText={barberNumber => setbarberNumber(barberNumber)}
                      defaultValue={barberNumber}
                    />
                  </View>
                  {/* Barber email textbox  */}
                  <View flexDirection="row" style={{ justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
                    <Text style={{ color: "#000", fontSize: 19, fontWeight: "bold", paddingLeft: 26 }}>Barber email:</Text>
                    <TextInput style={styles.inputBox}
                      placeholder="here..."
                      placeholderTextColor="#000"
                      selectionColor="#D0D0D0"
                      color="#000"
                      keyboardType='email-address'
                      onChangeText={barberEMail => setbarberEMail(barberEMail)}
                      defaultValue={barberEMail}
                    />
                  </View>

                  <Text style={{ color: "#000", fontSize: 10 }}>__________________________________________________________________________________________</Text>
                  <View flexDirection="row" style={{ justifyContent: "center", paddingTop: 20 }}>
                    <TouchableOpacity style={styles.button1} onPress={() => clearFields()}>
                      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: 'center' }} >Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button1} onPress={() => addBarber()}>
                      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: 'center' }} >Add</Text>
                    </TouchableOpacity>
                  </View>

                </CardView>
                <View flexDirection="row" style={{ justifyContent: "center", paddingTop: 30 }}>
                  <TouchableOpacity style={styles.button} onPress={() => { setaddBarberScreen(false), setallBarberScreen(false), setstatScreen(true) }}>
                    <Text style={styles.buttonText}>View Stats</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => { setallBarberScreen(true), setaddBarberScreen(false), setstatScreen(false) }}>
                    <Text style={styles.buttonText}>All Barbers</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>


            : statScreen ?
              //viewing all the stats realted to the barber is from here....................................
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#000", fontWeight: "bold", fontSize: 30 }}>Barber Statistics</Text>
                <View flexDirection="row" style={{ justifyContent: "center" }}>
                  <TouchableOpacity style={styles.button} onPress={() => { setaddBarberScreen(true), setallBarberScreen(false), setstatScreen(false) }}>
                    <Text style={styles.buttonText}>Go Back</Text>
                  </TouchableOpacity>
                </View>
              </View>
              : null}
      </ScrollView>
    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  container: {
    height: hp('92s%'),
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  logoText: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold'
  },
  button: {
    width: wp('30%'),
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 12,
    alignSelf: 'center',
    marginBottom: 20,
    marginHorizontal: 15
  },
  button1: {
    width: wp('34%'),
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 10,
    alignSelf: 'center',
    marginBottom: 20,
    marginHorizontal: 15
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  inputBox: {
    width: wp('59%'),
    backgroundColor: 'rgba(40, 40,40,0.15)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 17,
    marginLeft: 10
  },
  pickerBox: {
    width: wp('42%'),
    backgroundColor: 'rgba(40, 40,40,0.15)',
    borderRadius: 25,
    paddingHorizontal: 25,
    color: '#fff',
    marginLeft: 5
  }
});

export default AdminBarber;
