import React, { Component } from 'react';
import { StyleSheet, View, Modal, TouchableHighlight } from 'react-native';
import { Container, Form, Item, Input, Label,Text,Icon } from 'native-base';
import { Button } from 'react-native-elements';
import { commonStyle, modalGrayColor } from '../../Common/commonStyle';
import { SubscribeUnSubscribeChannel } from "../../service/ChannelService";
class ChannelSecurePinScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible:false,
      SecurePin:null
    };
  }

  setState(obj, func) {
    if (this.unMounted) return;
    super.setState(obj, func);
  }

  componentWillUnmount() {
    this.unMounted = true;
  }

  componentDidMount(){
    this.unMounted = false;
    this.initForm();
  }
  componentWillReceiveProps(){
    this.initForm();
  }
  
  initForm(){
    let visible=this.props.visible;
    if(visible)
    {
      this.setState({modalVisible:true});
    }
  }
  _ShowModal (visible) {
    this.setState({modalVisible: visible});
  };
  async varifyUser() {
    let channel=this.props.channel;
      if(channel.secure_pin==this.state.SecurePin)
      {
          try {
            let response = await SubscribeUnSubscribeChannel(channel.id);
            if (response.isSuccess && response.result.success) {
              this.setState({modalVisible:false});
              this.props.callback(true);
            } else {
              alert("error occured");
            }
          } catch (errors) {
            alert("error occured");
          }
      }
      else
      {
        alert('Secure pin wrong!!');
      }
}
_varifyUser = () => {
    this.varifyUser();
};
  render() {
    return (
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}>
            <View style={styles.modalStyle}>
              <View style={{alignItems:"flex-end"}}>
                  <TouchableHighlight
                      onPress={() => this._ShowModal(!this.state.modalVisible)}>
                  <Text>Close</Text>
                  </TouchableHighlight>
              </View>
              <View style={{margin:20}}>
                <Item stackedLabel>
                  <Label>Enter Secure Pin</Label>
                  <Input 
                    onChangeText={text => this.setState({ SecurePin: text })}
                    value={this.state.SecurePin}
                  />
                </Item>
                <Button
                  buttonStyle={commonStyle.ButtonCommon}
                      onPress={this._varifyUser}
                      title="Subscribe"
                />
                </View>
            </View>
        </Modal>
    );
  }
}

export default ChannelSecurePinScreen;

const styles = StyleSheet.create({
  modalStyle:{
    marginTop: 145,
    marginLeft:25,
    marginRight:25,
    height:230,
    backgroundColor:modalGrayColor
},
});