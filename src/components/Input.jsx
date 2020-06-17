import React, { Component } from 'react';
import { View ,Text, TextInput, StyleSheet } from 'react-native';
import  Colors  from '../constants/Colors';


class Input extends Component {

  render() {
    return(
      <View style={styles.formControl}>
        <TextInput
          {...this.props}
          style={styles.input}
          onChangeText={this.props.onChange}
        />
      </View>
    )
  }
  

}

const styles = StyleSheet.create({
  formControl: {
    width: '100%',
    marginVertical:10,
  },
  input:{
    paddingHorizontal:5,
    paddingVertical:10,  
    backgroundColor: Colors.surfaceColorSecondary,
    borderRadius:5
  }
})

export default Input;