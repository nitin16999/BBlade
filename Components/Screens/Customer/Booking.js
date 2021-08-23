import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, Alert, View, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview';
import LinearGradient from 'react-native-linear-gradient';
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Booking = ({ route, navigation }) => {

  const [selectedService, setselectedService] = useState(route.params.data.service[0].name)
  const [servicePrice, setservicePrice] = useState(route.params.data.service[0].price)
  const [serviceTimeDuration, setserviceTimeDuration] = useState(route.params.data.service[0].timeDuration)

  useEffect(() => {
  }, [])

  function serviceSelected(value) {
    setservicePrice(value.price)
    setserviceTimeDuration(value.timeDuration)
  }

  function navigate() {
    Alert.alert('Service booked!')
    navigation.navigate('CustStore')
  }

  async function book() {
    const userRole = await AsyncStorage.getItem('@user_role')
    const userId = await AsyncStorage.getItem('@user_id')
    console.log(servicePrice * 100)
    var options = {
      description: "Payment for barber's blade",
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_xNxhIy05qUIVUs',
      amount: (servicePrice * 100),
      name: "Barbar's Blade",
      prefill: {
        email: 'void@razorpay.com',
        contact: '9167983804',
        name: 'Customer'
      },
      theme: { color: '#000000' }
    }

    if (route.params.data.day == 'Today') {
      if (route.params.data.time == 'Morning') {
        if (route.params.data.barber.shift1Time >= (serviceTimeDuration[0] * 60 + serviceTimeDuration[1])) {

          firestore().collection('Schedule').doc('Today').get().then(doc => {
            //start time
            var startTime = doc.data().Shift1[0] * 60 + doc.data().Shift1[1] // 540
            var diff = doc.data().Break[0] * 60 + doc.data().Break[1] - doc.data().Shift1[0] * 60 + doc.data().Shift1[1] // 300
            var barbertime = route.params.data.barber.shift1Time // 300
            var ans = (startTime + (diff - barbertime)) / 60 // 9
            var n1 = (Math.abs(ans) - Math.floor(ans)) * 60;
            var n2 = Math.floor(ans);
            var serviceStartTime = [n2, n1]
            //end time
            var variable = (startTime + (serviceTimeDuration[0] * 60 + serviceTimeDuration[1])) / 60
            var n3 = Math.abs(variable) - Math.floor(variable) * 60;
            var n4 = Math.floor(variable);
            var serviceEndTime = [n4, n3]
            //new shift 1 time for barber
            var newShift1Time = barbertime - (serviceTimeDuration[0] * 60 + serviceTimeDuration[1])

            RazorpayCheckout.open(options).then((data) => {
              // handle success
              console.log(`Success: ${data.razorpay_payment_id}`);
              var id = `${data.razorpay_payment_id}`
              var barberName = route.params.data.barber.name
              var barberEmail = route.params.data.barber.email
              var barberPhone = route.params.data.barber.phone
              var serName = selectedService
              var serPrice = servicePrice
              firestore().collection('BarberSchedule').doc(route.params.data.barber.email + moment().format('MMMM DD, YYYY')).update({
                shift1Time: newShift1Time
              })
              firestore().collection(userRole).doc(userId).get().then(doc => {
                var custname = doc.data().name
                var custemail = doc.data().email
                var custPhone = doc.data().phone
                firestore().collection('Booking').doc(id).set({
                  BarberName: barberName,
                  BarberEmail: barberEmail,
                  BarberPhone: barberPhone,
                  CustName: custname,
                  CustEmail: custemail,
                  CustPhone: custPhone,
                  ServiceName: serName,
                  ServicePrice: serPrice,
                  serviceStartTime: serviceStartTime,
                  id: id,
                  date: moment().format('MMMM DD, YYYY')
                })
              }).then(() => {
                navigate()
              })

            }).catch((error) => {
              // handle failure
              console.log(`Error: ${error.code} | ${error.description}`);
              Alert.alert('Payment failed', `Error: ${error.code} | ${error.description}`)
            })
          })


        }
        else {
          Alert.alert('Bookking Failed', 'Barber is out of time for service please check for shift 2 or tomorrow')
        }
      }
      else {
        console.log('today no morning')
      }
      if (route.params.data.time == "Evening") {
        if (route.params.data.barber.shift2Time >= (serviceTimeDuration[0] * 60 + serviceTimeDuration[1])) {


          firestore().collection('Schedule').doc('Today').get().then(doc => {
            //start time
            var startTime = doc.data().Shift2[0] * 60 + doc.data().Shift2[1] // 540
            var diff = doc.data().End[0] * 60 + doc.data().End[1] - doc.data().Shift2[0] * 60 + doc.data().Shift2[1] // 300
            var barbertime = route.params.data.barber.shift2Time // 300
            var ans = (startTime + (diff - barbertime)) / 60 // 9
            var n1 = (Math.abs(ans) - Math.floor(ans) )* 60;
            var n2 = Math.floor(ans);
            var serviceStartTime = [n2, n1]
            //end time
            var variable = (startTime + (serviceTimeDuration[0] * 60 + serviceTimeDuration[1])) / 60
            var n3 = Math.abs(variable) - Math.floor(variable);
            var n4 = Math.floor(variable);
            var serviceEndTime = [n4, n3]
            //new shift 1 time for barber
            var newShift2Time = barbertime - (serviceTimeDuration[0] * 60 + serviceTimeDuration[1])

            RazorpayCheckout.open(options).then((data) => {
              // handle success
              console.log(`Success: ${data.razorpay_payment_id}`);
              var id = `${data.razorpay_payment_id}`
              var barberName = route.params.data.barber.name
              var barberEmail = route.params.data.barber.email
              var barberPhone = route.params.data.barber.phone
              var serName = selectedService
              var serPrice = servicePrice
              firestore().collection('BarberSchedule').doc(route.params.data.barber.email + moment().format('MMMM DD, YYYY')).update({
                shift2Time: newShift2Time
              })
              firestore().collection(userRole).doc(userId).get().then(doc => {
                var custname = doc.data().name
                var custemail = doc.data().email
                var custPhone = doc.data().phone
                firestore().collection('Booking').doc(id).set({
                  BarberName: barberName,
                  BarberEmail: barberEmail,
                  BarberPhone: barberPhone,
                  CustName: custname,
                  CustEmail: custemail,
                  CustPhone: custPhone,
                  ServiceName: serName,
                  ServicePrice: serPrice,
                  serviceStartTime: serviceStartTime,
                  id: id,
                  date: moment().format('MMMM DD, YYYY')
                })
              }).then(() => {
                navigate()
              })
            }).catch((error) => {
              // handle failure
              console.log(`Error: ${error.code} | ${error.description}`);
              Alert.alert('Payment failed', `Error: ${error.code} | ${error.description}`)
            })
          })

        }
        else {
          Alert.alert('Bookking Failed', 'Barber is out of time for service please check for shift 2 or tomorrow')
        }
      }
      else {
        console.log('today no eve')
      }
    }
    else {
      console.log('no today')
    }

    if (route.params.data.day == "Tomorrow") {
      if (route.params.data.time == 'Morning') {
        if (route.params.data.barber.shift1Time >= (serviceTimeDuration[0] * 60 + serviceTimeDuration[1])) {

          firestore().collection('Schedule').doc('Tomorrow').get().then(doc => {
            //start time
            var startTime = doc.data().Shift1[0] * 60 + doc.data().Shift1[1] // 540
            var diff = doc.data().Break[0] * 60 + doc.data().Break[1] - doc.data().Shift1[0] * 60 + doc.data().Shift1[1] // 300
            var barbertime = route.params.data.barber.shift1Time // 300
            var ans = (startTime + (diff - barbertime)) / 60 // 9
            var n1 = (Math.abs(ans) - Math.floor(ans)) * 60;
            var n2 = Math.floor(ans);
            var serviceStartTime = [n2, n1]
            //end time
            var variable = (startTime + (serviceTimeDuration[0] * 60 + serviceTimeDuration[1])) / 60
            var n3 = Math.abs(variable) - Math.floor(variable);
            var n4 = Math.floor(variable);
            var serviceEndTime = [n4, n3]
            //new shift 1 time for barber
            var newShift1Time = barbertime - (serviceTimeDuration[0] * 60 + serviceTimeDuration[1])
            console.log(newShift1Time)

            RazorpayCheckout.open(options).then((data) => {
              // handle success
              console.log(`Success: ${data.razorpay_payment_id}`);
              var id = `${data.razorpay_payment_id}`
              var barberName = route.params.data.barber.name
              var barberEmail = route.params.data.barber.email
              var barberPhone = route.params.data.barber.phone
              var serName = selectedService
              var serPrice = servicePrice
              firestore().collection('BarberSchedule').doc(route.params.data.barber.email + moment().add(1, 'days').format('MMMM DD, YYYY')).update({
                shift1Time: newShift1Time
              })
              firestore().collection(userRole).doc(userId).get().then(doc => {
                var custname = doc.data().name
                var custemail = doc.data().email
                var custPhone = doc.data().phone
                firestore().collection('Booking').doc(id).set({
                  BarberName: barberName,
                  BarberEmail: barberEmail,
                  BarberPhone: barberPhone,
                  CustName: custname,
                  CustEmail: custemail,
                  CustPhone: custPhone,
                  ServiceName: serName,
                  ServicePrice: serPrice,
                  serviceStartTime: serviceStartTime,
                  id: id,
                  date: moment().add(1, 'days').format('MMMM DD, YYYY')
                })
              }).then(() => {
                navigate()
              })
            }).catch((error) => {
              // handle failure
              console.log(`Error: ${error.code} | ${error.description}`);
              Alert.alert('Payment failed', `Error: ${error.code} | ${error.description}`)
            })
          })


        }
        else {
          Alert.alert('Bookking Failed', 'Barber is out of time for service please check for shift 2')
        }
      } else { console.log('tomorrow no morning') }

      if (route.params.data.time == "Evening") {
        if (route.params.data.barber.shift2Time >= (serviceTimeDuration[0] * 60 + serviceTimeDuration[1])) {

          firestore().collection('Schedule').doc('Tomorrow').get().then(doc => {
            //start time
            var startTime = doc.data().Shift2[0] * 60 + doc.data().Shift2[1]
            var diff = doc.data().End[0] * 60 + doc.data().End[1] - doc.data().Shift2[0] * 60 + doc.data().Shift2[1]
            var barbertime = route.params.data.barber.shift2Time
            var ans = (startTime + (diff - barbertime)) / 60
            var n1 = (Math.abs(ans) - Math.floor(ans)) * 60;
            var n2 = Math.floor(ans);
            var serviceStartTime = [n2, n1]
            //end time
            var variable = (startTime + (serviceTimeDuration[0] * 60 + serviceTimeDuration[1])) / 60
            var n3 = Math.abs(variable) - Math.floor(variable);
            var n4 = Math.floor(variable);
            var serviceEndTime = [n4, n3]
            //new shift 1 time for barber
            var newShift2Time = barbertime - (serviceTimeDuration[0] * 60 + serviceTimeDuration[1])

            RazorpayCheckout.open(options).then((data) => {
              // handle success
              console.log(`Success: ${data.razorpay_payment_id}`);
              var id = `${data.razorpay_payment_id}`
              var barberName = route.params.data.barber.name
              var barberEmail = route.params.data.barber.email
              var barberPhone = route.params.data.barber.phone
              var serName = selectedService
              var serPrice = servicePrice
              firestore().collection('BarberSchedule').doc(route.params.data.barber.email + moment().add(1, 'days').format('MMMM DD, YYYY')).update({
                shift2Time: newShift2Time
              })
              firestore().collection(userRole).doc(userId).get().then(doc => {
                var custname = doc.data().name
                var custemail = doc.data().email
                var custPhone = doc.data().phone
                firestore().collection('Booking').doc(id).set({
                  BarberName: barberName,
                  BarberEmail: barberEmail,
                  BarberPhone: barberPhone,
                  CustName: custname,
                  CustEmail: custemail,
                  CustPhone: custPhone,
                  ServiceName: serName,
                  ServicePrice: serPrice,
                  serviceStartTime: serviceStartTime,
                  id: id,
                  date: moment().add(1, 'days').format('MMMM DD, YYYY')
                })
              }).then(() => {
                navigate()
              })
            }).catch((error) => {
              // handle failure
              console.log(`Error: ${error.code} | ${error.description}`);
              Alert.alert('Payment failed', `Error: ${error.code} | ${error.description}`)
            })
          })

        }
        else {
          Alert.alert('Bookking Failed', 'Barber is out of time for service please check for shift 2')
        }
      } else { console.log('tommorrow no eve') }

    } else { console.log('no tomorrow') }

  }

  return (
    <LinearGradient colors={['#DFDFDF', '#fff']} style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <CardView
          //flex={1}
          cardElevation={10}
          cornerRadius={40}
          style={{
            width: wp("95%"),
            height: hp("55%"),
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: 'center'
          }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={styles.logoText}>Booking info</Text></View>
          <CardView
            //flex={1}
            cardElevation={10}
            cornerRadius={40}
            style={{
              width: wp("92%"),
              height: hp("45%"),
              backgroundColor: "#fff",
              justifyContent: "center",
            }}>
            <View flexDirection='row' style={{ justifyContent: 'flex-start', paddingLeft: 30, paddingBottom: 10 }}>
              <Text style={{ color: '#000', fontSize: 22, justifyContent: 'flex-start', alignSelf: 'flex-start' }}>Barbe Name: </Text>
              <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{route.params.data.barber.name}</Text>
            </View>
            <View flexDirection='row' style={{ justifyContent: 'flex-start', paddingLeft: 30, paddingBottom: 10 }}>
              <Text style={{ color: '#000', fontSize: 22, justifyContent: 'flex-start', alignSelf: 'flex-start' }}>Barbe Phone no: </Text>
              <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{route.params.data.barber.phone}</Text>
            </View>
            <View flexDirection='row' style={{ justifyContent: 'flex-start', paddingLeft: 30, paddingBottom: 10 }}>
              <Text style={{ color: '#000', fontSize: 22, justifyContent: 'flex-start', alignSelf: 'flex-start' }}>Barbe email: </Text>
              <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{route.params.data.barber.email}</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>

              <CardView
                //flex={1}
                cardElevation={10}
                cornerRadius={40}
                style={{
                  width: wp("88%"),
                  height: hp("20%"),
                  backgroundColor: "#efefef",
                  justifyContent: "center",
                }}>
                <View flexDirection='row' style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 30, paddingBottom: 10 }}>
                  <Text style={{ color: '#000', fontSize: 22, justifyContent: 'center', alignSelf: 'center' }}>Select Service: </Text>
                  <TouchableOpacity style={styles.pickerBox}>
                    <Picker style={{ color: "#000", fontSize: 17 }} selectedValue={selectedService} onValueChange={(itemValue, itemIndex) => { setselectedService(itemValue.name), serviceSelected(itemValue) }}>
                      {route.params.data.service.map((value => {
                        return (
                          <Picker.Item style={{ color: "#fff", fontSize: 17 }} label={value.name} value={value} />
                        )
                      }))}
                    </Picker>
                  </TouchableOpacity>
                </View>
                <View flexDirection='row' style={{ alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: 30, paddingBottom: 10 }}>
                  <Text style={{ color: '#000', fontSize: 22 }}>service Price: </Text>
                  <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{servicePrice} Rs.</Text>
                </View>
                <View flexDirection='row' style={{ alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: 30, paddingBottom: 10 }}>
                  <Text style={{ color: '#000', fontSize: 22 }}>service Time Duration: </Text>
                  <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{serviceTimeDuration[0]}:{serviceTimeDuration[1]} hr</Text>
                </View>
              </CardView>
              <TouchableOpacity style={{ width: wp('34%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 10, alignSelf: 'center', marginTop: 30 }} onPress={() => { book() }}>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: 'center' }}>Book</Text>
              </TouchableOpacity>
            </View>
          </CardView>
        </CardView>
      </View>
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
    marginBottom: 10,
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
    textShadowColor: '#d1d1d1',
    textShadowOffset: { width: 1, height: 4 },
    textShadowRadius: 5,
    marginBottom: 10
  },
  pickerBox: {
    width: wp('40%'),
    backgroundColor: 'rgba(40, 40,40,0.15)',
    borderRadius: 25,
    color: '#fff'
  }
});

export default Booking;
