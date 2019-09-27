import React, { Component } from "react";
import { View, Image, FlatList } from "react-native";
import { List, ListItem } from "react-native-elements";
import {
  purpleColor,
  darkGrayColor,
  commonStyle,
  IconSet
} from "../../Common/commonStyle";
import {
  SubscribeInstitute,
  GetInstituteById,
  GetChannelByInstituteId
} from "../../service/InstituteService";
import { GetChannelDetail, SubscribeUnSubscribeChannel } from "../../service/ChannelService";
import { Button, ActionSheet, Text, Thumbnail, Icon } from "native-base";
import ActivityIndicatorScreen from "../Common/ActivityIndicatorScreen";

var instituteChannelListScreen;

class InstituteChannelListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instituteId: this.props.navigation.state.params.instituteId,
      data: {},
      channelData: [],
      loading: false,
      isChannelLoading: false,
      channel: 0
    };

    instituteChannelListScreen = this;
  }

  static navigationOptions = ({ navigation }) => {
    var instituteObj = navigation.getParam("institute");
    var BUTTONS = [];
    if (instituteObj.isOwner) {
      BUTTONS.push({
        text: "Edit Institute",
        icon: "open",
        iconColor: darkGrayColor
      });
    }
    BUTTONS.push({
      text: "View Institute",
      icon: "eye",
      iconColor: darkGrayColor
    });
    BUTTONS.push({ text: "Cancel", icon: "close", iconColor: darkGrayColor });

    return {
      title: navigation.getParam("channelName", "Institute Details"),
      headerTintColor: purpleColor,
      headerRight: (
        <Button
          transparent
          onPress={() =>
            ActionSheet.show(
              {
                options: BUTTONS,
                cancelButtonIndex: BUTTONS.length - 1
              },
              buttonIndex => {
                var buttonText = BUTTONS[buttonIndex].text;
                if (buttonText == "Edit Institute") {
                  instituteChannelListScreen._EditInstitute();
                }
                if (buttonText == "View Institute") {
                  instituteChannelListScreen._ViewInstitute();
                }
              }
            )
          }
        >
          <Icon {...IconSet.SecondMenu} style={{ color: purpleColor }} />
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

  componentDidMount() {
    this.unMounted = false;
    this.setState({ loading: true });
    this._getInstituteById(this.state.instituteId);
    this._getChannelByInstituteId(this.state.instituteId);
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.setState({ loading: true });
        this._getInstituteById(this.state.instituteId);
        this._getChannelByInstituteId(this.state.instituteId);
      }
    );
  }
  async _getInstituteById(id) {
    await GetInstituteById(id)
      .then(res => {
        this.setState({
          data: res.result[0]
        });
      })
      .catch(error => {
        console.log("error Occured");
      });
  }
  async _getChannelByInstituteId(id) {
    await GetChannelByInstituteId(id)
      .then(res => {
        this.setState({
          channelData: res.result,
          loading: false
        });
      })
      .catch(error => {
        console.log("error Occured");
      });
  }
  async _SubscribeInstitute() {
    try {
      let response = await SubscribeInstitute(this.state.instituteId);
      if (response.isSuccess && response.result.success) {
        this._getInstituteById(this.state.instituteId);
        this._getChannelByInstituteId(this.state.instituteId);
      } else {
        console.log("error occured");
      }
    } catch (errors) {
      alert("error occured");
    }
  }
  async _SubsCribeUnSubscribeChannel(channelId) {
    try {
      let response = await SubscribeUnSubscribeChannel(channelId);
      if (response.isSuccess && response.result.success) {
        this._getChannelByInstituteId(this.state.instituteId);
      } else {
        console.log("error occured");
      }
    } catch (errors) {
      alert("error occured");
    }
  }
  async _EditInstitute() {
    this.props.navigation.navigate("InstituteDetailsScreen", {
      data: this.state.data,
      name: "Edit Institute" //this.state.data.name
    });
  }

  async _ViewInstitute() {
    this.props.navigation.navigate("InstituteViewScreen", {
      data: this.state.data,
      name: "Institute Details" //this.state.data.name
    });
  }
  async _EditChannel(item) {
    this.props.navigation.navigate("ChannelDetailsScreen", {
      name: "Edit Channel",
      data: item
    });
  }

  async _ViewChannel(channels) {
    this.props.navigation.navigate("ChannelViewScreen", {
      data: channels, //this.state.channel,
      name: "Channel Details"
    });
  }
  render() {
    return (
      <View style={commonStyle.ContainerColumnWhite}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 5
            }}
          >
            <Thumbnail
              large
              source={
                this.state.data.logoURL != "#"
                  ? { uri: this.state.data.logoURL }
                  : require("../../../assets/NoImageAvailable.png")
              }
            />
            <Text
              textBreakStrategy="highQuality"
              style={{
                fontSize: 20,
                marginTop: 5,
                fontWeight: "bold",
                color: purpleColor,
                textAlign: "center"
              }}
            >
              {this.state.data.name}
            </Text>
            <Text style={{ color: darkGrayColor }}>
              {this.state.data.address}
            </Text>
            {this.state.data.isOwner == false ? (
              <View>
                <Icon
                  {...IconSet.Subscribe}
                  style={{
                    color: this.state.data.isSubscribedByMe
                      ? purpleColor
                      : darkGrayColor
                  }}
                  onPress={() => {
                    this._SubscribeInstitute();
                    this.state.data.isSubscribedByMe = !this.state.data
                      .isSubscribedByMe;
                  }}
                />
              </View>
            ) : (
              !this.state.loading && (
                <View style={{ flexDirection: "row" }}>
                  <Icon {...IconSet.Admin} style={{ color: purpleColor }} />
                  <Text
                    style={{
                      color: purpleColor,
                      justifyContent: "center",
                      alignContent: "center",
                      marginTop: 5
                    }}
                  >
                    Owned
                  </Text>
                </View>
              )
            )}
          </View>
          <View style={{ marginLeft: 10, marginTop: 5 }}>
            <Text style={{ color: darkGrayColor }}>CHANNEL LIST</Text>
          </View>
          <View style={{ flex: 1 }}>
            <List>
              <FlatList
                data={this.state.channelData}
                renderItem={({ item }) => (
                  <ListItem
                  // onPress={() => {
                  //   this._ViewChannel(item);
                  // }}
                    roundAvatar
                    title={
                      <View style={commonStyle.ContainerRow}>
                        <View style={{ flex: 1, marginTop: 5 }}> 
                        {item.owner_flag == true && (<Text style={{ marginLeft: 5 }} onPress={() => { this._ViewChannel(item); }}>{item.name}</Text>)}
                        { item.isSubscribedByMe == true && item.owner_flag != true && (<Text style={{ marginLeft: 5 }} onPress={() => { this._ViewChannel(item); }}>{item.name}</Text>)}
                        { item.isSubscribedByMe != true && item.owner_flag != true && (<Text style={{ marginLeft: 5 }} >{item.name}</Text>)}
                        </View>
                        <View style={{ marginRight: 5 }}>
                          {item.channelCategoryId == 2 && ( <Image style={{ margin: 10 }} source={require("../../../assets/lock.png")} />)}
                        </View>
                        <View style={{ marginRight: 10, marginTop: 5 }}>
                          { item.owner_flag ? ( <Icon {...IconSet.Edit} style={{ color: darkGrayColor }} onPress={() => { this._EditChannel(item); }}/>
                          ) : 
                          ( 
                          <Icon {...IconSet.Subscribe}  style={{  color: item.isSubscribedByMe ? purpleColor : darkGrayColor  }}  onPress={() => { this._SubsCribeUnSubscribeChannel(item.id); item.isSubscribedByMe = !item.isSubscribedByMe; }} />
                          )
                          }
                        </View>
                      </View>
                    }
                    avatar={{ uri: item.logoURL }}  hideChevron
                  />
                )}
                keyExtractor={item => item.id + ""}
              />
            </List>
          </View>
        </View>
        {this.state.loading && <ActivityIndicatorScreen />}
      </View>
    );
  }
}

export default InstituteChannelListScreen;
