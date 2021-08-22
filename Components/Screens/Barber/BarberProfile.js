import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, Alert, View, ScrollView, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview';
import LinearGradient from 'react-native-linear-gradient';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from "moment";
import { Picker } from "@react-native-picker/picker";

const BarberProfile = (props) => {
  const [uid, setuid] = useState(null)
  const [urole, seturole] = useState(null)
  const [nameText, setnameText] = useState("") //used for update the name data
  const [phoneText, setphoneText] = useState("")//used for update the phone data
  const [name, setname] = useState(null)//name data from database
  const [email, setemail] = useState(null)//email data from database
  const [phoneNo, setphoneNo] = useState(null)//phone no data from database
  const [userData, setuserData] = useState(true)//used for hide or show the update option


  const [chosenDate, setchosenDate] = useState(null)
  const [isDateTimePickerVisible, setisDateTimePickerVisible] = useState(false)
  const [data, setdata] = useState([])
  const [serviceType, setserviceType] = useState('Shift 1')

  useEffect(() => {

    getAsyncData()
    getSchedule()

  }, []);

  async function getAsyncData() {
    const userRole = await AsyncStorage.getItem('@user_role')
    const userId = await AsyncStorage.getItem('@user_id')
    setuid(userId)
    seturole(userRole)
    if (userRole == "Barber") {
      firestore().collection(userRole).where('id', "==", userId).get().then(doc => {
        doc.forEach(doc => {
          setname(doc.data().name)
          setemail(doc.data().email)
          setphoneNo(doc.data().phone)
        })
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
        firestore().collection(urole).doc(email).update({
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


  //custom schedule for date
  function showDateTimePicker() { setisDateTimePickerVisible(true) }
  function handleDatePicked(date) {
    hideDateTimePicker()
    setchosenDate(moment(date).format('MMMM DD, YYYY'))
  }
  function hideDateTimePicker() { setisDateTimePickerVisible(false) }

  function clear() {
    setchosenDate(null)
    setserviceType('Shift 1')
  }

  async function addNewSchedule() {
    if (chosenDate == null) {
      Alert.alert("Process Failed!", 'Please select a date')
    }
    else {
      const date = await firestore().collection("BarberSchedule").where('email', '==', email).where('date', '==', new Date(chosenDate)).get();
      if (date.empty) {

        if (serviceType == 'Leave') {
          firestore().collection('BarberSchedule').doc(email + moment(chosenDate).format('MMMM DD, YYYY')).set({
            email: email,
            name: name,
            phone: phoneNo,
            date: new Date(chosenDate),
            shift1: serviceType,
            shift2: serviceType,
            dateString: moment(chosenDate).format('MMMM DD, YYYY')
          }).then(
            Alert.alert('Custom schedule added', 'Custom schedule is been added to schedule list with date: ' + chosenDate),
            getSchedule()
          ).catch((err) => {
            console.log(err.message)
          })
          clear()
        }
        if (serviceType == 'Shift 1') {
          firestore().collection('BarberSchedule').doc(email + moment(chosenDate).format('MMMM DD, YYYY')).set({
            email: email,
            name: name,
            phone: phoneNo,
            date: new Date(chosenDate),
            shift1: 'Available',
            shift2: 'Leave',
            dateString: moment(chosenDate).format('MMMM DD, YYYY')
          }).then(
            Alert.alert('Custom schedule added', 'Custom schedule is been added to schedule list with date: ' + chosenDate),
            getSchedule()
          ).catch((err) => {
            console.log(err.message)
          })
          clear()
        }
        if (serviceType == 'Shift 2') {
          firestore().collection('BarberSchedule').doc(email + moment(chosenDate).format('MMMM DD, YYYY')).set({
            email: email,
            name: name,
            phone: phoneNo,
            date: new Date(chosenDate),
            shift1: 'Leave',
            shift2: 'Available',
            dateString: moment(chosenDate).format('MMMM DD, YYYY')
          }).then(
            Alert.alert('Custom schedule added', 'Custom schedule is been added to schedule list with date: ' + chosenDate),
            getSchedule()
          ).catch((err) => {
            console.log(err.message)
          })
          clear()
        }
      }
      else {
        Alert.alert('Process failed!', 'Schedule with the same date already exist, delete that to add new one.')
      }
    }
  }

  async function getSchedule() {
    //get custom schedule if any
    const userRole = await AsyncStorage.getItem('@user_role')
    const userId = await AsyncStorage.getItem('@user_id')
    if (userRole == "Barber") {
      firestore().collection(userRole).where('id', "==", userId).get().then(doc => {
        doc.forEach(doc => {
          firestore().collection("BarberSchedule").where('email', '==', doc.data().email).onSnapshot(snapshot => {
            setdata(snapshot.docs.map(doc => doc.data()))
          })
        })
      })
    }
    //deleting the previous schedule date
    var ans = await firestore().collection("BarberSchedule").where('date', '<', new Date(moment().format('MMMM DD, YYYY')));
    ans.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  }

  async function deleteData(value) {
    Alert.alert(
      'Delete!',
      'Sure you want to delete schedule on' + value.dateString + ' ?', [{
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: 'Yes',
        onPress: () => {
          if (value.dateString == moment().add(0, 'days').format('MMMM DD, YYYY')) {
            Alert.alert('Process denied!', 'Schedule of today and tomorrow can not be deleted')
          }
          else if (value.dateString == moment().add(1, 'days').format('MMMM DD, YYYY')) {
            Alert.alert('Process denied!', 'Schedule of today and tomorrow can not be deleted')
          }
          else {
            var ans = firestore().collection("BarberSchedule").where('email', '==', email).where('dateString', '==', value.dateString);
            ans.get().then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.delete();
              });
            });
            getSchedule()
          }
        }
      },], {
      cancelable: false
    }
    )
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
    <View style={styles.container}>
      <LinearGradient colors={['#f1f1f1', '#fff']} style={styles.container} >
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <ScrollView nestedScrollEnabled={true}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.logoText}>Barber's Profile Page</Text>
            <CardView
              cardElevation={10}
              cornerRadius={40}
              style={{
                width: wp("93%"),
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 20,
                marginHorizontal: 10,
                marginVertical: 10,
                marginBottom: 30
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
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <CardView
              cardElevation={10}
              cornerRadius={40}
              style={{
                width: wp("95%"),
                height: hp("95%"),
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 20,
                marginHorizontal: 10,
                marginBottom: 20
              }}
            >
              <Text style={styles.logoText}>Schedule your day</Text>
              <CardView
                cardElevation={10}
                cornerRadius={40}
                style={{
                  width: wp("90%"),
                  height: hp("30%"),
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 20,
                  marginHorizontal: 10,
                  marginBottom: 20
                }}
              >
                <View flexDirection="row" style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Text style={{ color: "#000", fontWeight: 'bold', fontSize: 22 }}>Select Date:</Text>
                  <TouchableOpacity style={{
                    width: wp('40%'),
                    backgroundColor: '#000',
                    borderRadius: 25,
                    paddingVertical: 10,
                    alignSelf: 'center',
                    marginHorizontal: 0,
                    marginLeft: 20
                  }} onPress={() => showDateTimePicker()}>
                    <View flexDirection='row' style={{ justifyContent: 'center' }}>
                      <Text style={{ fontSize: 17, color: '#fff', fontWeight: 'bold', paddingTop: 5, paddingRight: 5 }}>{chosenDate}</Text>
                      <Icon style={{ alignSelf: 'center' }} name='calendar' size={25} color='#fff' />
                    </View>
                  </TouchableOpacity>
                  <DateTimePicker
                    isVisible={isDateTimePickerVisible}
                    onConfirm={handleDatePicked}
                    onCancel={hideDateTimePicker}
                    minimumDate={Date.parse(moment().add(2, 'days').format('MM/DD/YYYY'))}
                    mode='date'
                    is24Hour={true}
                  //maximumDate={Date.parse((moment().add(9,'days').format('MM/DD/YYYY')))}
                  />
                </View>

                <View flexDirection="row" style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: "#000", fontWeight: 'bold', fontSize: 22, marginRight: 0 }}>Service state:</Text>
                  <TouchableOpacity style={styles.pickerBox}>
                    <Picker style={{ color: "#000", fontSize: 17 }} selectedValue={serviceType} onValueChange={(itemValue, itemIndex) => { setserviceType(itemValue) }}>
                      <Picker.Item style={{ color: "#fff", fontSize: 17 }} label="Only Shift 1" value="Shift 1" />
                      <Picker.Item style={{ color: "#fff", fontSize: 17 }} label="Only Shift 2" value="Shift 2" />
                      <Picker.Item style={{ color: "#fff", fontSize: 17 }} label="Leave" value="Leave" />
                    </Picker>
                  </TouchableOpacity>
                </View>
                <Text style={{ color: "#000", fontSize: 10, marginBottom: 15, fontWeight: "bold", marginTop: 20 }}>__________________________________________________________________________________________</Text>
                <View flexDirection='row'>
                  <TouchableOpacity style={{ width: wp('30%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 10, alignSelf: 'center', marginHorizontal: 15 }} onPress={() => clear()}>
                    <View flexDirection='row' style={{ justifyContent: 'center' }}>
                      <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>Cancle</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: wp('30%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 10, alignSelf: 'center', marginHorizontal: 15 }} onPress={() => addNewSchedule()}>
                    <View flexDirection='row' style={{ justifyContent: 'center' }}>
                      <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>Add</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </CardView>

              <CardView
                cardElevation={10}
                cornerRadius={40}
                style={{
                  width: wp("90%"),
                  height: hp("50%"),
                  backgroundColor: "#DFDFDF",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 20,
                  marginHorizontal: 10
                }}
              >

                <ScrollView nestedScrollEnabled={true}>
                  {
                    data.map((value) => {
                      return (
                        <>
                          <CardView
                            flex={1}
                            cardElevation={10}
                            cornerRadius={40}
                            style={{
                              width: wp("85%"),
                              height: hp("20%"),
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: 25,
                              backgroundColor: "#fff",
                              marginHorizontal: 10,
                              marginVertical: 20
                            }}>
                            <View flexDirection='row' style={{ paddingBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                              <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{value.dateString}</Text>
                            </View>
                            <Text style={{ color: "#000", fontSize: 10, fontWeight: "bold" }}>_________________________________________________________________________________</Text>
                            <View flexDirection='row' style={{ paddingBottom: 0 }}>
                              <Text style={{ color: '#000', fontSize: 22 }}>Shift 1: </Text>
                              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>{value.shift1}</Text>
                            </View>
                            <View flexDirection='row' style={{ paddingBottom: 0 }}>
                              <Text style={{ color: '#000', fontSize: 22 }}>Shift 2: </Text>
                              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>{value.shift2}</Text>
                            </View>
                            <View>
                              <TouchableOpacity style={{ width: wp('24%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 8, alignSelf: 'center', marginTop: 20, marginHorizontal: 15 }} onPress={() => deleteData(value)}>
                                <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold', textAlign: "center" }} >Delete</Text>
                              </TouchableOpacity>
                            </View>
                          </CardView>
                        </>
                      )
                    })
                  }
                </ScrollView>
              </CardView>
              <View flexDirection='row' style={{ alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 16, color: '#000', paddingTop: 20, fontWeight: "bold", marginHorizontal: 10, marginBottom: 10 }}>NOTE: Schedule 2 days prior to any date.</Text>
              </View>
            </CardView>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => Logout()}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient >

    </View>

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
    marginTop: 20,
    marginBottom: 20
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
  pickerBox: {
    width: wp('40%'),
    backgroundColor: 'rgba(40, 40,40,0.15)',
    borderRadius: 25,
    paddingLeft: 5,
    color: '#fff',
    marginLeft: 5
  }
});

export default BarberProfile;
