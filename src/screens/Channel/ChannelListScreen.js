import React, { Component } from "react";
import { View, Image, FlatList } from "react-native";
import { Button, Icon, Fab } from "native-base";
import { List, ListItem,SearchBar } from "react-native-elements";
import { DrawerActions } from "react-navigation";
import { GetChannelList } from "../../service/ChannelService";
import { purpleColor, darkGrayColor, commonStyle, IconSet } from "../../Common/commonStyle";
import ActivityIndicatorScreen from "../Common/ActivityIndicatorScreen";
class ChannelListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      constData: [],
      loading: false,
      text: null,
      searchLoading: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Channel List",
      headerTintColor: purpleColor,
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

  componentDidMount() {
    this.unMounted = false;
    this.setState({ loading: true });
    this._getChannelList();
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this._getChannelList();
      }
    );
  }
  async _getChannelList() {
    await GetChannelList()
      .then(res => {
        this.setState({
          data: res.result,
          constData:res.result,
          loading: false
        });
      })
      .catch(() => {
        console.log("error Occured");
      });

  }
  createChannel() {
    this.props.navigation.navigate("ChannelDetailsScreen", {
      data: {},
      showInstitute: true
    });
  }

  filterSearch(text) {
    this.setState({ searchLoading: true });
    const newData = this.state.constData.filter(function(item) {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
      text: text,
      searchLoading: false
    });
  }

  showChannelNoticeList(channel) {
    this.props.navigation.navigate("ChannelNoticeListScreen", {
      title: channel.name,
      channel: channel
    });
  }
  render() {
    return (
      <View style={commonStyle.ContainerColumn}>
       <SearchBar
              lightTheme
              containerStyle={{ backgroundColor: "white" }}
              inputStyle={{ backgroundColor: "white" }}
              showLoadingIcon={this.state.searchLoading}
              clearIcon={{ color: darkGrayColor }}
              onChangeText={text => this.filterSearch(text)}
              value={this.state.text}
              placeholder="  Search Channels"
            />
        <View style={commonStyle.ContainerColumn}>
          <View style={commonStyle.ContainerColumnWhite}>
            <List
              containerStyle={{
                marginTop: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0
              }}
            >
              <FlatList
                data={this.state.data}
                ListFooterComponent={<View style={{ margin: 40 }} />}
                renderItem={({ item }) => {
                  return (
                    <ListItem
                      onPress={() => {
                        this.showChannelNoticeList(item);
                      }}
                      roundAvatar
                      title={item.name}
                      subtitle={item.description}
                      avatar={{ uri: item.logoURL }}
                      rightIcon={
                        <View style={{ flexDirection: "row" }}>
                          {item.new_notice_indicator == "*" && (
                            <Image
                              source={require("../../../assets/notification_purple_icon.png")}
                            />
                          )}
                          {item.owner_flag && (
                            <Icon
                              {...IconSet.Admin}
                              style={{ color: purpleColor }}
                            />
                          )}
                          {item.isUniqueChannel && (
                            <Icon
                              {...IconSet.UniqueChannel}
                              style={{ color: purpleColor }}
                            />
                          )}
                        </View>
                      }
                      // hideChevron
                    />
                  );
                }}
                keyExtractor={item => item.id + ""}
                removeClippedSubviews={false}
              />
            </List>
          </View>
        </View>
        <Fab
          active={false}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: purpleColor }}
          position="bottomRight"
          onPress={() => {
            this.createChannel();
          }}
        >
          <Icon name="add" android="md-add" ios="ios-add" />
        </Fab>
        {this.state.loading && <ActivityIndicatorScreen />}
      </View>
    );
  }
}

export default ChannelListScreen;
