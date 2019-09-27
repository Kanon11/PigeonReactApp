import React, { Component } from "react";
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  TouchableHighlight,
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
  Item,
  Label,
  Input,
  Picker,
  Icon,
  Toast,
  Button,
  Text,
  ActionSheet,
  Thumbnail
} from "native-base";

import {
  commonStyle,
  purpleColor,
  darkGrayColor
} from "../../Common/commonStyle";
import { SaveChannel, PostAndGetBlob } from "../../service/ChannelService";
import { GetOwnInstitute, SaveInstitute } from "../../service/InstituteService";
import { GetChannelCategory } from "../../service/ChannelService";
import ActivityIndicatorScreen from "../Common/ActivityIndicatorScreen";

class ChannelDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInstitute: false,
      loading: false,
      Id: 0,
      Image: null,
      ImageThumb: null,
      logo: null,
      ChannelName: null,
      ContactPersonNo: null,
      ContactPersonEmail: null,

      InstituteId: "0",
      CategoryId: 0,
      SecurePin: "",

      InstituteList: [],
      CategoryList: [],

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
      isValid: true,
      isChannelNameValid: false,
      isSecurePinValid: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("name", "Create Channel"),
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
    this.getCategory();
    this.getOwnInstitute();
  }

  componentDidMount() {
    this.unMounted = false;
    this.initData();
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

  showLoading() {
    this.setState({ loading: true });
  }

  hideLoading() {
    this.setState({ loading: false });
  }

  async initData() {
    this.showLoading();

    var showInstitute =
      this.props.navigation.state.params != undefined &&
      this.props.navigation.state.params.showInstitute != undefined
        ? this.props.navigation.state.params.showInstitute
        : false;

    this.setState({ showInstitute: showInstitute });
    let data = this.props.navigation.state.params.data;
    
    if (data && data.id != undefined && data.id > 0) {
      this.setState({ Id: data.id });
      this.setState({ InstituteId: data.instituteId });
      this.setState({ Image: data.logoURL });
      this.setState({ ImageThumb: data.imageThumb });
      this.setState({Logo: data.logoURL});
      this.setState({ ChannelName: data.name }, () =>
        this.validateText(this.state.ChannelName, "ChannelName")
      );
      this.setState({ CategoryId: data.channelCategoryId });
      this.setState({ SecurePin: data.secure_pin }, () => {
        if (this.state.CategoryId == 2) {
          this.validateText(this.state.SecurePin, "SecurePin");
        }
      });
      this.setState({ ContactPersonNo: data.contactPersonNo });
      this.setState({ ContactPersonEmail: data.contactPersonEmail });

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

    this.validate();

    this.hideLoading();
  }

  async getOwnInstitute() {
    var instituteList = [{ label: "(Create New Institute)", value: "0" }];
    this.setState({
      InstituteList: instituteList
    });

    await GetOwnInstitute()
      .then(res => {
        if (res.isSuccess && res.result.length > 0) {
          instituteList.push(...res.result);
          this.setState({
            InstituteList: instituteList
          });
        }
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

        if (this.state.CategoryId == undefined || this.state.CategoryId == 0) {
          this.setState({ CategoryId: res.result != undefined && res.result.length > 0 ? res.result[0].value : 0 });
        }
      })
      .catch(error => {
        console.log("error Occured");
      });
  }

  _pickPhotoOrImage = async () => {
    ActionSheet.show(
      {
        options: ["Pick Image", "View Image"],
        //cancelButtonIndex: 2
        // destructiveButtonIndex: DESTRUCTIVE_INDEX,
        // title: "Testing ActionSheet"
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this._pickImage();
            break;
          case 1:
            this.ViewImage(this.state.Image);
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
        console.log("Ready");
        console.log(manipResult.uri);

        this.setState({ Image: manipResult.uri });
        this.setState({ Logo: manipResult.uri });
      } else {
        this.setState({ Image: result.uri });
        this.setState({ Logo: result.uri });
      }
      try {
        let uriParts = this.state.Image.split(".");
        let fileType = uriParts[uriParts.length - 1];
        let response = await PostAndGetBlob(
          {},
          this.state.Image,
          `image/${fileType}`,
          `files.${fileType}`
        );

        if (response && response.isSuccess) {
           console.log("Ready3");
           console.log(response.result);
           let updateImage= "https://pigeonin.blob.core.windows.net/pigeonthumnailcontainer/"+response.result;
          
           console.log(updateImage);
           this.setState({ Logo: updateImage });
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

  async SaveChannel() {
    this.showLoading();
    console.log("this.state.CategoryId {0}",this.state.CategoryId);
    let data = {
      Id: this.state.Id,
      Logo: this.state.Logo,
      Name: this.state.ChannelName,
      ContactPersonNo: this.state.ContactPersonNo,
      ContactPersonEmail: this.state.ContactPersonEmail,
      InstituteId: this.state.InstituteId,
      ChannelCategoryId: this.state.CategoryId,
      SecurePin: this.state.SecurePin,
      Latitute: this.state.marker.latitude,
      LatitudeDelta: this.state.mapRegion.latitudeDelta,
      Longitude: this.state.marker.longitude,
      LongitudeDelta: this.state.mapRegion.longitudeDelta
    };
    try {
      if (this.state.InstituteId == 0) {
        response = await SaveInstitute(data);
      } else {
        response = await SaveChannel(data);
      }

      this.hideLoading();
      if (response && response.isSuccess) {
        this.props.navigation.goBack();
        if (
          this.props.navigation.state.params != undefined &&
          this.props.navigation.state.params.callback != undefined &&
          this.props.navigation.state.params.parent != undefined
        )
          this.props.navigation.state.params.callback(
            this.props.navigation.state.params.parent,
            response.result
          );
        Toast.show({
          text: "Channel Saved Successfully",
          buttonText: "Okay",
          type: "success",
          duration: 3000,
          position: "bottom"
        });
      } else {
        if (response) {
          Toast.show({
            text: response.message,
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
  }
  _SaveChannel = () => {
    this.SaveChannel();
  };

  validateText = (text, type) => {
    if (type == "ChannelName") {
      this.setState(
        {
          ChannelName: text,
          isChannelNameValid: text.length > 0
        },
        () => {
          this.validate();
        }
      );
    }
    if (type == "SecurePin") {
      let num = text.replace(".", "");
      this.setState(
        {
          SecurePin: num,
          isSecurePinValid: text.length == 4 && !isNaN(text)
        },
        () => {
          this.validate();
        }
      );
    }
  };

  validate = () => {
    var valid = true;
    if (this.state.ChannelName == null || this.state.ChannelName.trim() == "") {
      valid = false;
    }

    if (this.state.CategoryId == null || this.state.CategoryId == 0) {
      valid = false;
    }

    if (this.state.CategoryId != null && this.state.CategoryId == 2) {
      if (this.state.SecurePin == null || this.state.SecurePin.trim() == "") {
        valid = false;
      } else if (
        this.state.SecurePin.length != 4 ||
        isNaN(this.state.SecurePin)
      ) {
        valid = false;
      }
    }

    this.setState({ isValid: valid });
  };

  render() {
    let { ImageThumb } = this.state;
 

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
                  this.state.Logo != null && this.state.Logo.length > 1
                    ? { uri: this.state.Logo }
                    : require("../../../assets/file_upload_icon.png")
                }
              />
            </TouchableHighlight>

            {this.state.showInstitute && (
              <Item stackedLabel>
                <Label style={commonStyle.labelInput}>Institute Name</Label>
                <Item picker>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="ios-arrow-down" />}
                    placeholder="(Create New Institute)"
                    note
                    style={{ width: undefined }}
                    selectedValue={this.state.InstituteId}
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

            <Item
              stackedLabel
              success={this.state.isChannelNameValid}
              error={!this.state.isChannelNameValid}
            >
              <Label style={{ color: darkGrayColor }}>Channel Name</Label>
              <Input
                value={this.state.ChannelName}
                onChangeText={text => this.validateText(text, "ChannelName")}
              />
              {/* <Icon
                name={this.state.isValid ? "checkmark-circle" : "close-circle"}
              /> */}
            </Item>
            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Channel Category</Label>
              <Item picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="ios-arrow-down" />}
                  style={{ width: undefined }}
                  placeholder="Select a Category"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.CategoryId}
                  onValueChange={selected => {
                    this.setState({ CategoryId: selected }, () => {
                      this.validate();
                    });
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
              <Item
                stackedLabel
                success={this.state.isSecurePinValid}
                error={!this.state.isSecurePinValid}
              >
                <Label style={commonStyle.labelInput}>Secure Pin</Label>
                <Input
                  keyboardType="numeric"
                  textContentType="password"
                  maxLength={4}
                  onChangeText={text => this.validateText(text, "SecurePin")}
                  underlineColorAndroid="transparent"
                  value={this.state.SecurePin}
                />
              </Item>
            ) : null}

            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>
                Contact Person Phone No.
              </Label>
              <Input
                onChangeText={text => this.setState({ ContactPersonNo: text })}
                underlineColorAndroid="transparent"
                value={this.state.ContactPersonNo}
              />
            </Item>

            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>
                Contact Person E-mail
              </Label>
              <Input
                onChangeText={text =>
                  this.setState({ ContactPersonEmail: text })
                }
                underlineColorAndroid="transparent"
                value={this.state.ContactPersonEmail}
              />
            </Item>

            <Item stackedLabel>
              <Label style={commonStyle.labelInput}>Location</Label>

              <MapView
                style={{ alignSelf: "stretch", height: 400 }}
                region={this.state.mapRegion}
                scrollEnabled ={true}
                draggable
                onSelect={() => console.log('onSelect', arguments)}
                onDrag={() => console.log('onDrag', arguments)}
                onDragStart={() => console.log('onDragStart', arguments)}
                onRegionChangeComplete={mapRegion => {
                  this.setState({ mapRegion: mapRegion });
                }}
              >
                <MapView.Marker coordinate={  this.state.mapRegion  }  />
                {/* <MapView.Marker
                  draggable
                  key={1}
                  coordinate={this.state.marker}
                  onDragEnd={e => {
                    this.setState({ marker: e.nativeEvent.coordinate });
                  }}
                  title={"Your Location"}
                /> */}
               
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
              onPress={this._SaveChannel}
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

export default ChannelDetailsScreen;
