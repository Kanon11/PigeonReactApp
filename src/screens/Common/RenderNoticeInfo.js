import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageEditor
} from "react-native";
import { Constants, WebBrowser } from 'expo';
import { Thumbnail } from "native-base";
import {
  AzureThumbnailBlobUrl,
  AzureImageBlobUrl
} from "../../Common/GlobalVariable";
import { darkGray } from "../../Common/commonStyle";

export class RenderNoticeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: null,
      thumbUri: null,
      ratio: 0.0,
      width: 0.0,
      height: 300
    };
  }

  setState(obj, func) {
    if (this.unMounted) return;
    super.setState(obj, func);
  }

  componentWillUnmount() {
    this.unMounted = true;
  }

  componentWillMount() {
    this.unMounted = false;
    this.loadImage();
  }

  openPdf(url){
    return(
      WebBrowser.openBrowserAsync(url)
    )
  }
  loadImage() {
    let notice = this.props.notice;
    if (notice.media_name && notice.media_Type != ".pdf") {
      let uri = AzureImageBlobUrl + notice.media_name;
      let thumbUri = AzureThumbnailBlobUrl + notice.media_name;

      let win = Dimensions.get("window");
      this.setState({ uri: uri });
      this.setState({ thumbUri: thumbUri });
      this.setState({ width: win.width });

      // Image.getSize(
      //   thumbUri,
      //   (width, height) => {
      //     if (this.state.unMounted) return;
      //     // this.setState({ height: win.width * (height / width) });
      //     var imgy = (this.state.height / win.width) * width;

      //     if (imgy > height) {
      //       imgy = height;
      //     }

      //     console.log(
      //       `Image: ${width}:${height}; convert:${win.width}:${imgy}`
      //     );
      //     // this.cropImage(imgy);
      //   },
      //   error => {
      //     console.log(`Couldn't get the image size: ${error.message}`);
      //     setTimeout(this.loadImage, 300);
      //   }
      // );
    }
  }

  // async cropImage(imgy) {
  //   let notice = this.props.notice;
  //   if (notice.media_name && notice.media_Type != ".pdf") {
  //     let uri = AzureImageBlobUrl + notice.media_name;
  //     let thumbUri = AzureThumbnailBlobUrl + notice.media_name;

  //     let win = Dimensions.get("window");

  //     // Construct a crop data object.
  //     var cropData = {
  //       offset: { x: 0, y: 0 },
  //       size: { width: win.width, height: imgy }
  //       // displaySize: { width: 50, height: 60 },
  //       // resizeMode: "contain"
  //     };

  //     // Crop the image.
  //     try {
  //       console.log(cropData);

  //       await ImageEditor.cropImage(
  //         thumbUri,
  //         cropData,
  //         successURI => {
  //           if (this.state.unMounted) return;
  //           this.setState({
  //             thumbUri: successURI,
  //             uri: uri,
  //             width: win.width
  //           });
  //         },
  //         error => {
  //           console.log("cropImage,", error);
  //         }
  //       );
  //     } catch (error) {
  //       console.log("Error caught in this.cropImage:", error);
  //       setTimeout(this.cropImage, 300);
  //     }
  //   }
  // }

  render() {
    let notice = this.props.notice;
    let navigation = this.props.navigation;
    if (notice.type == "Text") {
      return <Text style={{ color: darkGray }}>{notice.text}</Text>;
    } else {
      if (notice.media_Type == ".pdf") {
        return (
          <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => { this.openPdf(notice.media_base_url+notice.media_name) }}
          >
            <Image source={require("../../../assets/pdf_icon.png")} 
            style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
            <TouchableOpacity
            onPress={() => { this.openPdf(notice.media_base_url+notice.media_name) }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1
              }}
            >
           <Text>{notice.display_media_name}</Text>
          </TouchableOpacity>
          </View>
        );
      } else {
        return (

          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => {
              navigation.navigate("ImageViewScreen", {
                name: notice.channel_name,
                uri: this.state.uri 
              });
            }}
          >
          <Image  source={{ uri: this.state.uri }} resizeMode={"cover"} style={{ width: this.state.width, height: this.state.height, flex: 1}} />
           </TouchableOpacity>
        );
      }
    }
  }
}
