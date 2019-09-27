import React, { Component } from "react";
import { View, FlatList } from "react-native";
import { Button, SwipeRow, Text } from "native-base";
import { List, ListItem } from "react-native-elements";
import { purpleColor, darkGrayColor } from "../../Common/commonStyle";
import {
  GetChannelSubscribers,
  UnSubscribeChannelByUserId,
  AddChannelOwner,
  GetPendingInvitations,
  ResendInvitation,
  CancelInvitation
} from "../../service/ChannelService";
import ActivityIndicatorScreen from "../Common/ActivityIndicatorScreen";

class ChannelSubscriberListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelId: this.props.navigation.state.params.channelId,
      data: [],
      loading: false
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("name"),
      headerTintColor: purpleColor
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
    this._getSubscriberList(this.state.channelId);
    this._getPendingInvitations(this.state.channelId);
    this.setState({ loading: false });
  }

  async _getSubscriberList(channelId) {
    await GetChannelSubscribers(channelId)
      .then(res => {
        var result = [];
        res.result.forEach(function(element) {
          result.push({
            userId: element.user.id,
            invitationId:0,
            email: element.user.email,
            isActive: true,
            status:'Active'
          });
        });
        this.setState({
          data: result
        });
      })
      .catch(() => {
        console.log("error Occured");
      });
  }
  async _getPendingInvitations(channelId) {
    await GetPendingInvitations(channelId)
      .then(res => {
        var result=this.state.data;
        res.result.forEach(function(element) {
          result.push({
            userId: element.id,
            invitationId:element.id,
            email: element.inviteeEmail,
            isActive: false,
            status:'Pending'
          });
        });
        this.setState({
          data: result
        });
      })
      .catch(() => {
        console.log("error Occured");
      });
  }
  async _resendInvitation(invitationId) {
    try {
      let response = await ResendInvitation(invitationId);
      if (response && response.isSuccess) {
        this._getSubscriberList(this.state.channelId);
        this._getPendingInvitations(this.state.channelId);
      } else {
        if (response) {
        }
      }
    } catch (errors) {
      console.log(errors);
    }
  }
  async _cancelInvitation(invitationId) {
    try {
      let response = await CancelInvitation(invitationId);
      if (response && response.isSuccess) {
        this._getSubscriberList(this.state.channelId);
        this._getPendingInvitations(this.state.channelId);
      } else {
        if (response) {
        }
      }
    } catch (errors) {
      console.log(errors);
    }
  }
  async _unSubscribeChannel(userId) {
    try {
      let response = await UnSubscribeChannelByUserId(
        this.state.channelId,
        userId
      );
      if (response && response.isSuccess) {
        this._getSubscriberList(this.state.channelId);
        this._getPendingInvitations(this.state.channelId);
      } else {
        if (response) {
        }
      }
    } catch (errors) {
      console.log(errors);
    }
  }
  async _addChannelOwner(userId) {
    try {
      let response = await AddChannelOwner(this.state.channelId, userId);
      if (response && response.isSuccess) {
        this._getSubscriberList(this.state.channelId);
        this._getPendingInvitations(this.state.channelId);
      } else {
        if (response) {
        }
      }
    } catch (errors) {
      console.log(errors);
    }
  }

  render() {
    return (
      <View>
        <List
          containerStyle={{
            marginTop: 0,
            borderTopWidth: 0,
            borderBottomWidth: 0
          }}
        >
          <FlatList
            data={this.state.data}
            ListHeaderComponent={
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderBottomColor: darkGrayColor,
                  borderBottomWidth: 0.5,
                  marginTop: 2,
                  marginBottom: 2
                }}
              >
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{marginTop:5,marginBottom:5}}>E-mail</Text>
                  </View>
                  <View style={{ marginRight: 25 }}>
                    <Text style={{marginTop:5,marginBottom:5}}>Status</Text>
                  </View>
                </View>
            }
            renderItem={({ item }) => (
              <ListItem
                title={
                  <SwipeRow
                    leftOpenValue={130}
                    rightOpenValue={-150}
                    style={{ borderBottomColor: "white" }}
                    right={
                      item.isActive ? (
                        <Button
                          style={{ backgroundColor: purpleColor }}
                          onPress={() => this._unSubscribeChannel(item.userId)}
                        >
                          <Text>UNSUBSCRIBE</Text>
                        </Button>
                      ) : (
                        <Button
                          style={{ backgroundColor: purpleColor }}
                          onPress={() => this._cancelInvitation(item.invitationId)}
                        >
                          <Text>REMOVE</Text>
                        </Button>
                      )
                    }
                    left={
                      item.isActive ? (
                        <Button
                          style={{ backgroundColor: purpleColor }}
                          onPress={() => this._addChannelOwner(item.userId)}
                        >
                          <Text>MAKE OWNER</Text>
                        </Button>
                      ) : (
                        <Button
                          style={{ backgroundColor: purpleColor }}
                          onPress={() => this._resendInvitation(item.invitationId)}
                        >
                          <Text>RESEND EMAIL</Text>
                        </Button>
                      )
                    }
                    body={
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <View>
                          <Text>{item.email}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: "flex-end" }}>
                          <Text style={{ alignSelf: "flex-end" }}>{item.status}</Text>
                        </View>
                      </View>
                    }
                  />
                }
                hideChevron
              />
            )}
            keyExtractor={item => item.userId+''}
          />
        </List>
        {this.state.loading ? <ActivityIndicatorScreen /> : null}
      </View>
    );
  }
}

export default ChannelSubscriberListScreen;
