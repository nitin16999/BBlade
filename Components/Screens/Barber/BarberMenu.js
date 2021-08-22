import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, Alert, View, ScrollView, TextInput } from 'react-native';
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

  useEffect(() => {
    setSchedule()
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


  async function getSchedule() {
    const userRole = await AsyncStorage.getItem('@user_role')
    const userId = await AsyncStorage.getItem('@user_id')
    if (userRole == "Barber") {
      firestore().collection(userRole).where('id', "==", userId).get().then(doc => {
        doc.forEach(doc => {
          firestore().collection('BarberSchedule').where('email', '==', doc.data().email).where('dateString', '==', moment().format('MMMM DD, YYYY')).get().then(doc => {
            doc.forEach(data => {
              settodayShift1(data.data().shift1)
              settodayShift2(data.data().shift2)
            })
          })
          firestore().collection('BarberSchedule').where('email', '==', doc.data().email).where('dateString', '==', moment().add(1, 'days').format('MMMM DD, YYYY')).get().then(doc => {
            doc.forEach(data => {
              settomorrowShift1(data.data().shift1)
              settomorrowShift2(data.data().shift2)
            })
          })
        })
      })
    }
  }

  return (
    <LinearGradient colors={['#f1f1f1', '#fff']} style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />


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
