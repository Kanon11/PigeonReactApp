import React, { Component } from "react";
import { AsyncStorage, Image } from "react-native";
import { Icon } from "native-base";
import { RemoveDeviceToken } from "../../service/AccountService";
import { getPushNotificationExpoTokenAsync } from "../../service/api/RegisterForPushNotificationsAsync";
import { IconSet } from "../../Common/commonStyle";

class LogoutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static navigationOptions = () => {
    let drawerLabel = "Logout";
    let drawerIcon = ({ tintColor }) => (
      <Icon {...IconSet.LogoutScreen} style={{ color: tintColor }} />
    );
    return { drawerLabel, drawerIcon };
  };

  _signOutAsync = async () => {
    let token = await getPushNotificationExpoTokenAsync();
    console.log(`device token: ${token}`);
    if (token) {
      await RemoveDeviceToken(token);
    }

    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
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

  componentWillMount() {
    this._signOutAsync();
  }
  render() {
    return null;
  }
}

export default LogoutScreen;
