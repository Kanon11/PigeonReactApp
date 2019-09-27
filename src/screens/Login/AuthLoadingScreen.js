import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import {
  loadFromStorage,
  storage,
  CurrentUserProfile
} from "../../Common/storage";
import { RemoveDeviceToken } from "../../service/AccountService";
import { getPushNotificationExpoTokenAsync } from "../../service/api/RegisterForPushNotificationsAsync";

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    var response = await loadFromStorage(storage, CurrentUserProfile);
    if (response && response.isSuccess && response.item.email) {
      const userToken = await AsyncStorage.getItem("userToken");
      this.props.navigation.navigate(userToken ? "App" : "Auth");
    } else {
      this.props.navigation.navigate("Auth");
      // console.log("User Cache Not Found");
      // await this._signOutAsync();
    }
  };

  _signOutAsync = async () => {
    var token = await getPushNotificationExpoTokenAsync();
    if (token) {
      await RemoveDeviceToken(token);
    }

    await AsyncStorage.clear();

    this.props.navigation.navigate("Auth");
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
