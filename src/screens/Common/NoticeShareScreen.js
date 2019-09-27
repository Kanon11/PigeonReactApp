import React, { Component } from "react";
import {
  View,
  Dimensions,
  FlatList,
  KeyboardAvoidingView
} from "react-native";
import { List, ListItem } from "react-native-elements";
import {
  commonStyle, purpleColor,signupStyles
} from "../../Common/commonStyle";
import { shareNotice, getEmailList } from "../../service/NoticeService";
import { Item, Input, Button,Text,Icon } from 'native-base';
import ActivityIndicatorScreen from "./ActivityIndicatorScreen";
class NoticeShareScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shareToEmail: '',
      emailList: [],
      loading: false,
      emailValid:true,
      noticeId:this.props.navigation.state.params.noticeId
    };
  }

  setState(obj, func) {
    if (this.unMounted) return;
    super.setState(obj, func);
  }

  componentWillUnmount() {
    this.unMounted = true;
  }

  componentDidMount() {
    this.unMounted = false;
    this.getEmailList(this.state.noticeId);
  }
  
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Notice Share",
      headerTintColor:purpleColor
    };
  };
  async getEmailList(noticeId) {
    await getEmailList(noticeId)
      .then(res => {
        this.setState({
          emailList: res.result,
          loading: true
        });
      })
      .catch(error => {
        console.log("error Occured");
      });
  }
  async shareToEmail(shareToEmail) {
    try {
      let response = await shareNotice(this.state.noticeId, shareToEmail);
      if (response && response.isSuccess) {
        console.log("notice shared Successfully");
        this.getEmailList(this.state.noticeId);
        this.setState({shareToEmail:''})
      } else {
        if (response) {
        }
      }
    } catch (errors) {
      console.log(errors);
    }
  }
  _shareToEmail = shareToEmail => {
    this.shareToEmail(shareToEmail);
  };
  validateEmail = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.setState({ shareToEmail: text, emailValid: reg.test(text) });
  };
  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        style={signupStyles.container}
      >
        <View style={commonStyle.ContainerColumnWhite}>
        {this.state.loading==true?
          <View style={{ margin: 10 }}>
            <Item success={this.state.emailValid} error={!this.state.emailValid}>
              <Input
                style={signupStyles.textInput}
                placeholder="Type E-mail"
                keyboardType="email-address"
                returnKeyType="next"
                value={this.state.shareToEmail}
                blurOnSubmit={false}
                onChangeText={text => this.validateEmail(text)}
              />
              <Icon
                name={this.state.emailValid ? "checkmark-circle" : "close-circle"}
              />
            </Item>
              <Button
                style={
                  this.state.emailValid && this.state.shareToEmail != ''
                    ? signupStyles.buttonSubmitRight
                    : { marginTop: 10 ,alignSelf:"flex-end"}
                }
                disabled={!this.state.emailValid || this.state.shareToEmail == ''}
                onPress={() => this._shareToEmail(this.state.shareToEmail)}
              >
                <Text> Share </Text>
              </Button>
            <Text>Email ID:</Text>
            <View style={{ height: Dimensions.get('window')/2 }}>
              <List>
                <FlatList
                  data={this.state.emailList}
                  renderItem={({ item }) => (
                    <ListItem
                      roundAvatar
                      title={item.sharedToEmail}
                      hideChevron
                    />
                  )}
                  keyExtractor={item => item.Id + ""}
                />
              </List>
            </View>
          </View>:<ActivityIndicatorScreen />}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default NoticeShareScreen;
