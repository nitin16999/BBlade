import React, { Component } from 'react';
import { StyleSheet, Text, StatusBar, View, TouchableOpacity, Image, TextInput, ScrollView,Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview';
import auth from "@react-native-firebase/auth"
export default class Login extends Component {
    state = {
        emailText: ''
    }

    resetPassword = async() => {
        if (this.state.emailText == '') {
            Alert.alert("Process Failed",'Fill in all the details');
        }
        else {
            var v = this.state.emailText
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (v != '') {
                if (regex.test(v) != true) {
                    Alert.alert("Process Failed","Enter Correct E-Mail Address.");
                }
                else {
                    auth().sendPasswordResetEmail(this.state.emailText).then(() => {
                        Alert.alert("Process completed",'Reset Password link has been sent to your e-mail address');
                    })
                        .catch((error) => Alert.alert("Failed", error.message))
                }
            }
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
                        cardElevation={10}
                        cornerRadius={40}
                        style={{
                            width: wp("93%"),
                            backgroundColor: "#fff",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: 10,
                            marginVertical: 80
                        }}>
                        <TextInput style={styles.inputBox}
                            placeholder="Enter Registered e-mail address"
                            placeholderTextColor="#000"
                            selectionColor="#D0D0D0"
                            color="#000"
                            keyboardType="email-address"
                            onChangeText={emailText => this.setState({ emailText })}
                        />
                        <View flexDirection='row' style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontSize: 16, color: '#000', paddingTop: 20, fontWeight: "bold", marginHorizontal: 10, marginBottom: 10 }}>Reset Password Link will be mailed to your registered e-mail address.</Text>
                        </View>
                    </CardView>
                    <TouchableOpacity style={styles.button}
                        onPress={this.resetPassword}>
                        <Text style={styles.buttonText}>Send</Text>
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
        width: wp('75%'),
        backgroundColor: '#000',
        borderRadius: 25,
        paddingVertical: 13,
        alignSelf: 'center',
        marginBottom: 20,
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
        marginVertical: 10
    }
});


