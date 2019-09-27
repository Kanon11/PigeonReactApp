import React, { Component } from "react";
import { View, ScrollView, Image } from "react-native";
import { MapView } from "expo";
import { Item, Label, Text, Picker, Icon,Thumbnail } from "native-base";

import { commonStyle, purpleColor } from "../../Common/commonStyle";

import { GetMineInstitute } from "../../service/InstituteService";
import { GetChannelCategory } from "../../service/ChannelService";
class ChannelViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: this.props.navigation.state.params.data,
      Logo: null,
      InstituteId: 0,
      CategoryId: 0,

      InstituteList: [],
      CategoryList: [],
      mapRegion: {
        latitude: 23.769479415967716,
        latitudeDelta: 0.003700137275526316,
        longitude: 90.36702392622828,
        longitudeDelta: 0.0036186352372169495
      },
      marker: {
        latitude: 23.769479415967716,
        longitude: 90.36702392622828
      }
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

  componentWillMount() {
    this.unMounted = false;
    this.getCategory();
    this.getOwnInstitute();
  }
  componentDidMount() {

    if (
      this.state.data.latitute > 0 &&
      this.state.data.longitude > 0 &&
      this.state.data.latitudeDelta > 0 &&
      this.state.data.longitudeDelta > 0
    ) {
      this.setState({
        mapRegion: {
          latitude: this.state.data.latitute,
          latitudeDelta: this.state.data.latitudeDelta,
          longitude: this.state.data.longitude,
          longitudeDelta: this.state.data.longitudeDelta
        }
      });

      this.setState({
        marker: {
          latitude: this.state.data.latitute,
          longitude: this.state.data.longitude
        }
      });
    }
    if (this.state.data && this.state.data.id != undefined) {this.setState({Logo: this.state.data.logoURL});}
  }

  async getOwnInstitute() {
    //await GetOwnInstitute()
    await GetMineInstitute()
      .then(res => {
        //console.log(res)
        this.setState({
          InstituteList: res.result
        });
      })
      .catch(error => {
        console.log("error Occured");
      });
  }
  async getCategory() {
    await GetChannelCategory()
      .then(res => {
        this.setState({
          CategoryList: res.result
        });
      })
      .catch(error => {
        console.log("error Occured");
      });
  }

  render() {
    let { ImageThumb } = this.state.data.logoURL;
   
    return (
      <ScrollView style={{ backgroundColor: "white" }}>
        <View style={{ flex: 1, margin: 10 }}>
          <View style={{ alignSelf: "center" }}>
            <Thumbnail
              large
              source={
                this.state.Logo != null && this.state.Logo.length > 1
                  ? { uri: this.state.Logo }
                  : require("../../../assets/NoImageAvailable.png")
              }
            />
           </View>
          {this.state.InstituteList == null ? null : (
            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Institute Name</Label>
              <Item picker>
                <Picker
                  mode="dropdown"
                  enabled={false}
                  iosIcon={<Icon name="ios-arrow-down" />}
                  style={{ width: undefined }}
                  placeholder="Select a Category"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.data.instituteId}
                  onValueChange={value => {
                    this.setState({ InstituteId: value });
                  }}
                >
                  {this.state.InstituteList.map(function(type, i) {
                    return (
                      <Picker.Item
                        key={i}
                        label={type.label}
                        value={type.value}
                      />
                    );
                  })}
                </Picker>
              </Item>
            </Item>
          )}
          <Item stackedLabel>
            <Label style={commonStyle.labelInput}>Channel Name</Label>
            <Text style={{ alignSelf: "flex-start" }}>
              {this.state.data.name}
            </Text>
          </Item>
          <Item stackedLabel>
            <Label style={commonStyle.labelInput}>Channel Category</Label>
            <Item picker>
              <Picker
                mode="dropdown"
                enabled={false}
                iosIcon={<Icon name="ios-arrow-down" />}
                style={{ flex: 1 }}
                placeholder="Select a Category"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.CategoryId}
                onValueChange={selected => {
                  this.setState({ CategoryId: selected });
                }}
              >
                {this.state.CategoryList.map(function(type, i) {
                  return (
                    <Picker.Item
                      key={i}
                      label={type.label}
                      value={type.value}
                    />
                  );
                })}
              </Picker>
            </Item>
          </Item>
          {this.state.CategoryId == 2 ? (
            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Secure Pin</Label>
              <Text style={{ alignSelf: "flex-start" }}>
                {this.state.data.secure_pin}
              </Text>
            </Item>
          ) : null}

          <Item stackedLabel>
            <Label style={commonStyle.labelInput}>
              Contact Person Phone No.
            </Label>
            <Text style={{ alignSelf: "flex-start" }}>
              {this.state.data.contactPersonNo}
            </Text>
          </Item>

          <Item stackedLabel>
            <Label style={commonStyle.labelInput}>Contact Person E-mail</Label>
            <Text style={{ alignSelf: "flex-start" }}>
              {this.state.data.contactPersonEmail}
            </Text>
          </Item>

          <Item stackedLabel>
            <Label style={commonStyle.labelInput}>Location</Label>

            <MapView
              style={{ alignSelf: "stretch", height: 400 }}
              region={this.state.mapRegion}
            >
              <MapView.Marker
                draggable
                key={1}
                coordinate={this.state.marker}
                title={"Your Location"}
              />
            </MapView>
          </Item>
          <View style={{ marginBottom: 10 }} />
        </View>
      </ScrollView>
    );
  }
}

export default ChannelViewScreen;
