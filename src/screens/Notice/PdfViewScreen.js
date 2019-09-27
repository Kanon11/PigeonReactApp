import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class PdfViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  render() {
    return (
      <View>
        <Text> PdfViewScreen </Text>
      </View>
    );
  }
}

export default PdfViewScreen;

const styles = StyleSheet.create({
    
});