import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";
import { purpleColor, commonStyle } from "../../Common/commonStyle";
class ActivityIndicatorScreen extends Component {
  render() {
    return (
      <View style={commonStyle.loading}>
        <ActivityIndicator size="large" color={purpleColor} />
      </View>
    );
  }
}
export default ActivityIndicatorScreen;
