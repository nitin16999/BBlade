import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, ScrollView, Alert, View, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from "@react-native-picker/picker";
import CardView from 'react-native-cardview';
import firestore from "@react-native-firebase/firestore"
import AsyncStorage from '@react-native-async-storage/async-storage';
const AdminService = () => {
  //console.disableYellowBox = true;
  const [allServiceScreen, setallServiceScreen] = useState(false)
  const [statScreen, setstatScreen] = useState(false)
  const [addServiceScreen, setaddServiceScreen] = useState(true)
  const [serviceName, setserviceName] = useState("")
  const [servicePrice, setservicePrice] = useState("")
  const [hour] = useState(['0', '1', '2', '3'])
  const [min] = useState(['0', '15', '30', '45'])
  const [selectedHour, setselectedHour] = useState("0")
  const [selectedMin, setselectedMin] = useState("0")
  const [data, setdata] = useState([])

  useEffect(() => {
    getData()
  }, [])

  function clearAddService() {
    setserviceName("")
    setservicePrice("")
    setselectedHour('0')
    setselectedMin('0')
  }

  async function getData() {
    await firestore().collection("Service").onSnapshot(snapshot => {
      setdata(snapshot.docs.map(doc => doc.data()))
    })
  }

  async function deleteData(name) {
    Alert.alert(
      'Delete!',
      'Sure you want to delete ' + name + ' service?', [{
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: 'Yes',
        onPress: () =>
          firestore().collection("Service").doc(name).delete().then(console.log("deleted")).catch((error) => { console.log(error.message) })
      },], {
      cancelable: false
    }
    )
    // await firestore().collection("Service").doc(name).delete().then(console.log("deleted")).catch((error) => { console.log(error.message) });
  }


  //This function is used to add the new service to the customer menu. 
  async function addService() {
    var v1 = serviceName
    var regex1 = /^[A-Za-z ]+$/;
    if (v1 != '') {
      if (regex1.test(v1) == true) {
        var v2 = servicePrice
        var regex2 = /[0-9.]+$/
        if (v2 != '') {
          if (regex2.test(v2) == true) {
            if (selectedHour != '0' || selectedMin != '0') {
              const userRole = await AsyncStorage.getItem('@user_role')
              if (userRole == "Admin") {
                const service = await firestore().collection("Service").where("name", "==", serviceName).get();
                if (service.empty) {
                  firestore().collection("Service").doc(serviceName).set({
                    name: serviceName,
                    price: servicePrice,
                    timeDuration: selectedHour + "hr " + selectedMin + "min"
                  }).then(
                    Alert.alert("Process Completed", "New " + serviceName + " is been added to the Customer menu."),
                    clearAddService(),
                    getData()
                  ).catch((error) => {
                    Alert.alert("Something went wrong", error.message)
                  })
                } else {
                  Alert.alert("Action Failed!", "Service with the same name is already available")
                }
              } else {
                Alert.alert("Something went wrong", "This account Don't have the premission to add services.")
              }
            } else {
              Alert.alert("Fill in valid details", "Please Select time duration for the service.")
            }
          } else {
            Alert.alert("Fill in valid details", "Please enter a valid Service price.")
          }
        } else {
          Alert.alert("Fill in all the details", "Please enter the Service Price.")
        }
      } else {
        Alert.alert("Fill in valid details", "Please enter a valid Service name.")
      }
    } else {
      Alert.alert("Fill in all the details", "Please enter the Service name.")
    }
  }

  return (
    <LinearGradient colors={['#f1f1f1', '#fff']} style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <ScrollView nestedScrollEnabled={true}>
        {allServiceScreen ?

          //showing all the services code is from here......................................... 
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.logoText}>All Services</Text>
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
                  data.map((value) => {
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
                          marginHorizontal: 10,
                          backgroundColor: "#fff"
                        }}>
                        <Text style={{ color: "#000", fontSize: 24, fontWeight: "bold" }}>{value.name}</Text>
                        <Text style={{ color: "#000", fontSize: 10 }}>______________________________________________________________________</Text>
                        <View flexDirection="row">
                          <Text style={{ color: "#000", fontSize: 22 }}>Price: </Text>
                          <Text style={{ color: "#000", fontSize: 22, fontWeight: "bold" }}>{value.price}</Text>
                        </View>
                        <View flexDirection="row">
                          <Text style={{ color: "#000", fontSize: 22 }}>Time Duration: </Text>
                          <Text style={{ color: "#000", fontSize: 22, fontWeight: "bold" }}>{value.timeDuration}</Text>
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
                <Text>{data.name}</Text>
              </ScrollView>
            </CardView>
            <View flexDirection="row" style={{ justifyContent: "center" }}>
              <TouchableOpacity style={styles.button} onPress={() => { setaddServiceScreen(true), setallServiceScreen(false), setstatScreen(false) }}>
                <Text style={styles.buttonText} >Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>

          //Adding new service code if from here........................................................
          : addServiceScreen ?
            <View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#000", fontWeight: "bold", fontSize: 30, marginTop: 20, marginBottom: 40 }}>Add new Services</Text>
                <CardView
                  flex={1}
                  cardElevation={10}
                  cornerRadius={40}
                  style={{
                    width: wp("94%"),
                    height: hp("50%"),
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 0,
                    marginTop: 25,
                    backgroundColor: "#fff",
                    marginHorizontal: 10,
                    marginBottom: 60
                  }}>
                  {/* Service name textbox  */}
                  <View flexDirection="row" style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 19, fontWeight: "bold" }}>Service name:</Text>
                    <TextInput style={styles.inputBox}
                      placeholder="eg. Hair-Cut"
                      placeholderTextColor="#000"
                      selectionColor="#D0D0D0"
                      color="#000"
                      keyboardType='default'
                      onChangeText={serviceName => setserviceName(serviceName)}
                      defaultValue={serviceName}
                    />
                  </View>
                  {/* Service price textbox  */}
                  <View flexDirection="row" style={{ justifyContent: "center", alignItems: "center", marginVertical: 30 }}>
                    <Text style={{ color: "#000", fontSize: 19, fontWeight: "bold" }}>Service price:</Text>
                    <TextInput style={styles.inputBox}
                      placeholder="XXX Rs."
                      placeholderTextColor="#000"
                      selectionColor="#D0D0D0"
                      color="#000"
                      keyboardType='number-pad'
                      onChangeText={servicePrice => setservicePrice(servicePrice)}
                      defaultValue={servicePrice}
                    />
                  </View>

                  <Text style={{ color: "#000", fontSize: 19, fontWeight: "bold", marginRight: 220 }}>Service Duration:</Text>
                  <View flexDirection="row" style={{ justifyContent: "center", alignItems: "center", marginVertical: 30 }}>
                    <TouchableOpacity style={styles.pickerBox}>
                      <Picker style={{ color: "#000", fontSize: 17 }} selectedValue={selectedHour} onValueChange={(itemValue, itemIndex) => setselectedHour(itemValue)}>
                        {hour.map((key, index) => {
                          return <Picker.Item style={{ color: "#fff", fontSize: 17 }} label={key + " hrs"} value={key} />
                        })}
                      </Picker>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pickerBox}>
                      <Picker style={{ color: "#000", fontSize: 17 }} selectedValue={selectedMin} onValueChange={(itemValue, itemIndex) => setselectedMin(itemValue)}>
                        {min.map((key, index) => {
                          return <Picker.Item style={{ color: "#fff", fontSize: 17 }} label={key + " min"} value={key} />
                        })}
                      </Picker>
                    </TouchableOpacity>
                  </View>
                  <View flexDirection="row" style={{ justifyContent: "center" }}>
                    <TouchableOpacity style={styles.button1} onPress={() => clearAddService()}>
                      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: 'center' }} >Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button1} onPress={() => addService()}>
                      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: 'center' }} >Add</Text>
                    </TouchableOpacity>
                  </View>
                </CardView>

                <View flexDirection="row" style={{ justifyContent: "center" }}>
                  <TouchableOpacity style={styles.button} onPress={() => { setallServiceScreen(false), setaddServiceScreen(false), setstatScreen(true) }}>
                    <Text style={styles.buttonText}>View Stats</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => { setallServiceScreen(true), setaddServiceScreen(false), setstatScreen(false), clearAddService() }}>
                    <Text style={styles.buttonText}>All Services</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            : statScreen ?
              //viewign all the stats realted to service is from here....................................
              <View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ color: "#000", fontWeight: "bold", fontSize: 30 }}>Services Statistics</Text>
                  <CardView
                    flex={1}
                    cardElevation={10}
                    cornerRadius={40}
                    style={{
                      width: wp("94%"),
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 0,
                      marginVertical: 25,
                      backgroundColor: "#D9D9D9"
                    }}>
                    <ScrollView>

                    </ScrollView>
                  </CardView>
                  <View flexDirection="row" style={{ justifyContent: "center" }}>
                    <TouchableOpacity style={styles.button} onPress={() => { setaddServiceScreen(true), setallServiceScreen(false), setstatScreen(false) }}>
                      <Text style={styles.buttonText}>Go Back</Text>
                    </TouchableOpacity>
                  </View>
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
    width: wp('60%'),
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

export default AdminService;
