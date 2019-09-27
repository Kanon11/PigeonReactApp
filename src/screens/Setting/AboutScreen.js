import React, { Component } from "react";
import { Button, Icon, Container, Form, Text, Thumbnail } from "native-base";
import {
  purpleColor,
  darkGrayColor,
  commonStyle,
  IconSet
} from "../../Common/commonStyle";
import { DrawerActions } from "react-navigation";
class AboutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: ""
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
    this.initForm();
  }

  async initForm() {
    try {
      this.setState({ version: Expo.Constants.manifest.version });
    } catch (error) {
      console.log(error);
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "About",
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

  render() {
    return (
      <Container style={commonStyle.ContainerColumn}>
        <Form
          style={{ alignItems: "center", flex: 1, backgroundColor: "white" }}
        >
          <Thumbnail
            square
            style={{ marginTop: 50 }}
            source={require("../../../assets/logo.png")}
          />
          <Text style={{ color: purpleColor, fontSize: 18 }}>PIGEON IN</Text>
          <Text style={{ marginTop: 30, color: darkGrayColor }}>
            {this.state.version}
          </Text>
          <Text style={commonStyle.AboutScreen}>
            This app gives the opportunity to broad cast message to specific
            group who are interested to know particular things
          </Text>
          <Text style={commonStyle.AboutScreen}>
            In typical school, notice sent through notie board or writting
            students notice book to parent
          </Text>
          <Text style={commonStyle.AboutScreen}>
            Using this app, parent can subscribe to particular class to get
            notice. In addition, there could be some notice where school ask
            opinion from parent which also can achieve by PigeonIn
          </Text>
        </Form>
      </Container>
    );
  }
}

export default AboutScreen;
