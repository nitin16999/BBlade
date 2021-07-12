import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import CardView from 'react-native-cardview';
import firestore from "@react-native-firebase/firestore"
import { Value } from 'react-native-reanimated';


const Test = () => {
    const [servicesData, setservicesData] = useState([])
    useEffect(() => {
        console.log("nitin1")
        getData()
    }, [])

    async function getData() {

        console.log("nitin2")
        firestore().collection("Service").onSnapshot(snapshot => {
            setservicesData(snapshot.docs.map(doc => doc.data()))
        })
        servicesData.map(({name,price,timeDuration})=>{
            console.log(name , price, timeDuration)
        })
    }

    return (
        <LinearGradient colors={['#f1f1f1', '#fff']} style={styles.container}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <ScrollView nestedScrollEnabled={true}>

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

export default Test;
