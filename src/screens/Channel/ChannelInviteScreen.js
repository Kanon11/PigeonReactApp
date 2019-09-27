import React, { Component } from "react";
import { Platform, View, TouchableHighlight, FlatList ,KeyboardAvoidingView} from "react-native";
import { Item, Input, Label, Text, Button, Icon } from "native-base";
import { List, ListItem } from "react-native-elements";
import {
  commonStyle,
  purpleColor,
  signupStyles
} from "../../Common/commonStyle";
import { SendInvitation } from "../../service/ChannelService";
import { ScrollView } from "react-native-gesture-handler";

var emailArray = [];
class ChannelInviteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelId: this.props.navigation.state.params.channelId,
      addToEmail: "",
      emailList: {},
      emailValid: true,
      message: null
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("name"),
      headerTintColor: purpleColor
    };
  };

  setState(obj, func) {
    if (this.unMounted) return;
    super.setState(obj, func);
  }

  componentWillUnmount() {
    this.unMounted = true;
  }

  componentDidMount() {
    this.unMounted = false;
  }

  validateEmail = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.setState({ addToEmail: text, emailValid: reg.test(text) });
  };
  _addToEmail = addToEmail => {
    if (addToEmail != null) {
      var index = emailArray.indexOf(addToEmail);
      if (index > -1) {
        alert("E-mail already Exists");
      } else {
        emailArray.push(addToEmail);
        this.setState({ emailList: emailArray, addToEmail: null });
      }
    }
  };
  _deleteEmail = index => {
    emailArray.splice(index, 1);
    this.setState({ emailList: emailArray, addToEmail: null });
  };
  async _sendInvitation(message) {
    let isSend = false;
    if (emailArray.length <= 0) {
      return;
    }
    for (let item of emailArray) {
      let data = {
        InviteeEmail: item,
        ChannelId: this.state.channelId,
        SenderMessage: message
      };
      try {
        let response = await SendInvitation(data);
        if (response && response.isSuccess) {
          isSend = true;
        } else {
          if (response) {
          }
        }
      } catch (errors) {
        console.log(errors);
      }
    }
    if (isSend) {
      alert("Invitation Send Successfully");
    } else {
      alert("Invitation Failed");
    }
    this.setState({ emailList: {}, message: null });
  }
  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        style={signupStyles.container}
      >
      <ScrollView>
      <View style={commonStyle.ContainerColumnWhite}>
        <View style={{ margin: 10 }}>
          <Item success={this.state.emailValid} error={!this.state.emailValid}>
            <Input
              style={signupStyles.textInput}
              placeholder="Type E-mail"
              keyboardType="email-address"
              returnKeyType="next"
              value={this.state.addToEmail}
              blurOnSubmit={false}
              onChangeText={text => this.validateEmail(text)}
            />
            <Icon
              name={this.state.emailValid ? "checkmark-circle" : "close-circle"}
            />
          </Item>

          <Button
            style={
              this.state.emailValid && this.state.addToEmail != ""
                ? signupStyles.buttonSubmitRight
                : { marginTop: 10, alignSelf: "flex-end" }
            }
            disabled={!this.state.emailValid || this.state.addToEmail == ""}
            onPress={() => this._addToEmail(this.state.addToEmail)}
          >
            <Text> Add </Text>
          </Button>
          <Text>Email ID:</Text>
          <View style={{ height: 200 }}>
            <List>
              <FlatList
                extraData={this.state}
                data={this.state.emailList}
                renderItem={Object => (
                  <ListItem
                    title={
                      <View style={commonStyle.ContainerRow}>
                        <Text>{Object.item}</Text>
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                          <TouchableHighlight
                            onPress={() => this._deleteEmail(Object.index)}
                          >
                            <Text style={{ color: "red" }}>x</Text>
                          </TouchableHighlight>
                        </View>
                      </View>
                    }
                    key={Object.index}
                    hideChevron
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </List>
          </View>
          <Item stackedLabel>
            <Label>Type Message</Label>
           <Input
              onChangeText={text => this.setState({ message: text })}
              value={this.state.message}
            />
          </Item>
          <Button
            style={
              emailArray.length > 0
                ? signupStyles.buttonSubmitRight
                : { marginTop: 10, alignSelf: "flex-end" }
            }
            disabled={emailArray.length <= 0}
            onPress={() => this._sendInvitation(this.state.message)}
          >
            <Text> send invitation </Text>
          </Button>
        </View>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default ChannelInviteScreen;
