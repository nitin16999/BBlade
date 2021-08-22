import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, View, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview';
import LinearGradient from 'react-native-linear-gradient';
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
const BarberMenu = (props) => {

  const [todayShift1, settodayShift1] = useState(null)
  const [todayShift2, settodayShift2] = useState(null)
  const [tomorrowShift1, settomorrowShift1] = useState(null)
  const [tomorrowShift2, settomorrowShift2] = useState(null)
  const [data, setdata] = useState([])
  const [email, setemail] = useState(null)

  useEffect(() => {
    setSchedule()
    getData()
  }, []);

  async function setSchedule() {
    const userRole = await AsyncStorage.getItem('@user_role')
    const userId = await AsyncStorage.getItem('@user_id')
    if (userRole == "Barber") {

      firestore().collection(userRole).where('id', "==", userId).get().then(doc => {
        doc.forEach(doc => {
          firestore().collection("BarberSchedule").doc(doc.data().email + moment().format('MMMM DD, YYYY')).get().then((snap) => {
            firestore().collection('Schedule').doc('Today').get().then(doc1 => {
              let shift1Time = (((doc1.data().Break[0] - doc1.data().Shift1[0]) * 60) + (doc1.data().Break[1] - doc1.data().Shift1[1]))
              let shift2Time = (((doc1.data().End[0] - doc1.data().Shift2[0]) * 60) + (doc1.data().End[1] - doc1.data().Shift2[1]))
              if (snap.exists) {
                console.log('scheduled already exist')
              }
              else {
                if (userRole == "Barber") {
                  firestore().collection(userRole).where('id', "==", userId).get().then(doc => {
                    doc.forEach(doc => {
                      firestore().collection('BarberSchedule').doc(doc.data().email + moment().format('MMMM DD, YYYY')).set({
                        email: doc.data().email,
                        name: doc.data().name,
                        phone: doc.data().phone,
                        date: new Date(moment().format('MMMM DD, YYYY')),
                        shift1: 'Available',
                        shift2: 'Available',
                        dateString: moment().format('MMMM DD, YYYY'),
                        shift1Time: shift1Time,
                        shift2Time: shift2Time
                      }).then(
                        console.log('scheduled added')
                      ).catch((err) => {
                        console.log(err.message)
                      })
                    })
                  })
                }
              }
            })
          })

          firestore().collection("BarberSchedule").doc(doc.data().email + moment().add(1, 'days').format('MMMM DD, YYYY')).get().then(snap => {
            firestore().collection('Schedule').doc('Tomorrow').get().then(doc1 => {
              let shift1Time = (((doc1.data().Break[0] - doc1.data().Shift1[0]) * 60) + (doc1.data().Break[1] - doc1.data().Shift1[1]))
              let shift2Time = (((doc1.data().End[0] - doc1.data().Shift2[0]) * 60) + (doc1.data().End[1] - doc1.data().Shift2[1]))

              if (snap.exists) {
                console.log('scheduled already exist')
                firestore().collection(userRole).where('id', "==", userId).get().then(doc => {
                  doc.forEach(doc => {
                    firestore().collection('BarberSchedule').doc(doc.data().email + moment().add(1, 'days').format('MMMM DD, YYYY')).update({
                      shift1Time: shift1Time,
                      shift2Time: shift2Time
                    }).then(
                      console.log('scheduled updated')
                    ).catch((err) => {
                      console.log(err.message)
                    })
                  })
                })
              }
              else {
                if (userRole == "Barber") {
                  firestore().collection(userRole).where('id', "==", userId).get().then(doc => {
                    doc.forEach(doc => {
                      firestore().collection('BarberSchedule').doc(doc.data().email + moment().add(1, 'days').format('MMMM DD, YYYY')).set({
                        email: doc.data().email,
                        name: doc.data().name,
                        phone: doc.data().phone,
                        date: new Date(moment().add(1, 'days').format('MMMM DD, YYYY')),
                        shift1: 'Available',
                        shift2: 'Available',
                        dateString: moment().add(1, 'days').format('MMMM DD, YYYY'),
                        shift1Time: shift1Time,
                        shift2Time: shift2Time
                      }).then(
                        console.log('scheduled added')
                      ).catch((err) => {
                        console.log(err.message)
                      })
                    })
                  })
                }
              }
            })
          })
        })
      })
    }
  }

  async function getData() {
    const userRole = await AsyncStorage.getItem('@user_role')
    const userId = await AsyncStorage.getItem('@user_id')
    if (userRole == "Barber") {
      firestore().collection(userRole).where('id', "==", userId).get().then(doc => {
        doc.forEach(doc => {
          setemail(doc.data().email)
        })
      })
    }
    firestore().collection('Booking').where('BarberEmail', '==', email).where('date', '==', moment().add(1, 'days').format('MMMM DD, YYYY')).onSnapshot(snapshot => {
      setdata(snapshot.docs.map(doc => doc.data()))
    })
  }




  return (
    <LinearGradient colors={['#DFDFDF', '#fff']} style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <CardView
        cardElevation={10}
        cornerRadius={40}
        style={{
          width: wp("95%"),
          height: hp("70%"),
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text style={styles.logoText}>Booking History</Text>
        <CardView
          cardElevation={10}
          cornerRadius={40}
          style={{
            width: wp("90%"),
            height: hp("60%"),
            backgroundColor: "#DFDFDF",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <ScrollView nestedScrollEnabled={true}>
            {
              data.map((value, index) => {
                return (
                  <CardView
                    flex={1}
                    cardElevation={10}
                    cornerRadius={40}
                    style={{
                      width: wp("80%"),
                      height: hp("25%"),
                      justifyContent: 'flex-start',
                      alignItems: "flex-start",
                      paddingVertical: 0,
                      marginVertical: 25,
                      marginHorizontal: 8,
                      backgroundColor: "#fff"
                    }}>
                    <View style={{ paddingLeft: 20, paddingTop: 15 }}>
                      <View flexDirection='row'>
                        <Text style={{ color: '#000', fontSize: 22 }}>Barber Name: </Text>
                        <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{value.BarberName}</Text>
                      </View>
                      <View flexDirection='row'>
                        <Text style={{ color: '#000', fontSize: 22 }}>Barber Phone no: </Text>
                        <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{value.BarberPhone}</Text>
                      </View>
                      <View flexDirection='row'>
                        <Text style={{ color: '#000', fontSize: 22 }}>Service Name: </Text>
                        <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{value.ServiceName}</Text>
                      </View>
                      <View flexDirection='row'>
                        <Text style={{ color: '#000', fontSize: 22 }}>Service Price: </Text>
                        <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{value.ServicePrice}</Text>
                      </View>
                      <View flexDirection='row'>
                        <Text style={{ color: '#000', fontSize: 22 }}>Start time: </Text>
                        <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{value.serviceStartTime[0]}:{value.serviceStartTime[1]} (24 hr.)</Text>
                      </View>
                      <View flexDirection='row'>
                        <Text style={{ color: '#000', fontSize: 22 }}>Payment Id: </Text>
                        <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{value.id}</Text>
                      </View>
                      <View flexDirection='row'>
                        <Text style={{ color: '#000', fontSize: 22 }}>date: </Text>
                        <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{value.date}</Text>
                      </View>
                    </View>
                  </CardView>
                )
              })
            }

          </ScrollView>
        </CardView>
      </CardView>

      <TouchableOpacity style={{ width: wp('30%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 9, alignSelf: 'center', justifyContent: 'center', marginTop: 30 }} onPress={() => getData()}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', alignSelf: 'center' }}>Reffresh</Text>
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

export default BarberMenu;
