import React, { Component, Fragment } from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, TouchableNativeFeedback, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { I18nContext } from '../context/I18nProvider';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import moment from 'moment';
import 'moment/min/locales';
import { Flag } from 'react-native-svg-flagkit';

class CourseDetailScreen extends Component {
	state = {
		course: null
	}
	componentDidMount() {
		const { navigation } = this.props;
		const courseId = navigation.getParam('courseId');
		axios
			.get((`https://schoenstatt-fathers.link/en/api/v1/courses/${courseId}?fields=all&key=${Constants.manifest.extra.secretKey}`))
			.then((res) => {
				let  course = res.data.result
				axios
					.get(`https://schoenstatt-fathers.link/en/api/v1/persons/${course.leaderAssignment.personId}?fields=all&key=${Constants.manifest.extra.secretKey}`)
					.then((respPerson) => {
						const person = respPerson.data.result;

						let leaderAssignment = {
							...course.leaderAssignment,
							person
						}
						console.log('mirar',leaderAssignment)
						course = {
							...course,
							leaderAssignment

						}
						this.setState({ course })
					})
			})
	}
	render() {
		let TouchableComp = TouchableOpacity;
		if (Platform.OS === 'android' && Platform.Version >= 21) {
			TouchableComp = TouchableNativeFeedback;
		}
		const { course } = this.state;
		const { navigation } = this.props;


		return (
			<I18nContext.Consumer>
				{(value) => {
					moment.locale(value.lang);
					return (
						<SafeAreaView>
							<ScrollView>
								{course ? (
									<Fragment>
										<View style={styles.titleContainer}>
											<Text style={styles.title}>
												{course.name}
											</Text>
										</View>
										<View>
											<Text style={styles.sectionHeader}>
												{i18n.t('COURSE.INFORMATION')}
											</Text>
											<TouchableComp onPress={() => {
												navigation.navigate('GenerationDetail', { generationId: course.generation.generationId })
											}}>
												<View style={styles.listItem}>
													<Text style={styles.listItemTitle}>{i18n.t('COURSE.GENERATION')}</Text>
													<Text style={styles.listItemBody}>{course.generation.name}</Text>
												</View>
											</TouchableComp>
											<View style={styles.listItem}>
												<Text style={styles.listItemTitle}>{i18n.t('COURSE.CELEBRATION_DATE')}</Text>
												<Text style={styles.listItemBody}>{course.celebrationDate ? moment.utc(course.celebrationDate).format('D MMMM YYYY') : ''}</Text>
											</View>
											<View style={styles.listItem}>
												<Text style={styles.listItemTitle}>{i18n.t('COURSE.CONSECRATION_DATE')}</Text>
												<Text style={styles.listItemBody}>{course.idealConsecrationDate ? moment.utc(course.idealConsecrationDate).format('D MMMM YYYY') : ''}</Text>
											</View>
											<TouchableComp onPress = {() => {
												navigation.push('PatreDetail', { fatherId: course.leaderAssignment.person.personId })
											}}>	
											<View style={styles.listItem}>	
												<Text style={styles.listItemTitle}>{i18n.t('COURSE.LEADER')}</Text>
												<View style= {{ flexDirection: 'row'}}>
														<Image
															source={{ uri: `https://schoenstatt-fathers.link${course.leaderAssignment.person.photo}`}}
															style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
														<View style={{ flexDirection: 'column', alignItems: 'flex-start' , justifyContent: 'center' }}>
                                  <Text style={styles.listItemBody}>{course.leaderAssignment.person.fullName}</Text>
                                  <Text style={styles.listItemBody}>
                                    {`${moment.utc(course.leaderAssignment.startDate).format('Do MMMM YYYY')} ${moment.utc(course.leaderAssignment.endDate).format('Do MMMM YYYY')}`}
                                  </Text>
                                </View>
												</View>
											</View>
											</TouchableComp>
											<View style={styles.listItem}>
												<Text style={styles.listItemTitle}>{i18n.t('COURSE.NOVITIATE_START')}</Text>
												<Text style={styles.listItemBody}>{course.novitiateStartDate ? moment.utc(course.novitiateStartDate).format('D MMMM YYYY') : ''}</Text>
											</View>
											<TouchableComp onPress = {() => {
												navigation.navigate('FiliationDetail', { filiationId: course.novitiateFiliation.filiationId })
											}}>
											<View style={styles.listItem}>
												<Text style={styles.listItemTitle}>{i18n.t('COURSE.NOVITIATE')}</Text>
												<View style={{ flexDirection: 'row', alignItems: 'center'}}>
													<View style={{ marginRight: 10}}>
													<Flag id={course.novitiateFiliation.country} size={0.15}  />
													</View>
													
													<Text style={styles.listItemBody}>{course.novitiateFiliation ? course.novitiateFiliation.name : ''}</Text>
												</View>
												
											</View>
											</TouchableComp>
										
											<TouchableComp 
												onPress={() => {
													navigation.push('PatreDetail', {fatherId: course.noviceMaster.personId});
												}}
											>
											<View style={styles.listItem}>
												<Text style={styles.listItemTitle}>{i18n.t('COURSE.NOVICE_MASTER')}</Text>
												<View style= {{ flexDirection: 'row', alignItems:'center'}}>
												<Image
															source={{ uri: `https://schoenstatt-fathers.link${course.noviceMaster.photo}`}}
															style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
													<Text style={styles.listItemBody}>{course.noviceMaster ? course.noviceMaster.fullName : ''}</Text>
												</View>
												
											</View>
											</TouchableComp>
										</View>
									</Fragment>
								) : <ActivityIndicator size="large" color={Colors.primaryColor} />}
							</ScrollView>
						</SafeAreaView>
					)
				}}
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
		textAlign: 'left',
		fontFamily: 'work-sans',
		fontSize: 12,
		color: Colors.onSurfaceColorPrimary
	},

})

export default CourseDetailScreen;