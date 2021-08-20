import React, { Component } from 'react';
import { StyleSheet, Text, StatusBar, View, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from "@react-native-picker/picker";
import CardView from 'react-native-cardview';
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends Component {
    state = {
        email: '',
        password: '',
        eye: true,
        eyeoff: false,
        pass: true,
        loginMode: "Customer"
    }

    logInUser = async () => {
        if (this.state.loginMode == "Customer") {
            if (this.state.email != "" && this.state.password != "") {
                const data = await firestore().collection(this.state.loginMode).where("email", "==", this.state.email).get();
                if (data.empty) {
                    Alert.alert("Login Failed", "This email isn't registered as a customer yet.")
                }
                else {
                    auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                        .then(async (cread) => {
                            let uid = cread.user.uid;
                            await AsyncStorage.setItem("@user_id", uid)
                            await AsyncStorage.setItem("@user_role", this.state.loginMode)
                            this.props.navigation.navigate("CustomerHome")
                        }).catch((error) => Alert.alert("Login Failed", error.message));

                }
            }
            else {
                Alert.alert("Login Failed", "Please Fill in all the deatils")
            }

        }
        else if (this.state.loginMode == "Barber") {
            if (this.state.email != "" && this.state.password != "") {
                const data = await firestore().collection(this.state.loginMode).where("email", "==", this.state.email).get();
                if (data.empty) {
                    Alert.alert("Login Failed", "This email isn't registered as a barber yet, please contact the admin for more details.")
                }
                else {
                    data.docs.map(d => {
                        if (d.data().id == null) {
                            Alert.alert("Login Failed", "This email isn't registered as a barber yet, please signup first.")
                        }
                        else {
                            auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                                .then(async (cread) => {
                                    let uid = cread.user.uid;
                                    await AsyncStorage.setItem("@user_id", uid)
                                    await AsyncStorage.setItem("@user_role", this.state.loginMode)
                                    // firestore().collection("Barber").doc(this.state.emailText).update({
                                    //     id: uid
                                    // }).then(() => {
                                    //     this.props.navigation.navigate("BarberHome")
                                    // }).catch((err) => {
                                    //     //Alert.alert("Something went wrong", "Plase check your network connect or please try again.")
                                    //     Alert.alert("Something went wrong", err.message)
                                    // })
                                    this.props.navigation.navigate("BarberHome")
                                }).catch((error) => Alert.alert("Login Failed", error.message));
                        }
                    })
                }
            }
            else {
                Alert.alert("Login Failed", "Fill in all the deatils please")
            }
        }
        else if (this.state.loginMode == "Admin") {
            if (this.state.email != "" && this.state.password != "") {
                const data = await firestore().collection(this.state.loginMode).where("email", "==", this.state.email).get();
                if (data.empty) {
                    Alert.alert("Login Failed", "Email dosen't exists as an admin yet. Please contact the service provider.")
                }
                else {
                    auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                        .then(async (cread) => {
                            let uid = cread.user.uid;
                            await AsyncStorage.setItem("@user_id", uid)
                            await AsyncStorage.setItem("@user_role", this.state.loginMode)
                            this.props.navigation.navigate("AdminHome")
                        }).catch((error) => Alert.alert("Login Failed", error.message));

                }
            }
            else {
                Alert.alert("Login Failed", "Fill in all the deatils please")
            }
        }
    }
    eye_funnction = () => {
        if (this.state.eye == true) {
            this.setState({
                eye: false, eyeoff: true, pass: false
            })
        }
        else {
            this.setState({
                eye: true, eyeoff: false, pass: true
            })
        }
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>

                    <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                    <Image style={{ width: 200, height: 200, marginTop: 5 }} source={require("../Img/Logo1.png")} />
                    <Text style={styles.logoText}>Barber's Balde</Text>

                    <CardView
                        //flex={1}
                        cardElevation={10}
                        cornerRadius={40}
                        style={{
                            width: wp("93%"),
                            backgroundColor: "#fff",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: 10,
                            marginVertical: 50
                        }}>
                        <View flexDirection='row' style={{ alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                            <Text style={{ color: "#000", fontSize: 20, marginLeft: 10, marginRight: 20, fontWeight: "bold" }}>Login As: </Text>
                            <TouchableOpacity style={styles.pickerBox}>
                                <Picker style={{ color: "#000", fontSize: 17 }} selectedValue={this.state.loginMode} onValueChange={(itemValue, itemIndex) => this.setState({ loginMode: itemValue })}>
                                    <Picker.Item style={{ color: "#fff", fontSize: 17 }} label="a Customer" value="Customer" />
                                    <Picker.Item style={{ color: "#fff", fontSize: 17 }} label="a Barber" value="Barber" />
                                    <Picker.Item style={{ color: "#fff", fontSize: 17 }} label="an Admin" value="Admin" />
                                </Picker>
                            </TouchableOpacity>
                        </View>

                        <TextInput style={styles.inputBox}
                            placeholder="Email"
                            placeholderTextColor="#000"
                            selectionColor="#D0D0D0"
                            color="#000"
                            keyboardType='email-address'
                            onChangeText={email => this.setState({ email })}
                        />
                        <View flexDirection='row' style={{ alignItems: "center", justifyContent: "center" }}>
                            <TextInput style={styles.inputBox1}

                                placeholder="Password"
                                placeholderTextColor="#000"
                                selectionColor="#D0D0D0"
                                color="#000"
                                keyboardType="default"
                                secureTextEntry={this.state.pass}
                                onChangeText={password => this.setState({ password })}
                            />
                            <TouchableOpacity style={styles.buttonEye} onPress={this.eye_funnction}>
                                {
                                    this.state.eye ? <Icon name='eye' size={27} color='#000' /> : null
                                }
                                {
                                    this.state.eyeoff ? <Icon name='eye-off' size={27} color='#000' /> : null
                                }
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Reset')}>
                            <Text style={{ fontSize: 17, color: '#000', fontWeight: "bold" }}>Forgot your password?</Text>
                        </TouchableOpacity>
                    </CardView>
                    <TouchableOpacity style={styles.button}
                        onPress={this.logInUser}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

        );
    }
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
        fontWeight: 'bold',
        color: "#000",
        marginBottom: 0
    },
    button: {
        width: wp('65%'),
        backgroundColor: '#000',
        borderRadius: 25,
        paddingVertical: 12,
        alignSelf: 'center',
        marginTop: 50
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
        color: '#fff',

    },
    inputBox1: {
        width: wp('69%'),
        backgroundColor: 'rgba(40, 40,40,0.15)',
        borderRadius: 25,
        paddingHorizontal: 15,
        fontSize: 17,
        color: '#fff'
    },
    buttonEye: {
        width: wp('12.4%'),
        backgroundColor: 'rgba(40, 40,40,0.15)',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 9,
        paddingHorizontal: 11,
        marginLeft: 8
    },
    pickerBox: {
        width: wp('50%'),
        backgroundColor: 'rgba(40, 40,40,0.15)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 17,
        color: '#fff',
        marginLeft: 30
    }
});


