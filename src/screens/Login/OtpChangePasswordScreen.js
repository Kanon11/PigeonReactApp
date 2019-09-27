import React, { Component } from "react";
import { Alert } from "react-native";
import { commonStyle, purpleColor, IconSet } from "../../Common/commonStyle";
import { DrawerActions } from "react-navigation";
import { ChangePassword } from "../../service/AccountService";
import {
  Container,
  Form,
  Item,
  Input,
  Label,
  Text,
  Button,
  Icon
} from "native-base";

import { loadFromStorage,storage,CurrentUserProfile} from "../../Common/storage";


class OtpChangePasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: null,
      newPassword: null,
      retypePassword: null
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Change Password",
      headerTitleStyle: { color: purpleColor },
      headerLeft: (
        <Button
          transparent
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Icon {...IconSet.Menu} style={{ color: purpleColor }} />
        </Button>
      )
    };
  };

  setState(obj, func) {
    if (this.unMounted) return;
    super.setState(obj, func);
  }

  componentWillUnmount() {
    
    this.unMounted = true;
  }

  componentWillMount() {
    
    this.unMounted = false;
  }
  componentDidMount(){
    this.initForm();
  }

  async initForm() {
    try {
        var emailId =this.props.navigation.state.params.userEmail;
       console.log(emailId);
    //   var currentUserProfile = await loadFromStorage(storage, CurrentUserProfile);
    //   console.log(currentUserProfile.item.email)
    } catch (error) {
      console.log(error);
    }
  }
  _onLoadStart = () => {
  };

  _ChangePassword = () => {
    this.ChangePassword();
  };
  async ChangePassword() {
    
    // var currentUserProfile = await loadFromStorage(storage, CurrentUserProfile);

    // if (this.state.newPassword == this.state.retypePassword) {
    //   try {
    //     let response = await ChangePassword(
    //       this.state.userName = currentUserProfile.item.email,
    //       this.state.newPassword
    //     );
    //     console.log(response);
    //     if (response.isSuccess != true) {
    //       alert(response.message);
    //     } else {
    //       this.alertMessage("Reset Password","password change successfully");
    //       this.props.navigation.navigate('LoginScreen');
    //         // alert("password change successfully");
    //     }
    //   } catch (errors) {
    //     console.log(errors);
    //   }
    // }  
    // else {
    //   alert("password must be same code");
    // }
  }
 alertMessage(title, message){
  Alert.alert(
    title,
    message,
    [
      {text: 'OK', onPress: () => this.props.navigation.navigate('LoginScreen')},
    ],
    {cancelable: false},
  );
 }
  

  render() {
    return (
      <Container style={{flex: 1, alignItems: 'center',justifyContent: 'center'}}>
        <Form
          style={{
            flex: 1,
            marginRight: 10,
            marginLeft: 10,
            backgroundColor: "white",
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Item stackedLabel>
            <Label>New Password</Label>
            <Input
              onChangeText={text => this.setState({ newPassword: text })}
              value={this.state.newPassword}
            />
          </Item>
          <Item stackedLabel>
            <Label>Confirm Password</Label>
            <Input
              onChangeText={text => this.setState({ retypePassword: text })}
              value={this.state.retypePassword}
            />
          </Item>
          <Button
            block
            style={commonStyle.ButtonCommon}
            onPress={this._ChangePassword}
          >
            <Text>Submit</Text>
          </Button>
        </Form>
      </Container>
    );
  }
}
export default OtpChangePasswordScreen;