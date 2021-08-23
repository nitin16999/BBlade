import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, Alert, View, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview';
import LinearGradient from 'react-native-linear-gradient';
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";

const CustStore = (props) => {

  const [day, setday] = useState('Today')
  const [time, settime] = useState('Morning')
  const [services, setservices] = useState([])
  const [service, setservice] = useState('')

  const [barbers, setbarbers] = useState([])

  useEffect(() => {
    firestore().collection("Service").onSnapshot(snapshot => {
      setservices(snapshot.docs.map(doc => doc.data()))
    })
  }, [])

  async function findBarber() {
    if (8 <= moment().format('HH')) {
      if (moment().format('HH') < 20) {
        firestore().collection('Schedule').doc(day).get().then(doc => {
          if (doc.exists) {
            if (doc.data().Open) {

              if (day == 'Today') {

                if (time == 'Morning') {

                  firestore().collection('Schedule').doc('Today').get().then((doc) => {
                    let a = doc.data().Break;
                    if (a[0] > moment().format('HH')) {
                      setbarbers([])
                      firestore().collection('BarberSchedule').where('dateString', '==', moment().format('MMMM DD, YYYY')).where('shift1', '==', 'Available').onSnapshot(snapshot => {
                        setbarbers(snapshot.docs.map(doc => doc.data()))
                      })
                    }
                    else {
                      Alert.alert('Search denied!', "Today's morning-afternoon slot booking time is exceeded")
                    }
                  })
                }
                if (time == 'Evening') {
                  firestore().collection('Schedule').doc('Today').get().then((doc) => {
                    let a = doc.data().End;
                    if (a[0] - 1 > moment().format('HH')) {
                      setbarbers([])
                      firestore().collection('BarberSchedule').where('dateString', '==', moment().format('MMMM DD, YYYY')).where('shift2', '==', 'Available').onSnapshot(snapshot => {
                        setbarbers(snapshot.docs.map(doc => doc.data()))
                      })
                    }
                    else {
                      Alert.alert('Search denied!', "Today's Evening-night slot booking time is exceeded")
                    }
                  })
                }
              }
              if (day == 'Tomorrow') {
                if (time == 'Morning') {
                  setbarbers([])
                  firestore().collection('BarberSchedule').where('dateString', '==', moment().add(1, 'days').format('MMMM DD, YYYY')).where('shift1', '==', 'Available').onSnapshot(snapshot => {
                    setbarbers(snapshot.docs.map(doc => doc.data()))
                  })
                }
                if (time == 'Evening') {
                  setbarbers([])
                  firestore().collection('BarberSchedule').where('dateString', '==', moment().add(1, 'days').format('MMMM DD, YYYY')).where('shift2', '==', 'Available').onSnapshot(snapshot => {
                    setbarbers(snapshot.docs.map(doc => doc.data()))
                  })
                }
              }
            }
            else {
              Alert.alert('Salon is closed ' + day)
              setbarbers([])
            }
          }
          else {
            alert.alert('Something went wrong!', 'Please try after some timme.')
          }
        })
      }
      else {
        Alert.alert('Booking service is open from 8am to 8pm only.')
      }
    }
    else {
      Alert.alert('Booking service is open from 8am to 8pm only.')
    }
  }

  function clear() {
    setbarbers([])
    setday('Today')
    settime('Morning')
  }

  function proceed(value) {
    let data = {
      barber: value,
      service: services,
      day: day,
      time: time,
    }
    clear()
    barbers.splice(0, barbers.length)
    props.navigation.navigate("Booking", { data })
  }

  return (
    <ScrollView>
      <LinearGradient colors={['#DFDFDF', '#fff']} style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <CardView
            cardElevation={10}
            cornerRadius={40}
            style={{
              width: wp("95%"),
              height: hp("33%"),
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text style={styles.logoText}>Book your Service</Text>

            <CardView
              //flex={1}
              cardElevation={10}
              cornerRadius={40}
              style={{
                width: wp("90%"),
                height: hp("25%"),
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                <View flexDirection="row" style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold' }}>Select Day:</Text>
                  <TouchableOpacity style={styles.pickerBox}>
                    <Picker style={{ color: "#000", fontSize: 17 }} selectedValue={day} onValueChange={(itemValue, itemIndex) => { setday(itemValue) }}>
                      <Picker.Item style={{ color: "#fff", fontSize: 17 }} label="Today" value="Today" />
                      <Picker.Item style={{ color: "#fff", fontSize: 17 }} label="Tomorrow" value="Tomorrow" />
                    </Picker>
                  </TouchableOpacity>
                </View>

                <View flexDirection="row" style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
                  <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold' }}>Select time:</Text>
                  <TouchableOpacity style={styles.pickerBox}>
                    <Picker style={{ color: "#000", fontSize: 17 }} selectedValue={time} onValueChange={(itemValue, itemIndex) => { settime(itemValue) }}>
                      <Picker.Item style={{ color: "#fff", fontSize: 17 }} label="Morning-afternoon" value='Morning' />
                      <Picker.Item style={{ color: "#fff", fontSize: 17 }} label="Evening-night" value='Evening' />
                    </Picker>
                  </TouchableOpacity>
                </View>

                <View flexDirection='row'>
                  <TouchableOpacity style={styles.button} onPress={() => clear()}>
                    <Text style={styles.buttonText}>Clear</Text>
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 20 }}></Text>
                  <TouchableOpacity style={styles.button} onPress={() => findBarber()}>
                    <Text style={styles.buttonText}>Find Barber</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CardView>
          </CardView>

          <View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <CardView
              cardElevation={10}
              cornerRadius={40}
              style={{
                width: wp("95%"),
                height: hp("45%"),
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Text style={styles.logoText}>Available Barbers</Text>
              <CardView
                cardElevation={10}
                cornerRadius={40}
                style={{
                  width: wp("90%"),
                  height: hp("37%"),
                  backgroundColor: "#DFDFDF",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                {
                  barbers.map((value, index) => {
                    return (
                      <>
                        <CardView
                          cardElevation={10}
                          cornerRadius={40}
                          style={{
                            width: wp("85%"),
                            height: hp("17%"),
                            backgroundColor: "#fff",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 10
                          }}>
                          <View style={{ alignItems: 'flex-start' }}>
                            <Text style={{ color: '#000', fontWeight: '900', fontSize: 22 }}>Barber Name: {value.name}</Text>
                            <Text style={{ color: '#000', fontWeight: '900', fontSize: 22 }}>Barber Phone number: {value.phone}</Text>
                          </View>
                          <View style={{ alignItems: 'center', paddingTop: 10 }}>
                            <TouchableOpacity style={{ width: wp('30%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 9, alignSelf: 'center', justifyContent: 'center' }} onPress={() => proceed(value)}>
                              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', alignSelf: 'center' }}>Proceed</Text>
                            </TouchableOpacity>
                          </View>
                        </CardView>
                      </>
                    )
                  })
                }
              </CardView>
            </CardView>
          </View>
        </View>
      </LinearGradient>
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
    marginBottom: 0,
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
    textShadowColor: '#d1d1d1',
    textShadowOffset: { width: 1, height: 4 },
    textShadowRadius: 5
  },
  pickerBox: {
    width: wp('45%'),
    backgroundColor: 'rgba(40, 40,40,0.15)',
    borderRadius: 25,
    paddingHorizontal: 10,
    color: '#fff',
    marginLeft: 5
  },
  button: {
    width: wp('30%'),
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 12,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
});
export default CustStore;