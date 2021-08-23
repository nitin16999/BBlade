import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, ScrollView, Alert, View, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from "@react-native-picker/picker";
import CardView from 'react-native-cardview';
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from 'react-native-modal-datetime-picker';

const Schedule = () => {

    //for today's store information
    const [todayShift1, settodayShift1] = useState([])
    const [todayShift2, settodayShift2] = useState([])
    const [todayBreak, settodayBreak] = useState([])
    const [todayEnd, settodayEnd] = useState([])
    const [todayState, settodayState] = useState(true)

    //for tomorrows's store information
    const [tomorrowShift1, settomorrowShift1] = useState([null, null])
    const [tomorrowShift2, settomorrowShift2] = useState([])
    const [tomorrowBreak, settomorrowBreak] = useState([])
    const [tomorrowEnd, settomorrowEnd] = useState([])
    const [tomorrowState, settomorrowState] = useState(true)

    // for other schedule
    const [data, setdata] = useState([])

    //Custom Schedule 
    const [storeOpen, setstoreOpen] = useState(false)
    const [disabled, setdisabled] = useState(true)

    const [isDateTimePickerVisible, setisDateTimePickerVisible] = useState(false)
    const [isTimePicker1Visible, setisTimePicker1Visible] = useState(false)
    const [isTimePicker2Visible, setisTimePicker2Visible] = useState(false)
    const [isTimePicker3Visible, setisTimePicker3Visible] = useState(false)
    const [isTimePicker4Visible, setisTimePicker4Visible] = useState(false)
    const [chosenDate, setchosenDate] = useState(null)
    const [chosenTime1, setchosenTime1] = useState([])
    const [time1, settime1] = useState(null)
    const [chosenTime2, setchosenTime2] = useState([])
    const [time2, settime2] = useState(null)
    const [chosenTime3, setchosenTime3] = useState([])
    const [time3, settime3] = useState(null)
    const [chosenTime4, setchosenTime4] = useState([])
    const [time4, settime4] = useState(null)

    useEffect(() => {
        storeSchedule();
        getData();
        storeSchedule();
        getData();
        storeSchedule();
        getData();
    }, [])

    async function getData() {
        const userRole = await AsyncStorage.getItem('@user_role')
        if (userRole == "Admin") {

            //Get todays schedule time
            await firestore().collection("Schedule").doc('Today').get().then(doc => {
                settodayShift1(doc.data().Shift1)
                settodayShift2(doc.data().Shift2)
                settodayBreak(doc.data().Break)
                settodayEnd(doc.data().End)
                settodayState(doc.data().Open)
            }).catch(err => {
                console.log(err.message)
            })

            //Get tomorrows schedule time
            await firestore().collection("Schedule").doc('Tomorrow').get().then(doc => {
                settomorrowShift1(doc.data().Shift1)
                settomorrowShift2(doc.data().Shift2)
                settomorrowBreak(doc.data().Break)
                settomorrowEnd(doc.data().End)
                settomorrowState(doc.data().Open)
            }).catch(err => {
                console.log(err.message)
            })

            //get custom schedule if any
            await firestore().collection("Schedule").where('date', '>', new Date(moment().add(1, 'days').format('MMMM DD, YYYY'))).onSnapshot(snapshot => {
                setdata(snapshot.docs.map(doc => doc.data()))
            })
        }

    }

    async function storeSchedule() {

        // Set todays Schedule
        const toady = await firestore().collection("Schedule").doc(moment().format('MMMM DD, YYYY')).get();
        if (toady.exists) {
            firestore().collection("Schedule").doc(moment().format('MMMM DD, YYYY')).get().then(doc => {
                const shift1 = doc.data().Shift1
                const Break = doc.data().Break
                const shift2 = doc.data().Shift2
                const End = doc.data().End
                const open = doc.data().Open
                if (open == true) {
                    firestore().collection("Schedule").doc("Today").set({
                        date: new Date(moment().format('MMMM DD, YYYY')),
                        Shift1: shift1,
                        Break: Break,
                        Shift2: shift2,
                        End: End,
                        Open: open
                    }).then(() => {
                        console.log("Added custom time schedule")
                    }).catch(err => {
                        console.log(err.message)
                    })
                }
                else {
                    firestore().collection("Schedule").doc("Today").set({
                        date: new Date(moment().format('MMMM DD, YYYY')),
                        Shift1: [0,0],
                        Break: [0,0],
                        Shift2: [0,0],
                        End: [0,0],
                        Open: open
                    }).then(() => {
                        console.log("Added custom time schedule")
                    }).catch(err => {
                        console.log(err.message)
                    })
                }

            }).catch(err => {
                console.log(err.message)
            })
        }
        else {
            firestore().collection("Schedule").doc("Default").get().then(doc => {
                const shift1 = doc.data().Shift1
                const Break = doc.data().Break
                const shift2 = doc.data().Shift2
                const End = doc.data().End
                firestore().collection("Schedule").doc("Today").set({
                    date: new Date(moment().format('MMMM DD, YYYY')),
                    Shift1: shift1,
                    Break: Break,
                    Shift2: shift2,
                    End: End,
                    Open: true
                }).then(() => {
                    console.log("Added default time schedule")
                }).catch(err => {
                    console.log(err.message)
                })
            }).catch(err => {
                console.log(err.message)
            })
        }

        //Set Tomorrow's schedule
        const tomorrow = await firestore().collection("Schedule").doc(moment().add(1, 'days').format('MMMM DD, YYYY')).get();
        if (tomorrow.exists) {
            firestore().collection("Schedule").doc(moment().add(1, 'days').format('MMMM DD, YYYY')).get().then(doc => {
                const shift1 = doc.data().Shift1
                const Break = doc.data().Break
                const shift2 = doc.data().Shift2
                const End = doc.data().End
                const open = doc.data().Open
                if (open == true) {
                    firestore().collection("Schedule").doc("Tomorrow").set({
                        date: new Date(moment().add(1, 'days').format('MMMM DD, YYYY')),
                        Shift1: shift1,
                        Break: Break,
                        Shift2: shift2,
                        End: End,
                        Open: true
                    }).then(() => {
                        console.log("Added custom time schedule")
                    }).catch(err => {
                        console.log(err.message)
                    })
                }
                else {
                    firestore().collection("Schedule").doc("Tomorrow").set({
                        date: new Date(moment().add(1, 'days').format('MMMM DD, YYYY')),
                        Shift1: [0, 0],
                        Break: [0, 0],
                        Shift2: [0, 0],
                        End: [0, 0],
                        Open: false
                    }).then(() => {
                        console.log("Added custom time schedule")
                    }).catch(err => {
                        console.log(err.message)
                    })
                }
            }).catch(err => {
                console.log(err.message)
            })
        }
        else {
            firestore().collection("Schedule").doc("Default").get().then(doc => {
                const shift1 = doc.data().Shift1
                const Break = doc.data().Break
                const shift2 = doc.data().Shift2
                const End = doc.data().End
                firestore().collection("Schedule").doc("Tomorrow").set({
                    date: new Date(moment().add(1, 'days').format('MMMM DD, YYYY')),
                    Shift1: shift1,
                    Break: Break,
                    Shift2: shift2,
                    End: End,
                    Open: true,
                }).then(() => {
                    console.log("Added default time schedule")
                }).catch(err => {
                    console.log(err.message)
                })
            }).catch(err => {
                console.log(err.message)
            })
        }

        //deleting the previous schedule date
        var ans = await firestore().collection("Schedule").where('date', '<', new Date(moment().format('MMMM DD, YYYY')));
        ans.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                doc.ref.delete();
            });
        });
    }

    //custom schedule for date
    function showDateTimePicker() { setisDateTimePickerVisible(true) }
    function handleDatePicked(date) {
        hideDateTimePicker()
        setchosenDate(moment(date).format('MMMM DD, YYYY'))
    }
    function hideDateTimePicker() { setisDateTimePickerVisible(false) }


    //Shift1 time of that date
    function showTimePicker1() { setisTimePicker1Visible(true) }
    function handleTimePicked1(time) {
        hideTimePicker1()
        chosenTime1[0] = parseInt(moment(time).format('HH'))
        chosenTime1[1] = parseInt(moment(time).format('mm'))
        settime1(moment(time).format('HH:mm'))
    }
    function hideTimePicker1() { setisTimePicker1Visible(false) }

    //Break time of that date
    function showTimePicker2() { setisTimePicker2Visible(true) }
    function handleTimePicked2(time) {
        hideTimePicker2()
        chosenTime2[0] = parseInt(moment(time).format('HH'))
        chosenTime2[1] = parseInt(moment(time).format('mm'))
        settime2(moment(time).format('HH:mm'))
    }
    function hideTimePicker2() { setisTimePicker2Visible(false) }

    //Shift2 time of that date
    function showTimePicker3() { setisTimePicker3Visible(true) }
    function handleTimePicked3(time) {
        hideTimePicker3()
        chosenTime3[0] = parseInt(moment(time).format('HH'))
        chosenTime3[1] = parseInt(moment(time).format('mm'))
        settime3(moment(time).format('HH:mm'))
    }
    function hideTimePicker3() { setisTimePicker3Visible(false) }

    //End time of that date
    function showTimePicker4() { setisTimePicker4Visible(true) }
    function handleTimePicked4(time) {
        hideTimePicker4()
        chosenTime4[0] = parseInt(moment(time).format('HH'))
        chosenTime4[1] = parseInt(moment(time).format('mm'))
        settime4(moment(time).format('HH:mm'))
    }
    function hideTimePicker4() { setisTimePicker4Visible(false) }

    //Clear the fields
    function clear() {
        setchosenDate(null)
        setchosenTime1([]); setchosenTime2([]); setchosenTime3([]); setchosenTime4([])
        settime1(null); settime2(null); settime3(null); settime4(null);
        setstoreOpen(false)
        setdisabled(true)
    }


    //add custom scheduled date
    async function addNewSchedule() {
        if (chosenDate == null) {
            Alert.alert("Process Failed", "Please select a date and fill other necessory details.")
        }
        else {
            if (storeOpen == true) {
                if (time1 != null && time2 != null && time3 != null && time4 != null) {
                    if (chosenTime1[0] < chosenTime2[0] < chosenTime3[0] < chosenTime4[0]) {
                        const data = await firestore().collection('Schedule').doc(chosenDate).get();
                        if (data.exists) {
                            Alert.alert("Process Failed", 'Schedule for this date is already available')
                        }
                        else {
                            //add data to the databse
                            firestore().collection('Schedule').doc(chosenDate).set({
                                date: new Date(chosenDate),
                                Open: storeOpen,
                                Shift1: chosenTime1,
                                Break: chosenTime2,
                                Shift2: chosenTime3,
                                End: chosenTime4,
                                dateString: moment(chosenDate).format('MMMM DD, YYYY')
                            }).then(
                                Alert.alert('Custom Schedule added', 'Schedule is added on date: ' + chosenDate),
                                clear()
                            ).catch((err) => {
                                console.log(err.message)
                            })
                        }
                    }
                    else {
                        Alert.alert("Process Failed", "Please enter proper time for schedule.")
                    }
                } else {
                    Alert.alert("Process Failed", "Please fill other necessory details.")
                }
            }
            else {
                // date and closed  
                const data = await firestore().collection('Schedule').doc(chosenDate).get();
                if (data.exists) {
                    Alert.alert("Process Failed", 'Schedule for this date is already available')
                }
                else {
                    //add data to the databse
                    firestore().collection('Schedule').doc(chosenDate).set({
                        date: new Date(chosenDate),
                        Open: storeOpen,
                        dateString: moment(chosenDate).format('MMMM DD, YYYY')
                    }).then(
                        Alert.alert('Custom Schedule added', 'Schedule is added on date: ' + chosenDate),
                        clear()
                    ).catch((err) => {
                        console.log(err.message)
                    })
                }
            }
        }
    }

    async function deleteData(date) {
        Alert.alert(
            'Delete!',
            'Sure you want to delete schedule on' + date + ' ?', [{
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'Yes',
                onPress: () =>
                    firestore().collection("Schedule").doc(date).delete().then(console.log("deleted")).catch((error) => { console.log(error.message) })
            },], {
            cancelable: false
        }
        )
    }

    return (
        <LinearGradient colors={['#f1f1f1', '#fff']} style={styles.container}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <ScrollView nestedScrollEnabled={true}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={styles.logoText}>Schedule</Text>
                    <CardView
                        flex={1}
                        cardElevation={10}
                        cornerRadius={40}
                        style={{
                            width: wp("95%"),
                            height: hp("20%"),
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 25,
                            backgroundColor: "#fff",
                            marginHorizontal: 10,
                        }}>
                        <LinearGradient colors={['#f1f1f1', '#fff', '#fff']} style={styles.container}>
                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 25 }}>Today</Text>
                            <Text style={{ color: "#000", fontSize: 10, fontWeight: "bold" }}>__________________________________________________________________________________________</Text>
                            <View>
                                {todayState ?
                                    <View>
                                        <View flexDirection='row' style={{ paddingBottom: 10 }}>
                                            <Text style={{ color: '#000', fontSize: 22 }}>Store is: </Text>
                                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>Open</Text>
                                        </View>
                                        <View flexDirection="row" style={{ paddingBottom: 10 }}>
                                            <Text style={{ color: '#000', fontSize: 22 }}>Day Timing: </Text>
                                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>{todayShift1[0]}: {todayShift1[1]} - {todayBreak[0]}: {todayBreak[1]} (24 Hr.)</Text>
                                        </View>
                                        <View flexDirection="row">
                                            <Text style={{ color: '#000', fontSize: 22 }}>Evening Timing: </Text>
                                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>{todayShift2[0]}: {todayShift2[1]} - {todayEnd[0]}: {todayEnd[1]} (24 Hr.)</Text>
                                        </View>
                                    </View>
                                    :
                                    <View flexDirection='row' style={{ paddingBottom: 10 }}>
                                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>Store is: </Text>
                                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>Closed</Text>
                                    </View>

                                }
                            </View>

                        </LinearGradient>
                    </CardView>

                    <CardView
                        flex={1}
                        cardElevation={10}
                        cornerRadius={40}
                        style={{
                            width: wp("95%"),
                            height: hp("20%"),
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 25,
                            backgroundColor: "#fff",
                            marginHorizontal: 10
                        }}>
                        <LinearGradient colors={['#f1f1f1', '#fff', '#fff']} style={styles.container}>
                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 25 }}>Tomorrow</Text>
                            <Text style={{ color: "#000", fontSize: 10, marginBottom: 15, fontWeight: "bold" }}>__________________________________________________________________________________________</Text>

                            <View>
                                {tomorrowState ?
                                    <View>
                                        <View flexDirection='row' style={{ paddingBottom: 10 }}>
                                            <Text style={{ color: '#000', fontSize: 22 }}>Store is: </Text>
                                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>Open</Text>
                                        </View>
                                        <View flexDirection="row" style={{ paddingBottom: 10 }}>
                                            <Text style={{ color: '#000', fontSize: 22 }}>Day Timing: </Text>
                                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>{tomorrowShift1[0]}: {tomorrowShift1[1]} - {tomorrowBreak[0]}: {tomorrowBreak[1]} (24 Hr.)</Text>
                                        </View>
                                        <View flexDirection="row">
                                            <Text style={{ color: '#000', fontSize: 22 }}>Evening Timing: </Text>
                                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>{tomorrowShift2[0]}: {tomorrowShift2[1]} - {tomorrowEnd[0]}: {tomorrowEnd[1]} (24 Hr.)</Text>
                                        </View>
                                    </View>
                                    :
                                    <View flexDirection='row' style={{ paddingBottom: 10 }}>
                                        <Text style={{ color: '#000', fontSize: 22 }}>Store is: </Text>
                                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>Closed</Text>
                                    </View>
                                }
                            </View>

                        </LinearGradient>
                    </CardView>
                    <Text style={styles.logoText}>Upcoming custom Schedule</Text>
                    <CardView
                        flex={1}
                        cardElevation={10}
                        cornerRadius={40}
                        style={{
                            width: wp("95%"),
                            height: hp("40%"),
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: 0,
                            marginVertical: 15,
                            backgroundColor: "#DFDFDF"

                        }}>
                        <ScrollView nestedScrollEnabled={true}>
                            {
                                data.map((value) => {
                                    return (
                                        <ScrollView>
                                            <CardView
                                                flex={1}
                                                cardElevation={10}
                                                cornerRadius={40}
                                                style={{
                                                    width: wp("90%"),
                                                    height: hp("25%"),
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: 25,
                                                    backgroundColor: "#fff",
                                                    marginHorizontal: 10,
                                                    marginVertical: 20
                                                }}>
                                                {
                                                    value.Open ?
                                                        <View>
                                                            <View flexDirection='row' style={{ paddingBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{value.dateString}</Text>
                                                            </View>
                                                            <Text style={{ color: "#000", fontSize: 10, fontWeight: "bold" }}>__________________________________________________________________________________________</Text>
                                                            <View flexDirection='row' style={{ paddingBottom: 10 }}>
                                                                <Text style={{ color: '#000', fontSize: 22 }}>Store is: </Text>
                                                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>Open</Text>
                                                            </View>
                                                            <View flexDirection="row" style={{ paddingBottom: 10 }}>
                                                                <Text style={{ color: '#000', fontSize: 22 }}>Day Timing: </Text>
                                                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>{value.Shift1[0]}: {value.Shift1[1]} - {value.Break[0]}: {value.Break[1]} (24 Hr.)</Text>
                                                            </View>
                                                            <View flexDirection="row">
                                                                <Text style={{ color: '#000', fontSize: 22 }}>Evening Timing: </Text>
                                                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>{value.Shift2[0]}: {value.Shift2[1]} - {value.End[0]}: {value.End[1]} (24 Hr.)</Text>
                                                            </View>
                                                            <View>
                                                                <TouchableOpacity style={{ width: wp('24%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 8, alignSelf: 'center', marginTop: 20, marginHorizontal: 15 }} onPress={() => deleteData(value.dateString)}>
                                                                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold', textAlign: "center" }} >Delete</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        :
                                                        <View style={{ paddingBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>{value.dateString}</Text>
                                                            <Text style={{ color: "#000", fontSize: 10, fontWeight: "bold", paddingTop: 5 }}>__________________________________________________________________________________________</Text>
                                                            <View flexDirection='row' style={{ paddingBottom: 10, paddingTop: 30 }}>
                                                                <Text style={{ color: '#000', fontSize: 22 }}>Store is: </Text>
                                                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 22 }}>Closed</Text>
                                                            </View>
                                                            <View>
                                                                <TouchableOpacity style={{ width: wp('24%'), backgroundColor: '#000', borderRadius: 25, paddingVertical: 8, alignSelf: 'center', marginTop: 20, marginHorizontal: 15 }} onPress={() => deleteData(value.dateString)}>
                                                                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold', textAlign: "center" }} >Delete</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                }
                                            </CardView>
                                        </ScrollView>
                                    )
                                })
                            }
                        </ScrollView>
                    </CardView>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#000', marginLeft: 5, marginTop: 20 }}>
                        Note: Set custom schedule 2 days prior to that date.
                    </Text>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 10, marginBottom: 15, fontWeight: "bold" }}>________________________________________________________________________________________________________</Text>
                    <Text style={styles.logoText}>Customize Schedule</Text>
                    <CardView
                        flex={1}
                        cardElevation={10}
                        cornerRadius={40}
                        style={{
                            width: wp("94%"),
                            height: hp("59%"),
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: 0,
                            marginTop: 25,
                            backgroundColor: "#fff",
                            marginHorizontal: 10,
                            marginBottom: 60
                        }}>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                            <View flexDirection="row" style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                <Text style={{ color: "#000", fontWeight: 'bold', fontSize: 22 }}>Select Date:    </Text>
                                <TouchableOpacity style={{
                                    width: wp('40%'),
                                    backgroundColor: '#000',
                                    borderRadius: 25,
                                    paddingVertical: 10,
                                    alignSelf: 'center',
                                    marginHorizontal: 15,
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

                                <Text style={{ color: "#000", fontWeight: 'bold', fontSize: 22, marginRight: 35 }}>Store is:     </Text>
                                <TouchableOpacity style={styles.pickerBox}>
                                    <Picker style={{ color: "#000", fontSize: 17 }} selectedValue={storeOpen} onValueChange={(itemValue, itemIndex) => { setstoreOpen(itemValue), setdisabled(!(itemValue)) }}>
                                        <Picker.Item style={{ color: "#fff", fontSize: 17 }} label="Closed" value={false} />
                                        <Picker.Item style={{ color: "#fff", fontSize: 17 }} label="Open" value={true} />
                                    </Picker>
                                </TouchableOpacity>

                            </View>

                            <View flexDirection="row" style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 5, marginTop: 10 }}>
                                <Text style={{ color: "#000", fontWeight: 'bold', fontSize: 22 }}>Select Shift1 time: </Text>
                                <TouchableOpacity disabled={disabled} style={styles.button} onPress={() => showTimePicker1()}>
                                    <View flexDirection='row' style={{ justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 17, color: '#fff', fontWeight: 'bold', paddingTop: 5, paddingRight: 5 }}>{time1}</Text>
                                        <Icon style={{ alignSelf: 'center' }} name='clock' size={25} color='#fff' />
                                    </View>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={isTimePicker1Visible}
                                    onConfirm={handleTimePicked1}
                                    onCancel={hideTimePicker1}
                                    mode='time'
                                    is24Hour={true}
                                />
                            </View>

                            <View flexDirection="row" style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 5 }}>
                                <Text style={{ color: "#000", fontWeight: 'bold', fontSize: 22 }}>Break time:              </Text>
                                <TouchableOpacity disabled={disabled} style={styles.button} onPress={() => showTimePicker2()}>
                                    <View flexDirection='row' style={{ justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 17, color: '#fff', fontWeight: 'bold', paddingTop: 5, paddingRight: 5 }}>{time2}</Text>
                                        <Icon style={{ alignSelf: 'center' }} name='clock' size={25} color='#fff' />
                                    </View>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={isTimePicker2Visible}
                                    onConfirm={handleTimePicked2}
                                    onCancel={hideTimePicker2}
                                    mode='time'
                                    is24Hour={true}
                                />
                            </View>

                            <View flexDirection="row" style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 5 }}>
                                <Text style={{ color: "#000", fontWeight: 'bold', fontSize: 22 }}>Select Shift2 time: </Text>
                                <TouchableOpacity disabled={disabled} style={styles.button} onPress={() => showTimePicker3()}>
                                    <View flexDirection='row' style={{ justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 17, color: '#fff', fontWeight: 'bold', paddingTop: 5, paddingRight: 5 }}>{time3}</Text>
                                        <Icon style={{ alignSelf: 'center' }} name='clock' size={25} color='#fff' />
                                    </View>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={isTimePicker3Visible}
                                    onConfirm={handleTimePicked3}
                                    onCancel={hideTimePicker3}
                                    mode='time'
                                    is24Hour={true}
                                />
                            </View>

                            <View flexDirection="row" style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 5 }}>
                                <Text style={{ color: "#000", fontWeight: 'bold', fontSize: 22 }}>Select End time:     </Text>
                                <TouchableOpacity disabled={disabled} style={styles.button} onPress={() => showTimePicker4()}>
                                    <View flexDirection='row' style={{ justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 17, color: '#fff', fontWeight: 'bold', paddingTop: 5, paddingRight: 5 }}>{time4}</Text>
                                        <Icon style={{ alignSelf: 'center' }} name='clock' size={25} color='#fff' />
                                    </View>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={isTimePicker4Visible}
                                    onConfirm={handleTimePicked4}
                                    onCancel={hideTimePicker4}
                                    mode='time'
                                    is24Hour={true}
                                />
                            </View>
                        </View>

                        <Text style={{ color: "#000", fontSize: 10, marginBottom: 15, fontWeight: "bold" }}>__________________________________________________________________________________________</Text>
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
                </View>
            </ScrollView>

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
        fontSize: 30,
        color: '#000',
        fontWeight: 'bold',
        textShadowColor: '#d1d1d1',
        textShadowOffset: { width: 1, height: 4 },
        textShadowRadius: 5,
        paddingTop: 10
    },
    button: {
        width: wp('30%'),
        backgroundColor: '#000',
        borderRadius: 25,
        paddingVertical: 10,
        alignSelf: 'center',
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
        width: wp('44%'),
        backgroundColor: 'rgba(40, 40,40,0.15)',
        borderRadius: 25,
        paddingHorizontal: 25,
        color: '#fff',
        marginLeft: 5
    }
});

export default Schedule;
