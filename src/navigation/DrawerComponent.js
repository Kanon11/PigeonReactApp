import React from "react";
import {
  Platform,
  Text,
  View,
  Image,
  SafeAreaView} from "react-native";
import { DrawerItems } from "react-navigation";
// import { darkGreen } from "../contents/commonStyle";
import {
  loadFromStorage,
  storage,
  CurrentUserProfile
} from "../../src/Common/storage";
import { purpleColor } from "../Common/commonStyle";

export class DrawerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: null,
      email: "", //"Sheikh Salahuddin",
      version: ""
    };
  }

  componentDidMount() {
    this.initForm();
  }
  // componentWillReceiveProps() {
  //   this.initForm();
  // }

  async initForm() {
    try {
      var currentUserProfile = await loadFromStorage(storage, CurrentUserProfile);
      this.setState({email: currentUserProfile.item.email})
      this.setState({ version: Expo.Constants.manifest.version});
    } catch (error) {
      console.log(error);
    }
  }
  _onLoadStart = () => {
  };

  render() {
    const navigation = this.props.navigation;
    return (
      <SafeAreaView>
        <View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Image
              style={{ width: 40, height: 40, marginTop: 50 }}
              source={require("../../assets/icon.png")}
            />
            <Text style={{ fontWeight: "bold", color: purpleColor }}>
              Pigeon In
            </Text>
            <Text style={{ color: "black", marginTop: 10}}>
              {this.state.version}
            </Text>
            <Text style={{ color: "black", marginTop: 10, marginBottom: 15 }}>
              {this.state.email}
            </Text>
          </View>
          <DrawerItems
            {...navigation}
            style={{ margin: 10, backgroundColor: "red" }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
