import React from 'react';
import { View, TextInput, KeyboardAvoidingView } from 'react-native';
import { SendOTP } from '../../service/AccountService';
import { purpleColor, signupStyles } from '../../Common/commonStyle';
import { Button, Text} from "native-base";
class OtpVarityScreen extends React.Component {

    static navigationOptions = {
        headers: null
    };
    constructor(props) {
        super(props);
        this.state = {
            OTPCode: null,
            userOTP:null
        };
    }
    componentDidMount(){
        this.sendOTPToEmail();
    }
    varifyOTP() {
        if(this.state.userOTP==this.state.OTPCode)
        {
            alert('OTP Varified');
            this.props.navigation.navigate("OtpChangePasswordScreen", {
                userEmail: this.props.navigation.state.params.userEmail
              });
        }
        else
        {
            alert('Invalid OTP Code!!!');
        }
    }
    async sendOTPToEmail() {
        await SendOTP(this.props.navigation.state.params.userEmail)
            .then(res => {//console.log(res);
            this.setState({
                userOTP: res.result.otpCode
            });
            })
            .catch(error => {
            console.log("error Occured");
            });
        }
    render() {
        return (
        <KeyboardAvoidingView behavior="padding" enabled style={signupStyles.container}>
            <View  style={{ alignItems: "center" }}>
                <Text>OTP Varify</Text>
            </View>
           <View style={{margin:20}}>
            <TextInput
                ref="txtPassword"
                style={signupStyles.textInput} 
                placeholder="OTP"
                returnKeyType="next"
                underlineColorAndroid = {purpleColor}
                onChangeText={text => this.setState({ OTPCode: text })}
                />
                <Button
                  style={(this.state.OTPCode!='')?signupStyles.buttonSubmit:null}
                  block
                  disabled={this.state.OTPCode==''}
                  onPress={this.varifyOTP.bind(this)}
                >
                  <Text> Varify </Text>
                </Button>
           </View>
        </KeyboardAvoidingView>
        );
    }
}

export default OtpVarityScreen;

