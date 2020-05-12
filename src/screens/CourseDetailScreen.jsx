import React, { Component } from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { I18nContext } from '../context/I18nProvider';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import moment from 'moment';
import 'moment/min/locales';

class CourseDetailScreen extends Component {
    state = {
        course: null
    }
    componentDidMount() {

    }
    render() {
        let TouchableComp = TouchableOpacity;
		if (Platform.OS === 'android' && Platform.Version >= 21) {
			TouchableComp = TouchableNativeFeedback;
		}
        return(
            <I18nContext.Consumer>
				{(value) => {
					moment.locale(value.lang);
					return (
						<SafeAreaView>
							<ScrollView>
                            </ScrollView>
                        </SafeAreaView>
                    )}}
                </I18nContext.Consumer>
        )
    }
}

CourseDetailScreen.navigationOptions = () => ({
    headerTitle: '',
})

const styles = StyleSheet.create({
    screen: {

    },
    titleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 30,
		paddingHorizontal: 16
	},
	title: {
		fontFamily: 'work-sans-semibold',
		fontSize: 27,
		color: Colors.primaryColor
	},
	sectionHeader: {
		fontFamily: 'work-sans-medium',
		color: Colors.onSurfaceColorPrimary,
		fontSize: 11,
		padding: 15,
		letterSpacing: 2.5,
		textTransform: 'uppercase',
		backgroundColor: Colors.surfaceColorPrimary

	},
	listItem: {
		backgroundColor: Colors.surfaceColorSecondary,
		padding: 15
	},
	listItemTitle: {
		fontFamily: 'work-sans-semibold',
		fontSize: 18,
		color: Colors.onSurfaceColorPrimary
	},
	listItemBody: {
		fontFamily: 'work-sans',
		fontSize: 12,
		color: Colors.onSurfaceColorPrimary
	},

})

export default CourseDetailScreen;