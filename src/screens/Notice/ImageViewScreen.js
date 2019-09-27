import React, { Component } from "react";
import { Dimensions, Image, View } from "react-native";
import ImageZoom from "react-native-image-pan-zoom";
import { purpleColor } from "../../Common/commonStyle";
class ImageViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: "../../../assets/NoImageAvailable.png",
      imgWidth: 0,
      imgHeight: 0
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("name", "Image View"),
      headerTintColor:purpleColor
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
    this.setState({ uri: this.props.navigation.state.params.uri });
    Image.getSize(this.props.navigation.state.params.uri, (width, height) => {
      // calculate image width and height
      const screenWidth = Dimensions.get("window").width;
      const scaleFactor = width / screenWidth;
      const imageHeight = height / scaleFactor;
      this.setState({ imgWidth: screenWidth, imgHeight: imageHeight });
    });
  }

  render() {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}
      >
        <ImageZoom
          cropWidth={Dimensions.get("window").width}
          cropHeight={Dimensions.get("window").height}
          imageWidth={this.state.imgWidth}
          imageHeight={this.state.imgHeight}
          panToMove={true}
          pinchToZoom={true}
          enableCenterFocus={true}
          enableDoubleClickZoom={true}
        >
          <Image
            style={{ width: this.state.imgWidth, height: this.state.imgHeight }}
            source={{ uri: this.state.uri }}
          />
        </ImageZoom>
      </View>
    );
  }
}

export default ImageViewScreen;
