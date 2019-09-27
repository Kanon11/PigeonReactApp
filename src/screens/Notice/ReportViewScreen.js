import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import PieChart from "react-native-pie-chart";
import { purpleColor, darkGrayColor } from "../../Common/commonStyle";
import { voteResult } from "../../service/NoticeService";
import { Badge } from "native-base";

class ReportViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      sliceColor: ["#bcbcbc", "#865681", "#ed8a8c"]
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
    this._voteResult(this.props.navigation.state.params.noticeID);
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Admin Report",
      headerTintColor: purpleColor
    };
  };
  async _voteResult(noticeID) {
    await voteResult(noticeID)
      .then(res => {
        console.log(res.result);
        var notVoted =
          res.result.totalChannelUser -
          (res.result.upVoteCount + res.result.downVoteCount);
        var series = [];
        series.push(notVoted > 0 ? notVoted : 0);
        series.push(res.result.upVoteCount);
        series.push(res.result.downVoteCount);
        this.setState({ series });
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    var chart_wh = 250;

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{
            marginTop: 5,
            marginLeft: 10,
            flexDirection: "row"
          }}
        >
          <Badge
            style={{
              marginRight: 5,
              backgroundColor: this.state.sliceColor[0]
            }}
          >
            <Text style={{ margin: 3, color: "white" }}>
              Not Voted: {this.state.series[0]}
            </Text>
          </Badge>
          <Badge
            style={{
              marginRight: 5,
              backgroundColor: this.state.sliceColor[1]
            }}
          >
            <Text style={{ margin: 3, color: "white" }}>
              Yes Voted: {this.state.series[1]}
            </Text>
          </Badge>
          <Badge
            style={{
              marginRight: 5,
              backgroundColor: this.state.sliceColor[2]
            }}
          >
            <Text style={{ margin: 3, color: "white" }}>
              No Voted: {this.state.series[2]}
            </Text>
          </Badge>
        </View>

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <PieChart
            chart_wh={chart_wh}
            series={this.state.series}
            sliceColor={this.state.sliceColor}
          />
        </View>
      </View>
    );
  }
}

export default ReportViewScreen;
