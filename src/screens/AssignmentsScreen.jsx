import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TouchableNativeFeedback, ActivityIndicator, SafeAreaView, SectionList, Image } from 'react-native';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import axios from 'axios';
import Constants from 'expo-constants';
import { Ionicons } from 'expo-vector-icons';
import moment from 'moment';
import 'moment/min/locales';
import { I18nContext } from '../context/I18nProvider';

class AssignmentsScreen extends Component {
	state = {
		selectedtTab: 0,
		territories: [],
		loading: true
	}
	componentDidMount() {

		axios.get(`https://schoenstatt-fathers.link/en/api/v1/territories?fields=all&key=${Constants.manifest.extra.secretKey}`)
			.then(resTerritory => {
				let territories = resTerritory.data.result


				axios.get(`https://schoenstatt-fathers.link/en/api/v1/assignments?fields=all&key=${Constants.manifest.extra.secretKey}`)
					.then(resAssingment => {
						let assingments = resAssingment.data.result;
						territories = territories.map(territory => {
							return {
								...territory,
								data: territory.assignments
							}
						})
						console.log(territories)
						this.setState({ territories, loading: false })
					})

			})
	}
	render() {
		let TouchableComp = TouchableOpacity;
		if (Platform.OS === 'android' && Platform.Version >= 21) {
			TouchableComp = TouchableNativeFeedback;
		}

		const tabs = [
			{
				text: i18n.t('ASSIGNMENTS.TERRITORY')
			},
			{
				text: i18n.t('ASSIGNMENTS.ALL')
			},
			{
				text: i18n.t('ASSIGNMENTS.HISTORICAL')
			}
		]
		return (
			<I18nContext.Consumer>
				{(value) => {
					moment.locale(value.lang);
					return (
						<SafeAreaView>
							{!this.state.loading ?
								<Fragment>
									<View style={styles.tabsGroup}>


										{tabs.map((tab, index) => {
											return (
												<TouchableComp
													key={index}
													onPress={() => {
														this.setState({ selectedtTab: index })
													}}
												>
													<View style={[(this.state.selectedtTab === index) ? styles.tabButtonSelected : styles.tabButton]}>
														<Text style={[(this.state.selectedtTab === index) ? styles.tabButtonTextSelected : styles.tabButtonText]}>{tab.text}</Text>
													</View>
												</TouchableComp>
											)
										})}




									</View>
									<View>
										<SectionList
											sections={this.state.territories}
											renderItem={({ item }) =>
												<Item
													name={item.person.fullName}
													photo={item.person.photo}
													roleTitle={item.roleTitle}
													startDate={item.startDate}
													endDate={item.endDate}
												/>
											}
											renderSectionHeader={({ section: { name } }) =>
												<Header name={name} />
											}
										/>
									</View>
								</Fragment>
								: <ActivityIndicator size="large" color={Colors.primaryColor} />}
						</SafeAreaView>
					)
				}}
			</I18nContext.Consumer>


		);
	}
}

const Header = (props) => {
	const { name } = props
	let TouchableComp = TouchableOpacity;
	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableComp = TouchableNativeFeedback;
	}

	return (
		<TouchableComp onPress={() => {


		}}>
			<View style={styles.sectionHeaderContainer}>
				<Text style={styles.header}>{name}</Text>
				<Ionicons name='ios-help-circle-outline' size={23} color={Colors.primaryColor} />
			</View>

		</TouchableComp>
	)

}

const Item = (props) => {
	const { photo, name, startDate, endDate, roleTitle } = props;
	let TouchableComp = TouchableOpacity;
	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableComp = TouchableNativeFeedback;
	}
	return (
		<View style={styles.itemContainer}>
			<Image
				style={{ width: 45, height: 45, borderRadius: 50 }}
				resizMode="center"
				source={{

					uri: `https://schoenstatt-fathers.link${photo}`
				}} />
			<View style={styles.itemTextContainer}>
				<Text>{roleTitle}</Text>
				<Text>{name}</Text>
				<Text>{`${startDate ? moment.utc(startDate).format('Do MMMM YYYY') : ''} - ${endDate ? moment.utc(endDate).format('Do MMMM YYYY') : ''}`}</Text>
				<Text></Text>
			</View>
		</View>
	)

}

const styles = StyleSheet.create({
	screen: {

	},
	tabsGroup: {
		flexDirection: 'row',
		marginTop: 10
	},
	tabButtonSelected: {
		flex: 0.33,
		borderColor: Colors.primaryColor,
		borderWidth: 2,
		borderRadius: 5,
		paddingVertical: 5,
		marginHorizontal: 5,
		backgroundColor: Colors.primaryColor
	},
	tabButton: {
		flex: 0.33,
		borderColor: Colors.primaryColor,
		borderWidth: 2,
		borderRadius: 5,
		paddingVertical: 5,
		backgroundColor: 'white',
		marginHorizontal: 5
	},
	tabButtonTextSelected: {
		textAlign: 'center',
		color: 'white',
		fontSize: 12,
		fontFamily: 'work-sans-bold',
		textTransform: 'uppercase',
	},
	tabButtonText: {
		textAlign: 'center',
		color: Colors.primaryColor,
		fontSize: 12,
		fontFamily: 'work-sans-bold',
		textTransform: 'uppercase',
	},
	header: {
		fontSize: 15,
		color: Colors.onSurfaceColorPrimary,
		fontFamily: 'work-sans-medium',

		marginVertical: 10
	},
	sectionHeaderContainer: {
		flexDirection: 'row',
		marginVertical: 10,
		paddingHorizontal: 16,
		justifyContent: 'space-between',
		alignItems: 'center'

	},
	itemContainer: {
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	itemTextContainer: {
		justifyContent:'center',
		paddingHorizontal: 5
	}
});

export default AssignmentsScreen;