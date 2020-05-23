import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TouchableNativeFeedback, ActivityIndicator, SafeAreaView, SectionList, Image, ScrollView } from 'react-native';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import axios from 'axios';
import Constants from 'expo-constants';
import { Ionicons } from 'expo-vector-icons';
import moment from 'moment';
import 'moment/min/locales';
import { I18nContext } from '../context/I18nProvider';
import { Flag } from 'react-native-svg-flagkit';


class AssignmentsScreen extends Component {
	state = {
		selectedtTab: 0,
		territories: [],
		loading: true,
		generations: [],
		courses: []
	}
	componentDidMount() {

		axios.get(`https://schoenstatt-fathers.link/en/api/v1/territories?fields=all&key=${Constants.manifest.extra.secretKey}`)
			.then(resTerritory => {
				let territories = resTerritory.data.result

				axios.get(`https://schoenstatt-fathers.link/en/api/v1/filiations?fields=all&key=${Constants.manifest.extra.secretKey}`)
					.then(resFiliations => {
						let filiations = resFiliations.data.result;
						territories = territories.map(territory => {
							let resfiliations = []
							if (territory.filiations) {
								resfiliations = territory.filiations.map(tFiliation => {
									let returnFiliation = null
									filiations.forEach(filiation => {
										if (tFiliation.filiationId == filiation.filiationId) {
											returnFiliation = {
												...tFiliation,
												data: filiation.assignments
											}
										}

									})
									if (returnFiliation != null) {
										return returnFiliation
									} else {
										return tFiliation
									}

								});
								return {
									...territory,
									filiations: resfiliations
								}
							}
						})
						territories = territories.map(territory => {
							let filiations = territory.filiations.map(filiation => {
								if (filiation.isActive == true) {
									return filiation
								}
							})
							filiations = filiations.filter(filiation => filiation != undefined);
							return {
								...territory,
								filiations
							}
						})

						console.log('t', territories)


						territories = territories.map(territory => {
							return {
								...territory,
								data: territory.assignments
							}
						})

						axios.get(`https://schoenstatt-fathers.link/en/api/v1/generations?fields=all&key=${Constants.manifest.extra.secretKey}`)
							.then((resGenerations) => {
								let generations = resGenerations.data.result;
								axios.get(`https://schoenstatt-fathers.link/en/api/v1/courses?fields=all&key=${Constants.manifest.extra.secretKey}`)
									.then((resCourses) => {
										let courses = resCourses.data.result;
										axios.get(`https://schoenstatt-fathers.link/en/api/v1/persons?fields=all&key=${Constants.manifest.extra.secretKey}`)
											.then((resPersons) => {
												let persons = resPersons.data.result;

												generations = generations.map(generation => {

													if (generation.mainAssignment) {
														let person = null;

														persons.map(el => {
															if (el.personId == generation.mainAssignment.personId) {
																person = el
															}
														});
														return {
															...generation,
															mainAssignment: {
																...generation.mainAssignment,
																person: person,
															}
														}
													} else {
														return {
															...generation
														}
													}
												});

												console.log('g', generations)

												this.setState({ generations })

												courses = courses.map(course => {
													if (course.leaderAssignment) {
														let person = null;

														persons.map(el => {
															if (el.personId == course.leaderAssignment.personId) {
																person = el
															}
														});
														return {
															...course,
															leaderAssignment: {
																...course.leaderAssignment,
																person: person,
															}
														}
													} else {
														return {
															...course
														}
													}
												})
												console.log('c', courses)
												this.setState({ courses })
											})
									})
							})
						this.setState({ territories, loading: false })
					})

			})
	}
	render() {
		const { territories, selectedtTab } = this.state
		let TouchableComp = TouchableOpacity;
		if (Platform.OS === 'android' && Platform.Version >= 21) {
			TouchableComp = TouchableNativeFeedback;
		}

		const tabs = [
			{
				text: i18n.t('ASSIGNMENTS.TERRITORY')
			},
			{
				text: i18n.t('ASSIGNMENTS.FILIATIONS')
			},
			{
				text: i18n.t('ASSIGNMENTS.HISTORICAL')
			},
			{
				text: i18n.t('ASSIGNMENTS.GENERATIONS')
			},
			{
				text: i18n.t('ASSIGNMENTS.COURSES')
			}
		]
		let filtered = []
		let list;
		if (territories.length > 0) {
			switch (selectedtTab) {
				case 0:
					filtered = territories.map(territory => {
						let data = territory.data.filter(assignment => assignment.isActive === true)
						return {
							...territory,
							data
						}
					})

					list = <SectionList
						sections={filtered}
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
					console.log('filtered', filtered)
					break;

				case 1:
					filtered = territories.map(territory => {
						let filiations = territory.filiations.map(filiation => {
							return {
								...filiation,
								data: filiation.data.map(asg => {
									return {
										...asg,
										filiationName: filiation.name,
										country: filiation.country
									}
								})
							}

						})
						return {
							...territory,
							filiations

						}
					})
					list = <ScrollView>{filtered.map(territory => {
						return (

							<View>
								<TouchableComp onPress={() => {


								}}>
									<View style={styles.sectionHeaderContainer}>
										<Text style={styles.header}>{territory.name}</Text>
										<Ionicons name='ios-help-circle-outline' size={23} color={Colors.primaryColor} />
									</View>

								</TouchableComp>
								{territory.filiations.map(filiation => {
									return (



										<Fragment>
											{filiation.data.map(asg => {
												return (
													<Fragment>
														{asg.isActive &&
															<View style={styles.itemContainer}>
																<Image
																	style={{ width: 45, height: 45, borderRadius: 50 }}
																	resizMode="center"
																	source={{

																		uri: `https://schoenstatt-fathers.link${asg.person.photo}`
																	}} />
																<View style={styles.itemTextContainer}>
																	<View style={{ flexDirection: 'row', alignItems: 'center' }}>
																		<Text style={{ marginRight: 5 }}>{asg.filiationName}</Text>
																		<Flag id={asg.country} size={0.1} />
																	</View>

																	<Text>{asg.roleTitle}</Text>
																	<Text>{asg.person.fullName}</Text>
																	<Text>{`${asg.startDate ? moment.utc(asg.startDate).format('Do MMMM YYYY') : ''} - ${asg.endDate ? moment.utc(asg.endDate).format('Do MMMM YYYY') : ''}`}</Text>
																	<Text></Text>
																</View>
															</View>
														}
													</Fragment>

												)

											})}
										</Fragment>


									)
								})}
							</View>


						)

					})}</ScrollView>
					console.log('fil', filtered)



					break
				case 2:
					filtered = territories
					list = <SectionList
						sections={filtered}
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
					break
				case 3:

					list = <ScrollView>
						{this.state.generations.map(generation => {
							return (
								<View style={{ padding:20, backgroundColor: Colors.surfaceColorSecondary}}>
									<Text>{`${i18n.t('ASSIGNMENTS.GENERATION')} ${generation.name}`}</Text>
									{generation.mainAssignment &&
										<Fragment>
											<View style={{ flexDirection:'row', alignItems: 'center'}}>
												<Text style={{marginRight:5}}>{generation.mainAssignment.person.fullName}</Text>
												<Flag id={generation.mainAssignment.person.country} size={0.1} />
											</View>
											
											<Text>{`${generation.mainAssignment.startDate ? moment.utc(generation.mainAssignment.startDate).format('Do MMMM YYYY') : ''} - ${
												generation.mainAssignment.endDate ? moment.utc(generation.mainAssignment.endDate).format('Do MMMM YYYY') : ''}`}</Text>
										</Fragment>

									}

								</View>
							)
						})}
					</ScrollView>

					break;
				case 4:
					filtered = territories
					list = <ScrollView>
						{this.state.courses.map(course => {
							return (
								<View style={{ padding:20, backgroundColor: Colors.surfaceColorSecondary}}>
									<Text>{`${i18n.t('ASSIGNMENTS.COURSE')} ${course.name}`}</Text>
									{course.leaderAssignment &&
										<Fragment>
											<View style={{ flexDirection:'row', alignItems: 'center'}}>
												<Text style={{marginRight:5}}>{course.leaderAssignment.person.fullName}</Text>
												<Flag id={course.leaderAssignment.person.country} size={0.1} />
											</View>
											
											<Text>{`${course.leaderAssignment.startDate ? moment.utc(course.leaderAssignment.startDate).format('Do MMMM YYYY') : ''} - ${
												course.leaderAssignment.endDate ? moment.utc(course.leaderAssignment.endDate).format('Do MMMM YYYY') : ''}`}</Text>
										</Fragment>

									}

								</View>
							)
						})}
					</ScrollView>
					break;
			}
		}


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
										{filtered &&
											<Fragment>
												{list}
											</Fragment>
										}

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

AssignmentsScreen.navigationOptions = (navigationData) => ({
	headerTitle: '',
});

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
		flex: 0.25,
		borderColor: Colors.primaryColor,
		borderWidth: 2,
		borderRadius: 5,
		paddingVertical: 5,
		marginHorizontal: 5,
		backgroundColor: Colors.primaryColor
	},
	tabButton: {
		flex: 0.25,
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
		justifyContent: 'center',
		paddingHorizontal: 5
	}
});

export default AssignmentsScreen;