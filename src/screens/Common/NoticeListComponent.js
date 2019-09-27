import React, { Component } from "react";
import { ScrollView, View, TouchableOpacity, Image, Alert  } from "react-native"; //Picker
import { Avatar } from "react-native-elements";
import { commonStyle, IconSet, darkGrayColor } from "../../Common/commonStyle";
import { GetCommonNoticeFeed, GetChannelNoticeFeed, saveNotice, unsaveNotice, likeNotice, unlikeNotice, deleteNotice, castChannelVote } from "../../service/NoticeService";
import { RenderNoticeInfo } from "./RenderNoticeInfo";
import { Item, Icon, Text, Right, ActionSheet, Button, Picker } from "native-base";
import { Card, CardSection } from './../../layouts'
import ActivityIndicatorScreen from "../Common/ActivityIndicatorScreen";
import { purpleColor } from "../../Common/commonStyle";
import SegmentControl from 'react-native-segment-control'

// - Import component styles 
import styles from './styles'
import { black } from "ansi-colors";

class NoticeListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unMounted: false,
      loading: false,
      refreshing: false,
      data: [],
      currentSelectedValue: 1,
      noticeId: null,
      commonNotice: false,
      selectedFilter: "1"
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
    this.initForm();
  }

  componentWillReceiveProps() {
    let refreshing = this.props.refreshing;
    if (refreshing) {
      this.initForm();
    }
  }

  showLoading() {
    this.setState({ loading: true });
  }

  hideLoading() {
    this.setState({ loading: false });
  }

  async initForm() {
    this.setState({ data: [] });
    let channel = this.props.navigation.state.params
      ? this.props.navigation.state.params.channel
      : null;
    if (channel) {
      this.getChannelNoticeFeed(channel.id);
    } else {
      this.getCommonNoticeFeed(this.state.currentSelectedValue);
      this.setState({ commonNotice: true });
    }
  }

  async getChannelNoticeFeed(channelId) {
    this.showLoading();
    await GetChannelNoticeFeed(channelId)
      .then(res => {
        this.setState({
          data: res.result,
          refreshing: false
        });

        this.props.callback(this.state);
      })
      .catch(error => {
        console.log(error);
      });

    this.hideLoading();
  }

  async getCommonNoticeFeed(feedTypeid) {
    this.showLoading();
    await GetCommonNoticeFeed(feedTypeid, "")
      .then(res => {
        this.setState({
          data: res.result
        });
        console.log("Shared Value Checke: {0}",res.result);
      })
      .catch(error => {
        this.setState({ error });
        console.log(error);
      });

    this.hideLoading();
  }
  onUpdateNotice = (notice, type) => {
    let tempData = this.state.data.map(item => {
      if (item.id === notice.id) {
        if (type === "save") {
          item.issaved = !item.issaved;
        } else if (type === "like") {
          item.isliked === true
            ? (item.total_like -= 1)
            : (item.total_like += 1);
          item.isliked = !item.isliked;
        }
      }
      return item;
    });
    this.setState({ data: tempData });
  };
  onDeleteNotice = notice => {
    let tempData = this.state.data.filter(item => item.id !== notice.id);
    this.setState({ data: tempData });
  };
  async saveNotice(notice) {
    this.showLoading();
    try {
      let response = await saveNotice(notice.id);
      if (response && response.isSuccess) {
        this.onUpdateNotice(notice, "save");
      } else {
        if (response) {
        }
      }
    } catch (errors) {
      console.log(errors);
    }
    this.hideLoading();
  }
  async unsaveNotice(notice) {
    this.showLoading();
    try {
      let response = await unsaveNotice(notice.id);
      if (response && response.isSuccess) {
        this.onUpdateNotice(notice, "save");
      } else {
        if (response) {
          // console.log(response.message);
        }
      }
    } catch (errors) {
      console.log(errors);
    }
    this.hideLoading();
  }

  async shareNotice(noticeId) {
    this.props.navigation.navigate("NoticeShareScreen", { noticeId: noticeId });
  }
  async likeNotice(notice) {
    try {
      this.showLoading();
      let response = await likeNotice(notice.id);
      if (response && response.isSuccess) {
        this.onUpdateNotice(notice, "like");
      } else {
        if (response) {
          // console.log(response.message);
        }
      }
    } catch (errors) {
      console.log(errors);
    }

    this.hideLoading();
  }
  async unlikeNotice(notice) {
    this.showLoading();
    try {
      let response = await unlikeNotice(notice.id);
      if (response && response.isSuccess) {
        this.onUpdateNotice(notice, "like");
      } else {
        if (response) {
          // console.log(response.message);
        }
      }
    } catch (errors) {
      console.log(errors);
    }
    this.hideLoading();
  }
  async deleteNotice(notice) {
    this.showLoading();
    try {
      let response = await deleteNotice(notice.id);
      if (response && response.isSuccess) {
        this.onDeleteNotice(notice);
      } else {
        if (response) {
          // console.log(response.message);
        }
      }
    } catch (errors) {
      console.log(errors);
    }
    this.hideLoading();
  }
  async voteCast(noticeID, voteType) {
    this.showLoading();
    try {
      let response = await castChannelVote(noticeID, voteType);
      if (response && response.isSuccess) {
        this.initForm();
      } else {
        if (response) {
          // console.log(response.message);
        }
      }
    } catch (errors) {
      console.log(errors);
    }
    this.hideLoading();
  }
  async viewReport(noticeID) {
    this.props.navigation.navigate("ReportViewScreen", { noticeID: noticeID });
  }
  onValueChange(value) {
    this.showLoading();
    console.log(value);
    this.setState({ selectedFilter: value, currentSelectedValue: value  });
    this.getCommonNoticeFeed(value);
  }

  showNoticeContextMenu(notice) {
    var BUTTONS = [];

    BUTTONS.push({
      text: notice.issaved ? "Saved" : "Save",
      icon: "bookmark",
      iconColor: notice.issaved ? purpleColor : darkGrayColor
    });

    if (notice.ischannel_owner) {
      if (notice.is_voting_enabled) {
        BUTTONS.push({
          text: "Report",
          icon: "clipboard",
          iconColor: purpleColor
        });
      }

      BUTTONS.push({ text: "Delete", icon: "trash", iconColor: darkGrayColor });
    }

    BUTTONS.push({ text: "Cancel", icon: "close", iconColor: darkGrayColor });

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1
      },
      buttonIndex => {
        var buttonText = BUTTONS[buttonIndex].text;
        if (buttonText == "Save" || buttonText == "Saved") {
          this.showLoading();
          notice.issaved ? this.unsaveNotice(notice) : this.saveNotice(notice);
        }
        if (buttonText == "Delete") {
          Alert.alert(
            "Confirmation",
            "Do you want to delete?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "OK",
                onPress: () => this.deleteNotice(notice)
              }
            ],
            { cancelable: false }
          );
        }
        if (buttonText == "Report") {
          this.viewReport(notice.id);
        }
        // if (buttonText == "View Channel") {
        //   channelNoticeListScreen._ViewChannel();
        // }
        // if (buttonText == "Admins") {
        //   channelNoticeListScreen._ViewAdmins();
        // }
      }
    );
  }



  render() {
    return (

   <View style={commonStyle.ContainerBackground}>
      {this.state.commonNotice == true ? (
          //  <Item picker>
            <Picker
              mode="dropdown"
              placeholder="Select Filter"
              iosHeader="Select Filter"
              iosIcon={<Icon name="ios-arrow-down" />}
              selectedValue={this.state.selectedFilter}
              onValueChange={value => { this.onValueChange(value); }}>
              <Picker.Item label="Notice Feed" value="1" />
              <Picker.Item label="Trending" value="2" />
              <Picker.Item label="Deals" value="3" />
              <Picker.Item label="Shared" value="4" />
              <Picker.Item label="Saved" value="5" />
            </Picker>
          //</Item>

          // <Picker style={{ color: '#344953',justifyContent: "center"}} selectedValue={this.state.selectedFilter} onValueChange={value => { this.onValueChange(value); }}>
          //   <Picker.Item label="Notice Feed" value="1" />
          //   <Picker.Item label="Trending" value="2" />
          //   <Picker.Item label="Deals" value="3" />
          //   <Picker.Item label="Shared" value="4" />
          //   <Picker.Item label="Saved" value="5" />
          // </Picker>

        ) : null}
        {this.state.data != null ?
          (
            <ScrollView>
              {this.state.data.map((item, index) => (
                <View key={"header" + item.id}>
                  <Card style={styles.post} >
                    <CardSection style={styles.header}>
                      {item.channel_logo == null ? (
                        <Avatar rounded source={require("../../../assets/NoImageAvailable.png")} activeOpacity={0.7} />) : (
                          <Avatar rounded source={{ uri: item.channel_logo }} activeOpacity={0.7} />
                        )}
                      <View style={{ marginLeft: 5, marginTop: 3 }}>
                        <Text style={{  fontSize: 15, color: '#000000' }}>
                          {item.channel_name}
                        </Text>
                        <Text style={{ color: darkGrayColor, fontSize: 12 }}>
                          {item.creationTimeFormatted}
                        </Text>
                      </View>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <Right style={{ width: 20 }}>
                          <Button transparent onPress={() => this.showNoticeContextMenu(item)} >
                            <Icon  {...IconSet.SecondMenu} style={{ color: darkGrayColor }} />
                          </Button>
                        </Right>
                      </View>
                    </CardSection>

                    <View style={styles.body}>
                      <View style={styles.bodyText}><RenderNoticeInfo notice={item} navigation={this.props.navigation} /></View>
                    </View>

                    <CardSection style={styles.footer}>
                    <View style={styles.footerLeft}>
                    <View style={{ flexDirection: "row", width: 55, alignItems: "center" }} >
                            <Icon {...IconSet.Like} style={{ color: item.isliked ? purpleColor : darkGrayColor }} onPress={() => { item.isliked ? this.unlikeNotice(item) : this.likeNotice(item); }} />
                            {item.total_like > 0 && (<Text style={{ marginLeft: 6, color: darkGrayColor, fontSize: 16 }} > {item.total_like} </Text>)}
                          </View>
                    <View  style={{ flexDirection: "row", width: 55, alignItems: "center" }}>
                          <Icon {...IconSet.Share} style={{ color: item.isliked ? purpleColor : darkGrayColor }} onPress={() => { this.shareNotice(item.id); }} />
                          {item.total_share > 0 && (<Text style={{ marginLeft: 6, color: darkGrayColor, fontSize: 16 }} > {item.total_share} </Text>)}
                        </View>
                   </View>
                   <View style={styles.footerLeft}>
                     <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {item.is_voting_enabled && (
                          <View>
                            <Text style={{ color: purpleColor, fontSize: 11,flexDirection: "row",  textAlign: "left" }}> Expiry Date </Text>
                            <Text style={{ color: purpleColor, fontSize: 11, fontWeight: "600",flexDirection: "row", textAlign: "center" }} >{item.votingLastDateString}</Text>
                          </View>
                        )}
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                       {!item.ischannel_owner && item.is_voting_enabled && (
                            <View style={{ flexDirection: "row", width: 55, alignItems: "center" }}>

                              {item.can_vote && (
                                <View style={{ flexDirection: "row", alignItems: "center" }} >
                                  <Icon {...IconSet.YesVote} style={{ color: purpleColor, marginRight: 5 }} onPress={() => { this.voteCast(item.id, "up"); }} />
                                  <Icon {...IconSet.NoVote} style={{ color: purpleColor }} onPress={() => { this.voteCast(item.id, "down"); }} />
                                </View>
                              )}

                              {item.isUp_vote && item.isvote_casted && (<Icon {...IconSet.YesVote} style={{ color: darkGrayColor }} />)}
                              {item.isDown_vote && item.isvote_casted && (<Icon {...IconSet.NoVote} style={{ color: darkGrayColor }} />)}
                            </View>
                          )}
                    </View>
                    </View>
                    </CardSection>

                  </Card>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <Text style={{ color: darkGrayColor }}>No Result Found!</Text>
            </View>
          )
        }
        {this.state.loading && <ActivityIndicatorScreen />}
        </View>
    );
  }
}

export default NoticeListComponent;
