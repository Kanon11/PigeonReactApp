import React from "react";
import { View, Image, KeyboardAvoidingView } from "react-native";
import { Button, Text, Icon, Item, Input } from "native-base";
import { signupStyles } from "../../Common/commonStyle";
export default class ForgotPasswordScreen extends React.Component {
  static navigationOptions = {
    headers: null
  };

  constructor(props) {
    super(props);

    this.state = {
      emailID: "",
      emailValid: false
    };
  }

  onPressContinueButton() {
    alert(
      "An OTP has sent to your e-mail. please varify it to complete registration"
    );
    
    this.props.navigation.navigate("OtpVarityScreen", {
      userEmail: this.state.emailID
    });
  }
  validateEmail = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.setState({ emailID: text, emailValid: reg.test(text) });
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
          <Text>Pigeon In</Text>
        </View>
        <View style={{ margin: 20 }}>
          <Item success={this.state.emailValid} error={!this.state.emailValid}>
            <Input
              style={signupStyles.textInput}
              placeholder="Email ID"
              keyboardType="email-address"
              returnKeyType="next"
              value={this.state.emailID}
              blurOnSubmit={false}
              onChangeText={text => this.validateEmail(text)}
            />
            <Icon
              name={this.state.emailValid ? "checkmark-circle" : "close-circle"}
            />
          </Item>
          <Button
            style={
              this.state.emailValid && this.state.emailID != ""
                ? signupStyles.buttonSubmit
                : { marginTop: 10 }
            }
            block
            disabled={!this.state.emailValid || this.state.emailID == ""}
            onPress={this.onPressContinueButton.bind(this)}
          >
            <Text> Continue </Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
