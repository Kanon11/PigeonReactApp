import React from "react";
import { Root, Icon } from "native-base";
import { Platform, AsyncStorage, View, Image } from "react-native";
import {
  NavigationActions,
  createStackNavigator,
  createDrawerNavigator,
  createSwitchNavigator
} from "react-navigation";
// import { Notifications, Asset, AppLoading, SplashScreen, Font } from "expo";
import LoginScreen from "./src/screens/Login/LoginScreen";
import ForgotPasswordScreen from "./src/screens/Login/ForgotPasswordScreen";
import AuthLoadingScreen from "./src/screens/Login/AuthLoadingScreen";
import SignupScreen from "./src/screens/Login/SignupScreen";
import NoticeFeedScreen from "./src/screens/Notice/NoticeFeedScreen";
import ChannelListScreen from "./src/screens/Channel/ChannelListScreen";
import InstituteListScreen from "./src/screens/Institute/InstituteListScreen";
import AboutScreen from "./src/screens/Setting/AboutScreen";
import ChangePasswordScreen from "./src/screens/Setting/ChangePasswordScreen";
import { purpleColor, IconSet } from "./src/Common/commonStyle";
import LogoutScreen from "./src/screens/Setting/LogoutScreen";
import InstituteDetailsScreen from "./src/screens/Institute/InstituteDetailsScreen";
import ChannelDetailsScreen from "./src/screens/Channel/ChannelDetailsScreen";
import { DrawerComponent } from "./src/navigation/DrawerComponent";
import ImageViewScreen from "./src/screens/Notice/ImageViewScreen";
import PdfViewScreen from "./src/screens/Notice/PdfViewScreen";
import ChannelNoticeListScreen from "./src/screens/Channel/ChannelNoticeListScreen";
import InstituteChannelListScreen from "./src/screens/Institute/InstituteChannelListScreen";
import ChannelInviteScreen from "./src/screens/Channel/ChannelInviteScreen";
import ChannelSubscriberListScreen from "./src/screens/Channel/ChannelSubscriberListScreen";
import OtpVarityScreen from "./src/screens/Login/OTP_VarityScreen";
import ChannelDiscoverScreen from "./src/screens/Channel/ChannelDiscoverScreen";
import { GetChannelDetail } from "./src/service/ChannelService";
import apiConfig, { urlDev, urlTest } from "./src/service/api/config";
import { IsTestVersion } from "./src/service/AccountVersionInfoService";
import ReportViewScreen from "./src/screens/Notice/ReportViewScreen";
import NoticeShareScreen from "./src/screens/Common/NoticeShareScreen";
import ChannelViewScreen from "./src/screens/Channel/ChannelViewScreen";
import InstituteViewScreen from "./src/screens/Institute/InstituteViewScreen";
import ChannelAdminListScreen from "./src/screens/Channel/ChannelAdminListScreen";
import OtpChangePasswordScreen from "./src/screens/Login/OtpChangePasswordScreen";

const LoginStackNavigator = createStackNavigator(
  {
    LoginScreen: { screen: LoginScreen },
    SignupScreen: { screen: SignupScreen },
    ForgotPasswordScreen: { screen: ForgotPasswordScreen },
    OtpVarityScreen: { screen: OtpVarityScreen },
    OtpChangePasswordScreen: {screen :OtpChangePasswordScreen},
  },
  {
    headerMode: "float",
    navigationOptions: {
      header: null,
      headerStyle: { backgroundColor: "#E73536" },
      title: "You are not logged in",
      headerTintColor: "white"
    }
  }
);
const ChannelStackNavigator = createStackNavigator(
  {
    ChannelListScreen: {
      screen: ChannelListScreen
      // navigationOptions: { header: null }
    },
    ChannelNoticeListScreen: { screen: ChannelNoticeListScreen },
    ImageViewScreen: { screen: ImageViewScreen },
    PdfViewScreen: { screen: PdfViewScreen },
    ChannelDetailsScreen: { screen: ChannelDetailsScreen },
    ChannelInviteScreen: { screen: ChannelInviteScreen },
    ChannelSubscriberListScreen: { screen: ChannelSubscriberListScreen },
    ChannelAdminListScreen: { screen: ChannelAdminListScreen },
    ChannelViewScreen: { screen: ChannelViewScreen },
    NoticeShareScreen: { screen: NoticeShareScreen },
    ReportViewScreen: { screen: ReportViewScreen },
  },
  {
    initialRouteKey: ChannelListScreen
  }
);
const InstituteStackNavigator = createStackNavigator(
  {
    InstituteListScreen: { screen: InstituteListScreen },
    InstituteChannelListScreen: { screen: InstituteChannelListScreen },
    InstituteDetailsScreen: { screen: InstituteDetailsScreen },
    ChannelDetailsScreen: { screen: ChannelDetailsScreen },
    InstituteViewScreen: { screen: InstituteViewScreen },
    ImageViewScreen: { screen: ImageViewScreen }
  },
  {
    initialRouteKey: InstituteListScreen
  }
);

const NoticeStackNavigator = createStackNavigator(
  {
    NoticeFeedScreen: { screen: NoticeFeedScreen },
    ImageViewScreen: { screen: ImageViewScreen },
    PdfViewScreen: { screen: PdfViewScreen },
    ReportViewScreen: { screen: ReportViewScreen },
    NoticeShareScreen: { screen: NoticeShareScreen }
  },
  {
    initialRouteKey: NoticeFeedScreen
  }
);

const DiscoverStackNavigator = createStackNavigator(
  {
    DiscoverScreen: { screen: ChannelDiscoverScreen }
  },
  {
    initialRouteKey: NoticeFeedScreen
  }
);

const AboutStackNavigator = createStackNavigator(
  {
    AboutScreen: {
      screen: AboutScreen
    }
  },
  {
    initialRouteKey: AboutScreen
  }
);

const SettingsStackNavigator = createStackNavigator(
  {
    ChangePasswordScreen: {
      screen: ChangePasswordScreen
    }
  },
  {
    initialRouteKey: ChangePasswordScreen
  }
);

const DrawerStack = createDrawerNavigator(
  {
    NoticeStack: {
      screen: NoticeStackNavigator,
      navigationOptions: {
        drawerLabel: "Notice Feed",
        drawerIcon: ({ tintColor }) => (
          <Icon {...IconSet.NoticeStack} style={{ color: tintColor }} />
        )
      }
    },
    ChannelStack: {
      screen: ChannelStackNavigator,
      navigationOptions: {
        drawerLabel: "Channels",
        drawerIcon: ({ tintColor }) => (
          <Icon {...IconSet.ChannelStack} style={{ color: tintColor }} />
        )
      }
    },
    InstituteStack: {
      screen: InstituteStackNavigator,
      navigationOptions: {
        drawerLabel: "Institutes",
        drawerIcon: ({ tintColor }) => (
          <Icon {...IconSet.InstituteStack} style={{ color: tintColor }} />
        )
      }
    },
    DiscoverStack: {
      screen: DiscoverStackNavigator,
      navigationOptions: {
        drawerLabel: "Discover",
        drawerIcon: ({ tintColor }) => (
          <Icon {...IconSet.DiscoverStack} style={{ color: tintColor }} />
        )
      }
    },
    AboutStack: {
      screen: AboutStackNavigator,
      navigationOptions: {
        drawerLabel: "About",
        drawerIcon: ({ tintColor }) => (
          <Image
            source={require("./assets/About_Grey.png")}
            style={{ tintColor: tintColor }}
          />
        )
      }
    },
    SettingsStackNavigator: {
      screen: SettingsStackNavigator,
      navigationOptions: {
        drawerLabel: "Change Password",
        drawerIcon: ({ tintColor }) => (
          <Icon
            {...IconSet.SettingsStackNavigator}
            style={{ color: tintColor }}
          />
        )
      }
    },
    LogoutScreen: { screen: LogoutScreen }
  },
  {
    //DrawerNavigatorConfig
    initialRouteName: "NoticeStack",
    contentOptions: {
      activeBackgroundColor: purpleColor,
      //inactiveBackgroundColor:semiGrayColor,
      activeTintColor: "white"
      //inactiveTintColor:'black'
    },
    contentComponent: navigation => <DrawerComponent navigation={navigation} />,
    drawerWidth: 280,
    drawerPosition: "left"
  }
);

const AppStackNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: { screen: LoginStackNavigator },
    App: { screen: DrawerStack }
  },
  {
    // Default config for all screens
    // headerMode: "none",
    title: "Main",
    initialRouteName: "AuthLoading"
  }
);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSplashReady: false,
      isAppReady: false,
      notification: {}
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });
  }

  async componentDidMount() {
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = async ({ origin, data }) => {
    if (origin == "selected") {
      let channelId = data.channelId;
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken && channelId) {
        let channelsResult = await GetChannelDetail(channelId);
        if (channelsResult.isSuccess) {
          this.navigator.dispatch(
            NavigationActions.navigate({
              routeName: "ChannelNoticeListScreen",
              params: {
                title: channelsResult.result[0].name,
                channel: channelsResult.result[0]
              }
            })
          );
        }
      }
    }
  };

  render() {
    if (!this.state.isSplashReady) {
      return (
        // <AppLoading
        //   startAsync={this._cacheSplashResourcesAsync}
        //   onFinish={() => this.setState({ isSplashReady: true })}
        //   onError={console.warn}
        //   autoHideSplash={false}
        // />
      );
    }

    if (!this.state.isAppReady) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={require("./assets/splash.png")}
            onLoad={this._cacheResourcesAsync}
          />
        </View>
      );
    }

    if (this.state.isAppReady) {
      return (
        <Root>
          <AppStackNavigator
            ref={nav => {
              this.navigator = nav;
            }}
          />
        </Root>
      );
    }

    return <View />;
  }

  _cacheSplashResourcesAsync = async () => {
    await this.initApiServerUrl();
    const gif = require("./assets/splash.png");
    return Asset.fromModule(gif).downloadAsync();
  };

  _cacheResourcesAsync = async () => {
    setTimeout(() => {
      SplashScreen.hide();
      this.setState({ isAppReady: true });
    }, 2000);
  };

  async initApiServerUrl() {
    var response = await IsTestVersion(
      Platform.OS,
      Expo.Constants.manifest.version
    );
    if (response.isSuccess && response.result) {
      var apiVersionInfo = response.result[0];
      // TODO: need to check later
      // if (apiConfig.url == urlDev) {
      //   if (!apiVersionInfo.isTest) {
      //     apiConfig.url = urlTest;
      //   }
      // } else {
      //   if (apiVersionInfo.isTest) {
      //     apiConfig.url = urlTest;
      //   }
      // }
    }
    console.log(`ApiServer Url: ${apiConfig.url}`);
  }
}
