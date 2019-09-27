import React, { Component } from "react";
import {
  View,
  ScrollView,
  Image
} from "react-native";
import {
  MapView,
} from "expo";
import {
  commonStyle,
  purpleColor
} from "../../Common/commonStyle";

import {
    GetInstituteCategory,
    GetInstituteType
  } from "../../service/InstituteService";
import {
  Item,
  Label,
  Text,
  Picker,
  Icon
} from "native-base";
import ActivityIndicatorScreen from "../Common/ActivityIndicatorScreen";

class InstituteViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data : this.props.navigation.state.params.data,
      instituteCategoryId: 0,
      instituteCategory: [],
      instituteTypeId: 0,
      instituteType: [],
      mapRegion: {
        latitude: 23.769479415967716,
        latitudeDelta: 0.003700137275526316,
        longitude: 90.36702392622828,
        longitudeDelta: 0.0036186352372169495
      },
      marker: {
        latitude: 23.769479415967716,
        longitude: 90.36702392622828
      },
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("name", "Create Institute"),
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
    this.getType();
  }

  componentDidMount() {
    this.initData();
  }

  showLoading() {
    this.setState({ loading: true });
  }

  hideLoading() {
    this.setState({ loading: false });
  }
  async initData() {
    this.showLoading();
    let data = this.props.navigation.state.params.data;
      if (
        data.latitute > 0 &&
        data.longitude > 0 &&
        data.latitudeDelta > 0 &&
        data.longitudeDelta > 0
      ) {
        this.setState({
          mapRegion: {
            latitude: data.latitute,
            latitudeDelta: data.latitudeDelta,
            longitude: data.longitude,
            longitudeDelta: data.longitudeDelta
          }
        });

        this.setState({
          marker: {
            latitude: data.latitute,
            longitude: data.longitude
          }
        });
      }
    this.hideLoading();
  }

  async getType() {
    await GetInstituteType()
      .then(res => {
        this.setState({
          instituteType: res.result
        });
      })
      .catch(() => {
        console.log("error occured");
      });
  }
  async getCategory() {
    await GetInstituteCategory()
      .then(res => {
        this.setState({
          instituteCategory: res.result
        });
      })
      .catch(() => {
        console.log("error occured");
      });
  }
  render() {
    let { imageThumb } = this.state;
    return (
        <ScrollView style={{ backgroundColor: "white" }}>
          <View style={{ flex: 1, margin: 10 }}>
              {this.state.data.logoThumbURL != '#' ? (
                <Image
                  source={{ uri: this.state.data.logoThumbURL }}
                  style={commonStyle.centerImage}
                />
              ) : (
                <Image
                  source={require("../../../assets/file_upload_icon.png")}
                  style={commonStyle.centerImage}
                />
              )}
            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Institute Name</Label>
              <Text style={{alignSelf:"flex-start"}}>{this.state.data.name}</Text>
            </Item>
            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Institute Type</Label>
              <Item picker>
                <Picker
                  mode="dropdown"
                  enabled={false}
                  iosIcon={<Icon name="ios-arrow-down" />}
                  selectedValue={this.state.instituteTypeId}
                  onValueChange={value => {
                    this.setState({ instituteTypeId: value });
                  }}
                >
                  {this.state.instituteType.map(function(type, i) {
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

            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Institute Category</Label>
              <Item picker>
                <Picker
                  mode="dropdown"
                  enabled={false}
                  iosIcon={<Icon name="ios-arrow-down" />}
                  selectedValue={this.state.instituteCategoryId}
                  onValueChange={value => {
                    this.setState({ instituteCategoryId: value });
                  }}
                >

                  {this.state.instituteCategory.map(function(category, i) {
                    return (
                      <Picker.Item
                        key={i}
                        label={category.label}
                        value={category.value}
                      />
                    );
                  })}
                </Picker>
              </Item>
            </Item>
            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Address</Label>
              <Text style={{alignSelf:"flex-start"}}>{this.state.data.address}</Text>
            </Item>
            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Domain</Label>
              <Text style={{alignSelf:"flex-start"}}>{this.state.data.domain}</Text>
            </Item>
            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Contact Person Phone No.</Label>
              <Text style={{alignSelf:"flex-start"}}>{this.state.data.contactPersonNo}</Text>
            </Item>
            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Contact Person E-mail</Label>
              <Text style={{alignSelf:"flex-start"}}>{this.state.data.contactPersonEmail}</Text>
            </Item>
            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Description</Label>
              <Text style={{alignSelf:"flex-start"}}>{this.state.data.description}</Text>
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
                  title={"Some Title"}
                />
              </MapView>
            </Item>
            <View style={{ marginBottom: 10 }} />
          </View>
        {this.state.loading && <ActivityIndicatorScreen />}
        </ScrollView>
    );
  }
}

export default InstituteViewScreen;
