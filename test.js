import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, StatusBar, TouchableOpacity, ScrollView, Alert, View, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from "@react-native-picker/picker";
import CardView from 'react-native-cardview';
//import firestore from "@react-native-firebase/firestore"
const AdminService = () => {
    
    useEffect(() => {
       
    }, [])

    async function create() {
 
    }

    return (
        <LinearGradient colors={['#f1f1f1', '#fff']} style={styles.container}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <ScrollView nestedScrollEnabled={true}>
                
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
                                    <TouchableOpacity style={styles.button} onPress={() => goToStat()}>
                                        <Text style={styles.buttonText}>View Stats</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => goToAddService()}>
                                        <Text style={styles.buttonText}>All Services</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
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
