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
  RemoveChannelOwner,
  GetChannelAdmins
} from "../../service/ChannelService";
import ActivityIndicatorScreen from "../Common/ActivityIndicatorScreen";
class ChannelAdminListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelId: this.props.navigation.state.params.channelId,
      data: {},
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
    this._getAdminList(this.state.channelId);
  }
  async _getAdminList(channelId) {
    this.setState({ loading: true });
    await GetChannelAdmins(channelId)
      .then(res => {
        this.setState({
          data: res.result
        });
      })
      .catch(error => {
        console.log("error Occured");
      });
    this.setState({ loading: false });
  }

  async _removeChannelOwner(channelOwnerId) {
    this.setState({ loading: true });
    try {
      let response = await RemoveChannelOwner(channelOwnerId);
      if (response && response.isSuccess) {
        this._getAdminList(this.state.channelId);
      } else {
        if (response) {
        }
      }
    } catch (errors) {
      console.log(errors);
    }
    this.setState({ loading: false });
  }
  render() {
    return (
      <View>
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
                      leftOpenValue={0}
                      rightOpenValue={-160}
                      stopLeftSwipe={0}
                      style={{ borderBottomColor: "white" }}
                      body={
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View>
                            <Text>{item.owner.email}</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: "flex-end" }}>
                            <Text style={{ alignSelf: "flex-end" }}>
                              Active
                            </Text>
                          </View>
                        </View>
                      }
                      right={
                        <Button
                          style={{ backgroundColor: purpleColor }}
                          onPress={() => this._removeChannelOwner(item.Id)}
                        >
                          <Text>REMOVE OWNER</Text>
                        </Button>
                      }
                    />
                  }
                  hideChevron
                />
              )}
              keyExtractor={item => item.owner.email}
            />
          </List>
        </View>

        {this.state.loading ? <ActivityIndicatorScreen /> : null}
      </View>
    );
  }
}

export default ChannelAdminListScreen;
