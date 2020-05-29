import React, { Component } from 'react';
import { View, Picker, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

class Select extends Component {
	
  render() {
		let { value, elements,valueChange } = this.props
		console.log('value',value)
    return (
      <View style={styles.container}>
        <Picker
					selectedValue={value}
					onValueChange={(itemValue) =>valueChange(itemValue)}
				>
					{elements.map(el => {
						return(
							<Picker.Item color={Colors.onSurfaceColorPrimary} label={el.name} value={el.value} />

						)
					})}

				</Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.surfaceColorSecondary
	}
})

export default Select;
