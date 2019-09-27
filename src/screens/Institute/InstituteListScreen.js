import React, { Component } from "react";
import { View, Text, Image, FlatList } from "react-native";
import { Container, Button, Icon, Fab } from "native-base";
import { List, ListItem,SearchBar } from "react-native-elements";
import { GetSubscribeAndOwnInstituteByUser } from "../../service/InstituteService";
import { purpleColor, darkGrayColor, commonStyle, IconSet } from "../../Common/commonStyle";
import { DrawerActions } from "react-navigation";
import ActivityIndicatorScreen from "../Common/ActivityIndicatorScreen";
class InstituteListScreen extends Component {
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
      title: "Institute List",
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
    this._getInstituteList();
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this._getInstituteList();
      }
    );
  }
  componentWillReceiveProps() {
    this._getInstituteList();
  }
  _getInstituteList() {
    this.setState({ loading: true });
    GetSubscribeAndOwnInstituteByUser()
      .then(res => {
        this.setState({
          data: res.result,
          constData: res.result,
          loading: false
        });
      })
      .catch(() => {
        console.log("error Occured");
      });
  }
  _CreateInstitute() {
    this.props.navigation.navigate("InstituteDetailsScreen", { data: {} });
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

  async _showInstituteChannelListScreen(instituteObj) {
    this.props.navigation.navigate("InstituteChannelListScreen", {
      instituteId: instituteObj.id,
      institute: instituteObj
    });
  }
  render() {
    return (
      <Container style={commonStyle.ContainerColumn}>
      <SearchBar
              lightTheme
              containerStyle={{ backgroundColor: "white" }}
              inputStyle={{ backgroundColor: "white" }}
              showLoadingIcon={this.state.searchLoading}
              clearIcon={{ color: darkGrayColor }}
              onChangeText={text => this.filterSearch(text)}
              value={this.state.text}
              placeholder="  Search Institute"
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
                ListFooterComponent={<View style={{ margin: 40 }} />}
                data={this.state.data}
                renderItem={({ item }) => (
                  <ListItem
                    onPress={() => {
                      this._showInstituteChannelListScreen(item);
                    }}
                    roundAvatar
                    title={
                      <View style={commonStyle.ContainerRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ marginLeft: 5 }}>{item.name}</Text>
                        </View>
                        {item.isOwner == true ? (
                          <View>
                            <Image
                              source={require("../../../assets/Admin.png")}
                            />
                          </View>
                        ) : null}
                      </View>
                    }
                    avatar={{ uri: item.logoURL }}
                    hideChevron
                  />
                )}
                keyExtractor={item => item.id + ""}
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
            this._CreateInstitute();
          }}
        >
          <Icon name="add" android="md-add" ios="ios-add" />
        </Fab>
        {this.state.loading && <ActivityIndicatorScreen />}
      </Container>
    );
  }
}

export default InstituteListScreen;
