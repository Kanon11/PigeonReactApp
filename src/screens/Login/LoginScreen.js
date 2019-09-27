import React from "react";
import {
  AsyncStorage,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import { Login } from "../../service/AccountService";
import { signupStyles } from "../../Common/commonStyle";
import { purpleColor } from "../../Common/commonStyle";
import {
  saveToStorage,
  storage,
  CurrentUserProfile
} from "../../Common/storage";
import { Toast, Button, Text, Icon, Item, Input } from "native-base";
import { registerForPushNotificationsAsync } from "../../service/api/RegisterForPushNotificationsAsync";
export default class LoginScreen extends React.Component {
  static navigationOptions = {
    headers: null
  };

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      emailValid: true,
      passValid: true,
      hidePass: true
    };
  }

  onPressSubmitButton() {
    this.onFetchLoginRecords();
  }
  onPressCreateNewButton() {
    this.props.navigation.navigate("SignupScreen");
  }
  onPressForgotButton() {
    this.props.navigation.navigate("ForgotPasswordScreen");
  }
  async onFetchLoginRecords() {
    console.log("trying login..");
    try {
      let UserModel = {
        UserName: this.state.email,
        Password: this.state.password
      };
      let response = await Login(UserModel);
      if (response && response.isSuccess && response.result.token) {
        await AsyncStorage.setItem("userToken", response.result.token);
        saveToStorage(storage, CurrentUserProfile, response.result.model);
        registerForPushNotificationsAsync();
        this.props.navigation.navigate("App");
      } else {
        if (response) {
          console.log(response);
          if (response.isSuccess) {
            Toast.show({
              text: response.message.message,
              buttonText: "Okay",
              type: "danger",
              duration: 3000,
              position: "bottom"
            });
          } else {
            Toast.show({
              text: response.message.message,
              buttonText: "Okay",
              type: "danger",
              duration: 3000,
              position: "bottom"
            });
          }
        }
      }
    } catch (errors) {
      console.log(errors);
    }
  }
  validateEmail = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.setState({ email: text, emailValid: reg.test(text) });
  };
  validatePass = text => {
    this.setState({ password: text, passValid: !(text.length < 5) });
  };

  render() {
    return (
      <ScrollView contentContainerStyle={signupStyles.container}>
        <KeyboardAvoidingView behavior="padding" enabled>
          <View style={{ alignItems: "center" }}>
            <Text>Welcome To</Text>
            <Image source={require("../../../assets/logo.png")} />
            <Text>Pigeon In</Text>
          </View>
          <View style={{ margin: 25 }}>
            <Item
              success={this.state.emailValid}
              error={!this.state.emailValid}
            >
              <Input
                ref="txtEmail"
                style={signupStyles.textInput}
                placeholder="Email ID"
                keyboardType="email-address"
                returnKeyType="next"
                value={this.state.email}
                onSubmitEditing={() => this._txtPassword._root.focus()}
                blurOnSubmit={false}
                onChangeText={text => this.validateEmail(text)}
              />
              {/* <Icon
                name={
                  this.state.emailValid ? "checkmark-circle" : "close-circle"
                }
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
                autoCorrect={false}
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
            </Item>

            <Button
              style={
                this.state.emailValid && this.state.passValid
                  ? signupStyles.buttonSubmit
                  : { marginTop: 10 }
              }
              block
              disabled={!this.state.emailValid || !this.state.passValid}
              onPress={this.onPressSubmitButton.bind(this)}
            >
              <Text> Login </Text>
            </Button>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{ color: purpleColor }}
                onPress={this.onPressForgotButton.bind(this)}
              >
                Forgot Password?
              </Text>
            </View>
          </View>
          <View style={signupStyles.footerText}>
            <Text>No Account?</Text>
            <Text
              style={signupStyles.footerTextSpace}
              onPress={this.onPressCreateNewButton.bind(this)}
            >
              {" "}
              CREATE NOW{" "}
            </Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}
