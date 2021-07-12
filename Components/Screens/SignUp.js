import React, { Component } from 'react';
import { StyleSheet, Text, StatusBar, View, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import CardView from 'react-native-cardview';
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SignUp extends Component {

    state = {
        emailText: '',
        nameText: '',
        phoneText: '',
        eye: true, eyeoff: false, visible: true,
        passwordRule: false,
        password: '',
    }

    eye_funnction = () => {
        if (this.state.eye == true) { this.setState({ eye: false, eyeoff: true, visible: false }) }
        else { this.setState({ eye: true, eyeoff: false, visible: true }) }
    }

    nameValidate = () => {
        var v = this.state.nameText
        var regex = /^[A-Za-z ]+$/;
        if (v != '') {
            if (regex.test(v) != true) { return false }
            else { return true }
        } else { return false }
    }

    phoneValidate = () => {
        var v = this.state.phoneText
        if (v != '') {
            var regex = /^[0-9]{10}$/;
            if (regex.test(v) != true) { return false }
            else { return true }
        } else { return false }
    }

    emailValidate = () => {
        var v = this.state.emailText
        if (v != '') {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (regex.test(v) != true) { return false }
            else { return true }
        } else { return false }
    }

    passwordValidate = () => {
        if (this.state.passwordRule == true) { this.setState({ passwordRule: false }) }
        var v = this.state.password
        if (v != '') {
            var regex = /^(?=.{5,10})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/g;
            if (regex.test(v) != true) { return false }
            else { return true }
        } else { return false }
    }

    password_Rules = () => {
        if (this.state.passwordRule == false) {
            this.setState({ passwordRule: true })
        }
        if (this.state.passwordRule == true) {
            this.setState({ passwordRule: false })
        }
    }
    SignUpUser = async () => {
        //checking for the error in the input fields
        if (this.nameValidate()) {
            if (this.phoneValidate()) {
                if (this.emailValidate()) {
                    if (this.passwordValidate()) {
                        //checking if firestore already has the email entry 
                        const ID = await firestore().collection("Customer").where("email", "==", this.state.emailText).get();
                        if (ID.empty) {
                            //check if auth storage has similar email id  
                            auth().createUserWithEmailAndPassword(this.state.emailText, this.state.password)
                                .then(async (cred) => {
                                    try {
                                        await AsyncStorage.setItem('@user_role', "Customer")
                                        await AsyncStorage.setItem('@user_id', cred.user.uid)
                                        firestore().collection("Customer").doc(cred.user.uid).set({
                                            name: this.state.nameText,
                                            email: this.state.emailText,
                                            phone: this.state.phoneText
                                        }).then(() => {
                                            this.props.navigation.navigate("CustomerHome")
                                        }).catch(() => {
                                            Alert.alert("Something went wrong","Plase check your network connect or please try again.")
                                        })

                                    } catch (e) {
                                        Alert.alert("Something went Wrong","Plase check your network connect or please try again.")
                                    }
                                })
                                .catch((error) => {
                                    if (error.code == "auth/email-already-in-use") {
                                        Alert.alert("Account already exist", "An account with this email address alredy exist. Please try with a new email address or try joining with this email by login method.")
                                    }
                                })
                        }
                        else { Alert.alert("Account already exist", "An account with this email address alredy exist. Please try with a new email address or try joining with this email by login method.") }
                    } else { Alert.alert("Enter Valid Password ", "Plase read the Password-Rules given bellow the password textbox. This is necessary to create a strong password for your account. "+ this.state.password) }
                } else { Alert.alert("Signup Failed","Enter Valid Email please") }
            } else { Alert.alert("Signup Failed","Enter Valid Phone number Please.") }
        } else { Alert.alert("Signup Failed","Enter Valid Name Please") }
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
                            height: hp("33.5%"),
                            backgroundColor: "#fff",
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>

                        <TextInput style={styles.inputBox}
                            placeholder="Name"
                            placeholderTextColor="#000"
                            selectionColor="#D0D0D0"
                            color="#000"
                            keyboardType='default'
                            onChangeText={nameText => this.setState({ nameText })}
                        />
                        <TextInput style={styles.inputBox}
                            placeholder="Phone Number"
                            placeholderTextColor="#000"
                            selectionColor="#D0D0D0"
                            color="#000"
                            keyboardType='phone-pad'
                            onChangeText={phoneText => this.setState({ phoneText })}
                        />
                        <TextInput style={styles.inputBox}
                            placeholder="Email"
                            placeholderTextColor="#000"
                            selectionColor="#D0D0D0"
                            color="#000"
                            keyboardType='email-address'
                            onChangeText={emailText => this.setState({ emailText })}
                        />
                        <View flexDirection='row' style={{ alignItems: "center", justifyContent: "center" }}>
                            <TextInput style={styles.inputBox1}
                                placeholder="Password"
                                placeholderTextColor="#000"
                                selectionColor="#D0D0D0"
                                color="#000"
                                keyboardType="default"
                                secureTextEntry={this.state.visible}
                                onChangeText={password => this.setState({ password })}
                                onFocus={this.password_Rules}
                                onBlur={this.password_Rules}
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
                    </CardView>
                    <View style={{ alignItems: "center" }}>
                        {
                            this.state.passwordRule ? <Text style={{ paddingVertical: 0, fontSize: 17, color: '#000', fontWeight: "bold" }}>Password should be 5-15 charecter long only.</Text> : null
                        }
                        {
                            this.state.passwordRule ? <Text style={{ paddingVertical: 0, fontSize: 17, color: '#000', fontWeight: "bold" }}>It should contain atleast one special charecter</Text> : null
                        }
                        {
                            this.state.passwordRule ? <Text style={{ paddingVertical: 0, fontSize: 17, color: '#000', fontWeight: "bold" }}>One UpperCase and One LoweCase Charecter.</Text> : null
                        }
                        {
                            this.state.passwordRule ? <Text style={{ paddingVertical: 0, fontSize: 17, color: '#000', fontWeight: "bold" }}>It should not contain a space in between.</Text> : null
                        }
                    </View>
                    <TouchableOpacity style={styles.button}
                        onPress={this.SignUpUser}>
                        <Text style={styles.buttonText}>SignUp</Text>
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
        marginStart: 5,
        marginBottom: 50,
        fontSize: 30,
        fontWeight: 'bold',
        color: "#000"
    },
    button: {
        width: wp('65%'),
        backgroundColor: '#000',
        borderRadius: 25,
        marginTop: 80,
        marginBottom: 50,
        paddingVertical: 12,
        alignSelf: 'center'
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
        marginTop: 10
    },
    inputBox1: {
        width: wp('69%'),
        backgroundColor: 'rgba(40, 40,40,0.15)',
        borderRadius: 25,
        paddingHorizontal: 16,
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
    }
});


