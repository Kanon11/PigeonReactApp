import React from "react";
import { View, Image, KeyboardAvoidingView } from "react-native";
import { CreateAccount } from "../../service/AccountService";
import { purpleColor, signupStyles } from "../../Common/commonStyle";
import { Button, Text, Icon, Item, Input } from "native-base";
export default class SignupScreen extends React.Component {
  static navigationOptions = {
    headers: null
  };

  constructor(props) {
    super(props);

    this.state = {
      emailID: "",
      phoneNumber: "",
      NID: "",
      PinCode: "",
      emailValid: true,
      passValid: true,
      hidePass: true
    };
  }

  onPressSighUpButton() {
    this.onFetchLoginRecords();
  }

  async onFetchLoginRecords() {
    let data = { Email: this.state.emailID, Password: this.state.PinCode };
    try {
      let response = await CreateAccount(data);
      if (response && response.isSuccess && response.result.succeeded) {
        alert(
          "An OTP has sent to your e-mail. please varify it to complete registration"
        );
        this.props.navigation.navigate("OtpVarityScreen", {
          userEmail: this.state.emailID
        });
      } else {
        if (response) {
          alert(response.message);
        }
      }
    } catch (errors) {
      console.log(errors);
    }
  }
  validateEmail = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.setState({ emailID: text, emailValid: reg.test(text) });
  };
  validatePass = text => {
    this.setState({ PinCode: text, passValid: !(text.length < 5) });
  };
  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        style={signupStyles.container}
      >
        <View style={{ alignItems: "center" }}>
          <Image source={require("../../../assets/logo.png")} />
          <Text style={{ marginBottom: 10 }}>Pigeon In</Text>
        </View>
        <View style={{ margin: 20 }}>
          <Item success={this.state.emailValid} error={!this.state.emailValid}>
            <Input
              ref="txtEmail"
              style={signupStyles.textInput}
              placeholder="Email ID"
              keyboardType="email-address"
              returnKeyType="next"
              value={this.state.emailID}
              onSubmitEditing={() => this._txtPassword._root.focus()}
              blurOnSubmit={false}
              onChangeText={text => this.validateEmail(text)}
            />
            {/* <Icon
              name={this.state.emailValid ? "checkmark-circle" : "close-circle"}
            /> */}
          </Item>
          <Item success={this.state.passValid} error={!this.state.passValid}>
            <Input
              ref={input => {
                this._txtPassword = input;
              }}
              style={signupStyles.textInput}
              placeholder="Password"
              returnKeyType="next"
              secureTextEntry={this.state.hidePass}
              value={this.state.password}
              onChangeText={text => this.validatePass(text)}
            />
            <Icon
              name={this.state.hidePass ? "eye-off" : "eye"}
              android={this.state.hidePass ? "md-eye-off" : "md-eye"}
              ios={this.state.hidePass ? "ios-eye-off" : "ios-eye"}
              style={{ color: "grey" }}
              onPress={() => {
                this.setState({ hidePass: !this.state.hidePass });
              }}
            />
            {/* <Icon
              name={this.state.passValid ? "checkmark-circle" : "close-circle"}
            /> */}
          </Item>
          <Button
            style={
              this.state.emailValid &&
              this.state.passValid &&
              this.state.emailID != "" &&
              this.state.PinCode != ""
                ? signupStyles.buttonSubmit
                : { marginTop: 10 }
            }
            block
            disabled={
              !this.state.emailValid ||
              !this.state.passValid ||
              this.state.emailID == "" ||
              this.state.PinCode == ""
            }
            onPress={this.onPressSighUpButton.bind(this)}
          >
            <Text> Signup </Text>
          </Button>
        </View>
        <View style={signupStyles.footerText}>
          <Text> Already have an account?</Text>
          <Text
            style={{ color: purpleColor, marginLeft: 10 }}
            onPress={() => {
              this.props.navigation.navigate("LoginScreen");
            }}
          >
            {" "}
            LOGIN{" "}
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
