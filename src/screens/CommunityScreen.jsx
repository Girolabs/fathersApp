import React, { Component } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,SectionList, TouchableOpacity, Platform, TouchableNativeFeedback,
} from 'react-native';
import { Flag } from 'react-native-svg-flagkit';

import Colors from '../constants/Colors';



class CommunityScreen extends Component {
	state = {
		data : [
			{
				title: 'Delegación de Paraguay',
				data: [{flag:'PY',text:'Asunción'},{flag:'PY',text:'Tuparenda'}],
			},
			{
				title: 'Región del Padre',
				data: [{flag:'AR',text:'Buenos Aires'}, {flag:'AR',text:'Córdoba'},{flag:'AR',text:'Tucumán'}],
			},
		]
	}

	
	
  render() {
		let TouchableComp = TouchableOpacity;
		if(Platform.OS === 'android' && Platform.Version >= 21) {
			TouchableComp = TouchableNativeFeedback
		}
    return (
			<SafeAreaView style={styles.container}>
      <SectionList
				sections={this.state.data}
				renderItem ={({ item}) => <Item title={item.text} flag={item.flag} />}
        renderSectionHeader={({ section: {title} }) => (
            <TouchableComp>
							
								
								<Text style={styles.header}>
								{title}
								</Text>
								
						
							
							
						</TouchableComp>
        )}
      />
			</SafeAreaView>
    );
  }
}

const Item = ({ title, flag }) => (
  <View style={styles.item}>
		<Flag id={flag} size={0.2} />
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    marginHorizontal: 16
  },
  item: {
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 20,
		marginVertical: 8,
		flexDirection:'row'
  },
  header: {
    fontSize: 15,
		color: Colors.onSurfaceColorPrimary,
		fontFamily:'work-sans'
  },
  title: {
    fontSize: 24
  }
});

export default CommunityScreen;
