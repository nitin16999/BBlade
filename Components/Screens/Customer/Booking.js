import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, Alert, View, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview';
import LinearGradient from 'react-native-linear-gradient';
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { fontSize } from 'styled-system';


const Booking = ({ route }) => {

  const [selectedService, setselectedService] = useState(route.params.data.service[0].name)
  const [servicePrice, setservicePrice] = useState(route.params.data.service[0].price)
  const [serviceTime, setserviceTime] = useState(route.params.data.service[0].timeDuration)
  useEffect(() => {
    //console.log(route.params.data.barber)
    //console.log(route.params.data.service[0].name)
    // console.log(route.params.data.day)
    // console.log(route.params.data.time)
    route.params.data.service.map((value => {
      console.log(value.name)
    }))
  }, [])

  function serviceSelected(value) {
    setservicePrice(value.price)
    setserviceTime(value.timeDuration)
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
                  <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{serviceTime[0]}:{serviceTime[1]} hr</Text>
                </View>
              </CardView>
              <TouchableOpacity style={{ width: wp('34%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 10, alignSelf: 'center', marginTop: 30 }} onPress={() => {  }}>
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
