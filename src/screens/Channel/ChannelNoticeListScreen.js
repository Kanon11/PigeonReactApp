import React, { Component } from "react";
import {
  Alert,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ImagePicker, DocumentPicker } from "expo";
import NoticeListComponent from "../Common/NoticeListComponent";
import {
  PostTextNotice,
  PostImageNotice,
  PostPdfNotice,
  GetChannelNotice
} from "../../service/ChannelService";

import {
  Button,
  ActionSheet,
  DatePicker,
  Switch,
  Text,
  Icon,
  Toast,
  Textarea,
} from "native-base";
import ChannelSubscriberListScreen from "./ChannelSubscriberListScreen";
import {
  purpleColor,
  darkGrayColor,
  commonStyle,
  IconSet
} from "../../Common/commonStyle";
import ActivityIndicatorScreen from "../Common/ActivityIndicatorScreen";

var channelNoticeListScreen;

class ChannelNoticeListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOwner: false,
      loading: false,
      refreshing: false,
      channel: this.props.navigation.state.params.channel,
      isOwnerFlag: false,
      isUniqueChannel: false,
      noticeText: "",
      mediaText: "",
      subscribeModal: false,
      image: null,
      pdf: null,
      noticeType: "",
      votingLastDate: new Date(),
      isVotingEnabled: false
    };
    this.setDate = this.setDate.bind(this);
    channelNoticeListScreen = this;
  }
  static navigationOptions = ({ navigation }) => {
    var BUTTONS = [];
    var CANCEL_INDEX = 2;
    var channelObj = navigation.getParam("channel");

    if (channelObj.owner_flag) {
      BUTTONS.push({
        text: "Edit Channel",
        type: "MaterialIcons",
        icon: "open",
        iconColor: darkGrayColor
      });
      BUTTONS.push({
        text: "Subscribers",
        icon: "aperture",
        iconColor: darkGrayColor
      });

      BUTTONS.push({
        text: "Admins",
        icon: "person",
        iconColor: purpleColor
      });
    }
    BUTTONS.push({
      text: "View Channel",
      icon: "eye",
      iconColor: darkGrayColor
    });
    BUTTONS.push({
      text: "Send Invitation",
      icon: "mail",
      iconColor: purpleColor
    });
    BUTTONS.push({ text: "Cancel", icon: "close", iconColor: darkGrayColor });
    CANCEL_INDEX = BUTTONS.length - 1;
    return {
      title:
        typeof navigation.state.params === "undefined" ||
        typeof navigation.state.params.title === "undefined"
          ? "Channel Notice List"
          : navigation.state.params.title,
      headerTintColor: purpleColor,
      headerRight: (
        <Button
          transparent
          onPress={() =>
            ActionSheet.show(
              {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX
              },
              buttonIndex => {
                var buttonText = BUTTONS[buttonIndex].text;
                if (buttonText == "Edit Channel") {
                  channelNoticeListScreen._EditChannel();
                }
                if (buttonText == "Send Invitation") {
                  channelNoticeListScreen._SendInvitaion();
                }
                if (buttonText == "Subscribers") {
                  channelNoticeListScreen._SubscriberList();
                }
                if (buttonText == "View Channel") {
                  channelNoticeListScreen._ViewChannel();
                }
                if (buttonText == "Admins") {
                  channelNoticeListScreen._ViewAdmins();
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

  callback() {
    this.setState({ refreshing: false });
  }

  setState(obj, func) {
    if (this.unMounted) return;
    super.setState(obj, func);
  }

  componentWillUnmount() {
    this.unMounted = true;
  }

  componentDidMount() {
    console.log(this.state.channel);
    this.unMounted = false;
    this.setState({ isUniqueChannel: this.state.channel.isUniqueChannel });
    this.setState({ isOwnerFlag: this.state.channel.owner_flag });

    console.log(this.state.channel.owner_flag);
    console.log(this.state.channel.isUniqueChannel);
  }
  async _postNotice() {
    this.setState({
      loading: true
    });
    if (this.state.noticeType == "Image") {
      this._postImage();
    } else if (this.state.noticeType == "Pdf") {
      this._postPdf();
    } else {
      this._postTextNotice();
    }
    this.setState({ isUniqueChannel: this.state.isUniqueChannel });
    this.setState({ isOwnerFlag: this.state.isOwnerFlag });
  }
  async _getChannelNoticeList() {
    await GetChannelNotice(this.state.channel.id)
      .then(res => {
        this.setState({
          channel: res.result,
          refreshing: true
        });
        this.setState({ refreshing: true });
      })
      .catch(() => {
        console.log("error Occured");
      });
  }
  async _postTextNotice() {
    if (!this.state.noticeText) {
      Toast.show({
        text: "No Text Added",
        buttonText: "Okay",
        type: "warning",
        duration: 3000,
        position: "bottom"
      });
      this.setState({
        loading: false
      });
      return;
    }
    let data = {
      Text: this.state.noticeText,
      ChannelId: this.state.channel.id,
      IsVotingEnabled: this.state.isVotingEnabled,
      VotingLastDate: this.state.isVotingEnabled
        ? this.state.votingLastDate
        : ""
    };
    try {
      let response = await PostTextNotice(data);
      if (response && response.isSuccess) {
        this.setState({
          loading: false
        });
        this.setState({
          noticeText: ""
        });
        this._getChannelNoticeList();
      } else {
        if (response) {
        }
      }
    } catch (errors) {
      console.log(errors);
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: false,
      quality: 1
    });

    if (!result.cancelled) {
      let dotParts = result.uri.split(".");
      let slashParts = dotParts[dotParts.length - 2].split("/");
      this.setState({
        mediaText:
          "IMG_" +
          slashParts[slashParts.length - 1] +
          "." +
          dotParts[dotParts.length - 1]
      });
      this.setState({ image: result.uri });
      this.setState({ noticeType: "Image" });
      console.log(result);
    }
  };
  _addPdf = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false
    });

    if (result.type == "success") {
      this.setState({ pdf: result.uri });
      this.setState({ mediaText: result.name });
      this.setState({ noticeType: "Pdf" });
    }
  };
  async _postPdf() {
    if (!this.state.pdf) {
      Toast.show({
        text: "No Pdf Selected",
        buttonText: "Okay",
        type: "warning",
        duration: 3000,
        position: "bottom"
      });

      return;
    }

    this.setState({
      loading: true
    });
    try {
      var d = this.state.votingLastDate;

      var dateString =
        ("00" + d.getDate()).slice(-2) +
        "-" +
        ("00" + (d.getMonth() + 1)).slice(-2) +
        "-" +
        d.getFullYear() +
        " " +
        ("00" + d.getHours()).slice(-2) +
        ":" +
        ("00" + d.getMinutes()).slice(-2) +
        ":" +
        ("00" + d.getSeconds()).slice(-2);

      let response = await PostPdfNotice(
        {},
        this.state.pdf,
        "files.pdf",
        this.state.mediaText,
        this.state.channel.id,
        this.state.isVotingEnabled,
        this.state.isVotingEnabled ? dateString : ""
      );
      if (response && response.isSuccess) {
        this.setState({
          loading: false
        });
        this.setState({
          mediaText: ""
        });
        this._getChannelNoticeList();
      } else {
        if (response) {
        }
      }
    } catch (errors) {
      console.log(errors);
    }
  }
  async _postImage() {
    if (!this.state.image) {
      Toast.show({
        text: "No Image Selected",
        buttonText: "Okay",
        type: "warning",
        duration: 3000,
        position: "bottom"
      });

      return;
    }
    this.setState({
      loading: true
    });
    try {
      let uriParts = this.state.image.split(".");
      let fileType = uriParts[uriParts.length - 1];

      var d = this.state.votingLastDate;

      var dateString =
        ("00" + d.getDate()).slice(-2) +
        "-" +
        ("00" + (d.getMonth() + 1)).slice(-2) +
        "-" +
        d.getFullYear() +
        " " +
        ("00" + d.getHours()).slice(-2) +
        ":" +
        ("00" + d.getMinutes()).slice(-2) +
        ":" +
        ("00" + d.getSeconds()).slice(-2);

      let response = await PostImageNotice(
        {},
        this.state.image,
        `image/${fileType}`,
        `files.${fileType}`,
        this.state.channel.id,
        this.state.isVotingEnabled,
        this.state.isVotingEnabled ? dateString : ""
      );
      if (response && response.isSuccess) {
        this.setState({
          mediaText: ""
        });
        this._getChannelNoticeList();
      } else {
        if (response) {
        }
      }
    } catch (errors) {
      console.log(errors);
    } finally {
      this.setState({
        loading: false
      });
    }
  }
  async _addMediafile() {
    this.setState({ noticeText: "" });
    var MediaButtons = [];
    MediaButtons.push({
      text: "Image",
      icon: "image",
      iconColor: "#2c8ef4"
    });
    MediaButtons.push({
      text: "Pdf",
      icon: "document",
      iconColor: "#ea943b"
    });
    MediaButtons.push({
      text: "Cancel",
      icon: "close",
      iconColor: "#25de5b"
    });
    ActionSheet.show(
      {
        options: MediaButtons,
        cancelButtonIndex: 2
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this._pickImage();
            break;
          case 1:
            this._addPdf();
            break;
        }
      }
    );
  }
  async _addFile() {
    if (this.state.noticeText != "") {
      Alert.alert(
        "Alert",
        "Are you sure want to select file to post notice? The text you typed will be lost.",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => this._addMediafile() }
        ],
        { cancelable: false }
      );
    } else {
      this._addMediafile();
    }
  }
  async _removeFile() {
    Alert.alert(
      "Confirmation",
      "Do you want to delete this File?",
      [
        {
          text: "NO",
          onPress: () => console.log("No Pressed"),
          style: "cancel"
        },
        { text: "YES", onPress: () => this.setState({ mediaText: "" }) }
      ],
      { cancelable: false }
    );
  }

  EditChannelCallback(parent, channel) {
    console.log(channel);
    parent.setState({ refreshing: true, channel: channel });
    parent.props.navigation.setParams({ title: channel.name });
  }

  async _EditChannel() {
    console.log(this.state.channel);
    this.props.navigation.navigate("ChannelDetailsScreen", {
      data: this.state.channel,
      name: "Edit Channel",
      callback: this.EditChannelCallback,
      parent: this
    });
  }
  async _ViewChannel() {
    this.props.navigation.navigate("ChannelViewScreen", {
      data: this.state.channel,
      name: "Channel Details"
    });
  }
  async _SendInvitaion() {
    this.props.navigation.navigate("ChannelInviteScreen", {
      channelId: this.state.channel.id,
      name: "Send Invitation"
    });
  }
  async _ViewAdmins() {
    this.props.navigation.navigate("ChannelAdminListScreen", {
      channelId: this.state.channel.id,
      name: "Admins"
    });
  }
  async _SubscriberList() {
    this.props.navigation.navigate("ChannelSubscriberListScreen", {
      channelId: this.state.channel.id,
      isAdmin: false,
      name: "Subscribers"
    });
  }
  setDate(newDate) {
    this.setState({ votingLastDate: newDate });
  }
  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 90 })}
        enabled
        style={{ flex: 1 }}
      >
        <View style={commonStyle.ContainerColumn}>
          <View style={commonStyle.ContainerColumn}>
            <NoticeListComponent navigation={this.props.navigation} channel={this.state.channel} refreshing={this.state.refreshing}  callback={this.callback.bind(this)} />
            {this.state.subscribeModal == true ? (
              <ChannelSubscriberListScreen channelId={this.state.channel.id} />
            ) : null}
            {this.state.isOwnerFlag && !this.state.isUniqueChannel ? (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    borderTopColor: "gray",
                    borderTopWidth: 1,
                    padding: 5,
                    backgroundColor: "#f8f8ff",
                  }}
                >
                  <Button
                    ref="btnSend"
                    transparent
                    onPress={() => {
                      this.state.mediaText == ""
                        ? this._addFile()
                        : this._removeFile();
                    }}
                  >
                    <Image
                      source={
                        this.state.mediaText == ""
                          ? require("../../../assets/FileAdd.png")
                          : require("../../../assets/Cross.png")
                      }
                      style={{
                        marginTop:10,
                        marginRight:1,
                        width: this.state.mediaText == "" ? 20 : 15,
                        height: this.state.mediaText == "" ? 20 : 15
                      }}
                    />
                  </Button>

                  {this.state.mediaText == "" ? (
                
                   <Textarea
                      rowSpan={1.5}
                      style={{
                        flex: 1,
                        margin: 10,
                        marginLeft:16,
                        backgroundColor: "white",
                        borderRadius:20,
                        borderColor: '#111111',
                        borderWidth: .8,
                      }}
                      onChangeText={text => this.setState({ noticeText: text })}
                      value={this.state.noticeText}
                      placeholder="Write a message..."
                      underlineColorAndroid='transparent'
                    />
                   
                  ) : (
                    <Text
                      style={{ flex: 1, margin: 10, backgroundColor: "white" }}
                    >
                      {this.state.mediaText}
                    </Text>
                  )}

                  <View style={{backgroundColor:purpleColor,width:40,height:40, marginTop:10,marginRight:10, borderRadius:360,}}>
                    <Icon
                      {...IconSet.SendNotice}
                      style={{ color: "#FFFFFF",margin:5, width:35,height:35, }}
                      onPress={() => {
                        this._postNotice();
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    height: 40,
                    alignItems: "center",
                    backgroundColor: "#f8f8ff",
                  }}
                >
                  <View style={commonStyle.ContainerRow}>
                    <Switch
                      onValueChange={value =>
                        this.setState({ isVotingEnabled: value })
                      }
                      style={{ shadowColor: purpleColor }}
                      value={this.state.isVotingEnabled}
                    />

                    <Text style={{ color: darkGrayColor }}>Vote</Text>
                  </View>
                  {this.state.isVotingEnabled == true ? (
                    <View
                      style={{
                        flexDirection: "row",
                        marginRight: 10
                      }}
                    >
                      <Text style={{ color: darkGrayColor, marginTop: 10 }}>
                        Duration:
                      </Text>
                      <DatePicker
                        defaultDate={new Date()}
                        minimumDate={new Date()}
                        maximumDate={new Date(2050, 12, 31)}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"slide"}
                        androidMode={"default"}
                        textStyle={{ color: purpleColor }}
                        onDateChange={this.setDate}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
            ) : null}
          </View>
        </View>
        {this.state.loading ? <ActivityIndicatorScreen /> : null}
      </KeyboardAvoidingView>
    );
  }
}

export default ChannelNoticeListScreen;
