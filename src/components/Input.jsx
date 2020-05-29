import React, { Component } from 'react';
import { View ,Text, TextInput, StyleSheet } from 'react-native';
import  Colors  from '../constants/Colors';


class Input extends Component {
  state= {
    value: this.props.initialValue ? this.initialValue:'',
    isValid: this.props.initiallyValid,
    touched: false
  }
 

  textChangeHandler = text => {
    const { email } = this.props;

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if( email && text.trim().length ===0) {
      isValid = false;
    }

    this.setState({ value: text, isValid: isValid });
  }

  render() {
    let { value, isValid, touched } = this.state;
    return(
      <View style={styles.formControl}>
        <TextInput
          {...this.props}
          style={styles.input}
          value={value}
          onChangeText={this.textChangeHandler}
        />
      </View>
    )
  }
  

}

const styles = StyleSheet.create({
  formControl: {
    width: '100%',
    marginVertical:5
  },
  input:{
    paddingHorizontal:2,
    paddingVertical:5,  
    backgroundColor: Colors.surfaceColorSecondary,
    borderRadius:5
  }
})

export default Input;