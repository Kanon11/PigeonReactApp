import React, { Component } from "react";
import { View, Text, ScrollView,FlatList  } from "react-native";
import { Image, Icon,Button,Container, Content } from "native-base";
import { Avatar, SearchBar  } from "react-native-elements";
import { GetDiscovers } from "../../service/DiscoverService";
import { SubscribeChannel } from "../../service/ChannelService";
import {purpleColor, darkGrayColor,commonStyle,IconSet,semiGrayColor} from "../../Common/commonStyle";
import { DrawerActions } from "react-navigation";
import ActivityIndicatorScreen from "../Common/ActivityIndicatorScreen";
import { black } from "ansi-colors";

class ChannelDiscoverScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      constData: [],
      text: null,
      loading: false,
      searchLoading: false
    };
  }

  setState(obj, func) {
    if (this.unMounted) return;
    super.setState(obj, func);
  }

  componentWillUnmount() {
    this.unMounted = true;
    this._getDiscoverChannel();
  }

  componentDidMount() {
    this.unMounted = false;
    this._getDiscoverChannel();
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Discover",
      headerTitleStyle: { color: purpleColor },
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

  _getDiscoverChannel() {
    GetDiscovers()
      .then(res => {
        this.setState({
          data: res.result,
          constData: res.result,
          loading: true
        });
      })
      .catch(error => {
        console.log("error Occured");
      });
      console.log(this.state.data);
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
  async _SubscribeChannel(channelId) {
    try {
      let response = await SubscribeChannel(channelId);
      if (response.isSuccess && response.result.success) {
        this._getDiscoverChannel();
      } else {
        alert("error occured");
      }
    } catch (errors) {
      alert("error occured");
    }
  }
  render() {
    
    return (
      <View style={commonStyle.ContainerColumn}>
        {this.state.loading == false ? (
          <ActivityIndicatorScreen />
        ) : (
          <View style={{ backgroundColor: "lightGrey" }}>
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
        
        { this.state.data ?
          <ScrollView style={{ marginBottom: 50 }}>
           <Text  style={{textAlign: "left", fontSize: 15, marginLeft: 15, marginTop: 5}}>Suggestion for you</Text>
          <View style={commonStyle.parent}>
            {this.state.data.map((value, index) => (
                <View style={commonStyle.child} key={"header" + value.fullName}>    
                  <View style={commonStyle.imageview}>
                      <Avatar width={100} height={100} rounded source={ value.logoURL != "#" ? { uri: value.logoURL }: require("../../../assets/NoImageAvailable.png")  }   activeOpacity={0.7} />
                      <View>
                        <Text numberOfLines = { 1 } ellipsizeMode = 'middle' style={{alignItems: 'center',justifyContent: 'center', alignSelf: 'center', fontSize: 14, color: "black" }}>{value.name}</Text>
                        <Text numberOfLines = { 1 } ellipsizeMode = 'middle' style={{alignItems: 'center',justifyContent: 'center', alignSelf: 'center', fontSize: 10, color: darkGrayColor }}>{value.inistitueName}</Text>
                          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}> 
                            <Button transparent  onPress={() => { this._SubscribeChannel(value.Id);}} title="Follow" ><Text style={{textAlign: 'center', color: "#865681" }}>Follow</Text></Button>
                          </View>                    
                      </View>
                  </View>           
                </View>
            ))}
            </View>
          </ScrollView>
          : null }
    
          </View>
        )}
      </View>
    );
  }
}

export default ChannelDiscoverScreen;
