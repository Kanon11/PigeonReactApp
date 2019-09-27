import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Button, Icon } from "native-base";
import { purpleColor, IconSet } from "../../Common/commonStyle";
import { DrawerActions } from "react-navigation";
import NoticeListComponent from "../Common/NoticeListComponent";

class NoticeFeedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null,
      refreshing: false,
      noticetitle: null
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Notice Feed",
      headerTintColor:purpleColor,
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

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <NoticeListComponent navigation={this.props.navigation} />
      </View>
    );
  }
}

export default NoticeFeedScreen;
