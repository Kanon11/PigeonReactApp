import React, { Component } from "react";
import {
  View,
  ScrollView,
  TouchableHighlight,
  Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {
  MapView,
  Permissions,
  Location,
  ImageManipulator,
  ImagePicker
} from "expo";
import {
  commonStyle,
  darkGrayColor,
  purpleColor
} from "../../Common/commonStyle";
import {
  GetInstituteCategory,
  GetInstituteType,
  SaveInstitute
} from "../../service/InstituteService";

import {
  Item,
  Label,
  Input,
  Picker,
  Icon,
  Toast,
  ActionSheet,
  Button,
  Text,
  Thumbnail
} from "native-base";
import { PostAndGetBlob } from "../../service/ChannelService";
import ActivityIndicatorScreen from "../Common/ActivityIndicatorScreen";

class InstituteDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      id: 0,
      image: null,
      imageThumb: null,
      logo: null,
      name: null,
      instituteCategoryId: 0,
      instituteCategory: [],
      instituteTypeId: 0,
      instituteType: [],
      address: null,
      domain: null,
      contactPersonNo: null,
      contactPersonEmail: null,
      description: null,
      hasLocationPermissions: false,

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
      isValid: false
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
    this.unMounted = false;
    this.initData();
  }

  showLoading() {
    this.setState({ loading: true });
  }

  hideLoading() {
    this.setState({ loading: false });
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied"
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }

    let location = await Location.getCurrentPositionAsync({});

    this.setState({
      mapRegion: {
        latitude: location.coords.latitude,
        latitudeDelta: 0.003700137275526316,
        longitude: location.coords.longitude,
        longitudeDelta: 0.0036186352372169495
      }
    });

    this.setState({
      marker: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    });
  };

  async initData() {
    this.showLoading();
    let data = this.props.navigation.state.params.data;
    if (data && data.id != undefined && data.id > 0) {
      this.setState({ id: data.id });
      this.setState({ image: data.logoURL });
      this.setState({ imageThumb: data.logoThumbURL });
      this.setState({ name: data.name }, () =>
        this.validateText(this.state.name)
      );
      this.setState({ instituteCategoryId: data.instituteCategoryId });
      this.setState({ instituteTypeId: data.instituteTypeId });
      this.setState({ address: data.address });
      this.setState({ domain: data.domain });
      this.setState({ contactPersonNo: data.contactPersonNo });
      this.setState({ contactPersonEmail: data.contactPersonEmail });
      this.setState({ description: data.description });

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
      } else {
        this._getLocationAsync();
      }
    }
    this.hideLoading();
  }

  async getCategory() {
    await GetInstituteCategory()
      .then(res => {
        this.setState({
          instituteCategory: res.result
        });
        if (
          this.state.instituteCategoryId == undefined ||
          this.state.instituteCategoryId == 0
        ) {
          this.setState({
            instituteCategoryId:
              res.result != undefined && res.result.length > 0
                ? res.result[0].value
                : 0
          });
        }
      })
      .catch(() => {
        console.log("error occured");
      });
  }

  async getType() {
    await GetInstituteType()
      .then(res => {
        this.setState({
          instituteType: res.result
        });
        if (
          this.state.instituteTypeId == undefined ||
          this.state.instituteTypeId == 0
        ) {
          this.setState({
            instituteTypeId:
              res.result != undefined && res.result.length > 0
                ? res.result[0].value
                : 0
          });
        }
      })
      .catch(() => {
        console.log("error occured");
      });
  }

  _pickPhotoOrImage = async () => {
    ActionSheet.show(
      {
        options: ["Pick Image", "View Image", "Cancel"],
        cancelButtonIndex: 2
        // destructiveButtonIndex: DESTRUCTIVE_INDEX,
        // title: "Testing ActionSheet"
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this._pickImage();
            break;
          case 1:
            this.ViewImage(this.state.image);
            break;
        }
      }
    );
  };

  ViewImage = image => {
    this.props.navigation.navigate("ImageViewScreen", { uri: image });
  };

  async checkDevicePermission() {
    let statusCAMERA = await Permissions.getAsync(Permissions.CAMERA);
    let statusCAMERAROLL = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (statusCAMERA.status !== "granted") {
      // alert('Hey! You might want to enable notifications for my app, they are good.');
      let statusCAMERA1 = await Permissions.askAsync(Permissions.CAMERA);
      if (statusCAMERA1.status !== "granted") {
        alert(
          "Hey! You might want to enable CAMERA for my app, they are good."
        );
        return false;
      }
    }

    if (statusCAMERAROLL.status !== "granted") {
      // alert('Hey! You might want to enable notifications for my app, they are good.');
      let statusCAMERAROLL1 = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );
      if (statusCAMERAROLL1.status !== "granted") {
        alert(
          "Hey! You might want to enable CAMERA_ROLL for my app, they are good."
        );
        return false;
      }
    }
  }

  // _pickPhoto = async () => {

  //   if (!this.checkDevicePermission()) {
  //     return;
  //   }

  //   let result = await ImagePicker.launchCameraAsync({
  //     exif: true
  //   });

  //   this.saveImage(result, true);
  // };

  _pickImage = async () => {
    if (!this.checkDevicePermission()) {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: false,
      quality: 1
      // aspect: [4, 3],
    });

    this.saveImage(result, false);
  };

  async saveImage(result, isPhoto) {
    this.showLoading();
    if (!result.cancelled) {
      if (isPhoto) {
        const manipResult = await ImageManipulator.manipulate(
          result.uri,
          [{ rotate: 90 }, { flip: { vertical: true } }],
          { format: "jpg" }
        );
        this.setState({ image: manipResult.uri });
        this.setState({ imageThumb: manipResult.uri });
      } else {
        this.setState({ image: result.uri });
        this.setState({ imageThumb: result.uri });
      }

      try {
        let uriParts = this.state.image.split(".");
        let fileType = uriParts[uriParts.length - 1];
        let response = await PostAndGetBlob(
          {},
          this.state.image,
          `image/${fileType}`,
          `files.${fileType}`
        );
        if (response && response.isSuccess) {
          this.setState({ logo: response.result });
        } else {
          if (response) {
          }
        }
      } catch (errors) {
        console.log(errors);
      }
    }
    this.hideLoading();
  }

  _SaveInstitute = async () => {
    this.showLoading();
    let data = {
      Id: this.state.id,
      Logo: this.state.logo,
      Name: this.state.name,
      InstituteCategoryId: this.state.instituteCategoryId,
      Address: this.state.address,
      Domain: this.state.domain,
      ContactPersonNo: this.state.contactPersonNo,
      ContactPersonEmail: this.state.contactPersonEmail,
      InstituteTypeId: this.state.instituteTypeId,
      Description: this.state.description,
      Latitute: this.state.marker.latitude,
      LatitudeDelta: this.state.mapRegion.latitudeDelta,
      Longitude: this.state.marker.longitude,
      LongitudeDelta: this.state.mapRegion.longitudeDelta
    };
    try {
      let response = await SaveInstitute(data);
      if (response && response.isSuccess && response.result.success) {
        this.props.navigation.goBack();
        Toast.show({
          text: "Institute Saved Successfully",
          buttonText: "Okay",
          type: "success",
          duration: 3000,
          position: "bottom"
        });
      } else {
        if (response) {
          Toast.show({
            text: response.result.message,
            buttonText: "Okay",
            type: "danger",
            duration: 3000,
            position: "bottom"
          });
        }
      }
    } catch (errors) {
      console.log(errors);
    }
    this.hideLoading();
  };

  validateText = text => {
    this.setState({ name: text, isValid: text.length > 0 });
  };
  render() {
    let { imageThumb } = this.state;
    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 90 })}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ backgroundColor: "white" }}>
          <View style={{ flex: 1, margin: 10 }}>
            <TouchableHighlight
              onPress={this._pickPhotoOrImage}
              style={{ alignSelf: "center" }}
            >
              <Thumbnail
                large
                source={
                  imageThumb != null && imageThumb.length > 1
                    ? { uri: imageThumb }
                    : require("../../../assets/file_upload_icon.png")
                }
              />
            </TouchableHighlight>

            <Item
              stackedLabel
              success={this.state.isValid}
              error={!this.state.isValid}
            >
              <Label style={{ color: darkGrayColor }}>Institute Name</Label>
              <Input
                value={this.state.name}
                onChangeText={text => this.validateText(text)}
              />
            </Item>
            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Institute Type</Label>
              <Item picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="ios-arrow-down" />}
                  // style={{ width: undefined }}
                  // placeholder="Select your SIM"
                  // placeholderStyle={{ color: "#bfc6ea" }}
                  // placeholderIconColor="#007aff"
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
                  iosIcon={<Icon name="ios-arrow-down" />}
                  // style={{ width: undefined }}
                  // placeholder="Select your SIM"
                  // placeholderStyle={{ color: "#bfc6ea" }}
                  // placeholderIconColor="#007aff"
                  selectedValue={this.state.instituteCategoryId}
                  onValueChange={value => {
                    this.setState({ instituteCategoryId: value });
                  }}
                >
                  {/* {this.InstituteCategoryPickerItemList()} */}

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
              <Input
                onChangeText={text => this.setState({ address: text })}
                underlineColorAndroid="transparent"
                value={this.state.address}
              />
            </Item>

            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Domain</Label>
              <Input
                onChangeText={text => this.setState({ domain: text })}
                underlineColorAndroid="transparent"
                value={this.state.domain}
              />
            </Item>

            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>
                Contact Person Phone No.
              </Label>
              <Input
                onChangeText={text => this.setState({ contactPersonNo: text })}
                underlineColorAndroid="transparent"
                value={this.state.contactPersonNo}
              />
            </Item>

            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>
                Contact Person E-mail
              </Label>
              <Input
                onChangeText={text =>
                  this.setState({ contactPersonEmail: text })
                }
                underlineColorAndroid="transparent"
                value={this.state.contactPersonEmail}
              />
            </Item>

            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Description</Label>
              <Input
                onChangeText={text => this.setState({ description: text })}
                underlineColorAndroid="transparent"
                value={this.state.description}
              />
            </Item>
            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Location</Label>

              <MapView
                style={{ alignSelf: "stretch", height: 400 }}
                region={this.state.mapRegion}
                onRegionChangeComplete={mapRegion => {
                  this.setState({ mapRegion: mapRegion });
                }}
              >
                <MapView.Marker
                  draggable
                  key={1}
                  coordinate={this.state.marker}
                  onDragEnd={e => {
                    this.setState({ marker: e.nativeEvent.coordinate });
                  }}
                  title={"Some Title"}
                  description={"Hello world"}
                />
              </MapView>
            </Item>

            <Button
              block
              style={
                this.state.isValid
                  ? { backgroundColor: purpleColor }
                  : { backgroundColor: darkGrayColor }
              }
              block
              disabled={!this.state.isValid}
              onPress={this._SaveInstitute}
            >
              <Text>Save</Text>
            </Button>
            <View style={{ marginBottom: 10 }} />
          </View>
        </ScrollView>
        {this.state.loading && <ActivityIndicatorScreen />}
      </KeyboardAvoidingView>
    );
  }
}

export default InstituteDetailsScreen;
