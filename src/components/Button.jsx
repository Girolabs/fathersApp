import React from 'react';
import {
	TouchableNativeFeedback,
	TouchableOpacity,
	Platform
} from 'react-native'

const Button = props => {
		let TouchableComp = TouchableOpacity;
		if ( Platform.OS === 'android' && Platform.Version >= 21) {
			TouchableComp = TouchableNativeFeedback;
		}
    return (
			<TouchableComp
				{...props}
			>
				{props.children}
			</TouchableComp>
		)

}

export default Button