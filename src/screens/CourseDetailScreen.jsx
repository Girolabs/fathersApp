import React, { Component, Fragment } from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, TouchableNativeFeedback, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { I18nContext } from '../context/I18nProvider';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import moment from 'moment';
import 'moment/min/locales';
import { Flag } from 'react-native-svg-flagkit';
import axios from '../../axios-instance';
import * as Network from 'expo-network';
import { Snackbar } from 'react-native-paper';

class CourseDetailScreen extends Component {
	state = {
		course: null
	}
	async componentDidMount() {
		const { navigation } = this.props;
		const courseId = navigation.getParam('courseId');
		const status = await Network.getNetworkStateAsync();
		if (status.isConnected === true) {
			axios
				.get((`${i18n.locale}/api/v1/courses/${courseId}?fields=all&key=${Constants.manifest.extra.secretKey}`))
				.then((res) => {
					let course = res.data.result
					this.setState({ course })
					axios
						.get(`${i18n.locale}/api/v1/persons/${course.leaderAssignment.personId}?fields=all&key=${Constants.manifest.extra.secretKey}`)
						.then((respPerson) => {
							const person = respPerson.data.result;

							let leaderAssignment = {
								...course.leaderAssignment,
								person
							}
							console.log('mirar', leaderAssignment)
							course = {
								...course,
								leaderAssignment

							}
							this.setState({ course })
						}).catch(error => {
							this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false })
						})
				}).catch(error => {
					this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false })
				})
		} else {
			this.setState({ snackMsg: i18n.t('GENERAL.NO_INTERNET'), visible: true, loading: false })
		}

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
											{course.generation &&
												<TouchableComp onPress={() => {
													navigation.navigate('GenerationDetail', { generationId: course.generation.generationId })
												}}>
													<View style={styles.listItem}>
														<Text style={styles.listItemTitle}>{i18n.t('COURSE.GENERATION')}</Text>
														<Text style={styles.listItemBody}>{course.generation.name}</Text>
													</View>
												</TouchableComp>
											}

											<View style={styles.listItem}>
												<Text style={styles.listItemTitle}>{i18n.t('COURSE.CELEBRATION_DATE')}</Text>
												<Text style={styles.listItemBody}>{course.celebrationDate ? moment.utc(course.celebrationDate).format('D MMMM YYYY') : ''}</Text>
											</View>
											<View style={styles.listItem}>
												<Text style={styles.listItemTitle}>{i18n.t('COURSE.CONSECRATION_DATE')}</Text>
												<Text style={styles.listItemBody}>{course.idealConsecrationDate ? moment.utc(course.idealConsecrationDate).format('D MMMM YYYY') : ''}</Text>
											</View>
											{course.leaderAssignment &&
												<TouchableComp onPress={() => {
													if (course.leaderAssignment.person) {
														navigation.push('PatreDetail', { fatherId: course.leaderAssignment.person.personId })
													}


												}}>
													<View style={styles.listItem}>
														<Text style={styles.listItemTitle}>{i18n.t('COURSE.LEADER')}</Text>
														<View style={{ flexDirection: 'row' }}>
															{course.leaderAssignment.person &&
																<Image
																	source={{ uri: `https://schoenstatt-fathers.link${course.leaderAssignment.person.photo}` }}
																	style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
															}
															{course.leaderAssignment.person &&
																<View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
																	<Text style={styles.listItemBody}>{course.leaderAssignment.person.fullName}</Text>
																	<Text style={styles.listItemBody}>
																		{`${moment.utc(course.leaderAssignment.startDate).format('Do MMMM YYYY')} ${moment.utc(course.leaderAssignment.endDate).format('Do MMMM YYYY')}`}
																	</Text>
																</View>
															}

														</View>
													</View>
												</TouchableComp>
											}

											<View style={styles.listItem}>
												<Text style={styles.listItemTitle}>{i18n.t('COURSE.NOVITIATE_START')}</Text>
												<Text style={styles.listItemBody}>{course.novitiateStartDate ? moment.utc(course.novitiateStartDate).format('D MMMM YYYY') : ''}</Text>
											</View>
											{course.novitiateFiliation &&
												<TouchableComp onPress={() => {
													navigation.navigate('FiliationDetail', { filiationId: course.novitiateFiliation.filiationId })
												}}>
													<View style={styles.listItem}>

														<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

															<View style={{ marginRight: 10 }}>
																<Text style={styles.listItemTitle}>{i18n.t('COURSE.NOVITIATE')}</Text>
																<Text style={styles.listItemBody}>{course.novitiateFiliation ? course.novitiateFiliation.name : ''}</Text>

															</View>
															{course.novitiateFiliation &&
																<Flag id={course.novitiateFiliation.country} size={0.2} />
															}



														</View>

													</View>
												</TouchableComp>
											}

											{course.noviceMaster &&
												<TouchableComp
													onPress={() => {
														navigation.push('PatreDetail', { fatherId: course.noviceMaster.personId });
													}}
												>
													<View style={styles.listItem}>
														<Text style={styles.listItemTitle}>{i18n.t('COURSE.NOVICE_MASTER')}</Text>
														<View style={{ flexDirection: 'row', alignItems: 'center' }}>
															{course.noviceMaster &&
																<Image
																	source={{ uri: `https://schoenstatt-fathers.link${course.noviceMaster.photo}` }}
																	style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
															}

															<Text style={styles.listItemBody}>{course.noviceMaster ? course.noviceMaster.fullName : ''}</Text>
														</View>

													</View>
												</TouchableComp>
											}




											{course.scholasticateFiliations &&
												<TouchableComp
													onPress={() => {
														if (course.scholasticateFiliations[0]) {
															navigation.navigate('FiliationDetail', { filiationId: course.scholasticateFiliations[0].filiationId });
														}

													}}>
													<View style={styles.listItem}>
														<Text style={styles.listItemTitle}>{i18n.t('COURSE.SCHOLASTICATE')}</Text>
														<Text style={styles.listItemBody}>{course.scholasticateFiliations[0] ? course.scholasticateFiliations[0].name : null}</Text>
													</View>
												</TouchableComp>
											}
											<View style={{ backgroundColor: Colors.surfaceColorSecondary }}>
												<Text style={[styles.listItemTitle, { paddingLeft: 15 }]}>{i18n.t('COURSE.SCHOLASTICATE_RECTORS')}</Text>
												{course.scholasticateRectors.map(rector => {
													return (
														<TouchableComp
															key={rector.personId}
															onPress={() => {
																navigation.push('PatreDetail', { fatherId: rector.personId });
															}}
														>
															<View style={styles.listItem}>

																<View style={{ flexDirection: 'row', alignItems: 'center' }}>
																	{rector &&
																		<Image
																			source={{ uri: `https://schoenstatt-fathers.link${rector.photo}` }}
																			style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
																	}

																	<Text style={styles.listItemBody}>{rector ? rector.fullName : ''}</Text>
																</View>

															</View>
														</TouchableComp>
													)
												})}
											</View>
											{course.firstTertianshipFiliation &&
												<Fragment>
													<Text style={styles.sectionHeader}>
														{i18n.t('COURSE.FIRST_TERTIANSHIP')}
													</Text>
													<TouchableComp onPress={() => {
														navigation.navigate('FiliationDetail', { filiationId: course.firstTertianshipFiliation.filiationId })
													}}>
														<View style={styles.listItem}>
															<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
																<View style={{ marginRight: 10 }}>
																	<Text style={styles.listItemTitle}>{i18n.t('COURSE.FILIATION')}</Text>
																	<Text style={styles.listItemBody}>{course.firstTertianshipFiliation.name}</Text>
																</View>
																{course.firstTertianshipFiliation.country &&
																	<Flag id={course.firstTertianshipFiliation.country} size={0.2} />
																}

															</View>
														</View>
													</TouchableComp>
													<TouchableComp onPress={() => {
														navigation.push('PatreDetail', { fatherId: course.firstTertianshipMaster.personId })
													}}>
														<View style={styles.listItem}>
															<Text style={styles.listItemTitle}>{i18n.t('COURSE.MASTER')}</Text>
															<View style={{ flexDirection: 'row', alignItems: 'center' }}>
																{course.firstTertianshipMaster &&
																	<Image
																		source={{ uri: `https://schoenstatt-fathers.link${course.firstTertianshipMaster.photo}` }}
																		style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
																}

																<Text style={styles.listItemBody}>{course.firstTertianshipMaster.fullName ? course.firstTertianshipMaster.fullName : ''}</Text>
															</View>

														</View>
													</TouchableComp>
													<View style={styles.listItem}>
														<Text style={styles.listItemTitle}>{i18n.t('COURSE.START_DATE')}</Text>
														<Text style={styles.listItemBody}>{course.firstTertianshipStartDate ? moment.utc(course.firstTertianshipStartDate).format('Do MMMM YYYY') : ''}</Text>
													</View>
													<View style={styles.listItem}>
														<Text style={styles.listItemTitle}>{i18n.t('COURSE.END_DATE')}</Text>
														<Text style={styles.listItemBody}>{course.firstTertianshipEndDate ? moment.utc(course.firstTertianshipEndDate).format('Do MMMM YYYY') : ''}</Text>
													</View>
												</Fragment>
											}
											{course.secondTertianshipFiliation &&
												<Fragment>
													<Text style={styles.sectionHeader}>
														{i18n.t('COURSE.SECOND_TERTIANSHIP')}
													</Text>
													<TouchableComp onPress={() => {
														navigation.navigate('FiliationDetail', { filiationId: course.secondTertianshipFiliation.filiationId })
													}}>
														<View style={styles.listItem}>
															<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
																<View style={{ marginRight: 10 }}>
																	<Text style={styles.listItemTitle}>{i18n.t('COURSE.FILIATION')}</Text>
																	<Text style={styles.listItemBody}>{course.secondTertianshipFiliation.name}</Text>
																</View>
																{course.secondTertianshipFiliation.country &&
																	<Flag id={course.secondTertianshipFiliation.country} size={0.2} />
																}

															</View>
														</View>
													</TouchableComp>
													<TouchableComp onPress={() => {
														navigation.push('PatreDetail', { fatherId: course.secondTertianshipMaster.personId })
													}}>
														<View style={styles.listItem}>
															<Text style={styles.listItemTitle}>{i18n.t('COURSE.MASTER')}</Text>
															<View style={{ flexDirection: 'row', alignItems: 'center' }}>
																{course.secondTertianshipMaster &&
																	<Image
																		source={{ uri: `https://schoenstatt-fathers.link${course.secondTertianshipMaster.photo}` }}
																		style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
																}

																<Text style={styles.listItemBody}>{course.secondTertianshipMaster.fullName ? course.secondTertianshipMaster.fullName : ''}</Text>
															</View>

														</View>
													</TouchableComp>
													<View style={styles.listItem}>
														<Text style={styles.listItemTitle}>{i18n.t('COURSE.START_DATE')}</Text>
														<Text style={styles.listItemBody}>{course.secondTertianshipStartDate ? moment.utc(course.secondTertianshipStartDate).format('Do MMMM YYYY') : ''}</Text>
													</View>
													<View style={styles.listItem}>
														<Text style={styles.listItemTitle}>{i18n.t('COURSE.END_DATE')}</Text>
														<Text style={styles.listItemBody}>{course.secondTertianshipEndDate ? moment.utc(course.secondTertianshipEndDate).format('Do MMMM YYYY') : ''}</Text>
													</View>

												</Fragment>
											}

											{course.sionzeitFiliation &&
												<Fragment>
													<Text style={styles.sectionHeader}>
														{i18n.t('COURSE.SION_TIME')}
													</Text>
													<TouchableComp onPress={() => {
														navigation.navigate('FiliationDetail', { filiationId: course.sionzeitFiliation.filiationId })
													}}>
														<View style={styles.listItem}>
															<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
																<View style={{ marginRight: 10 }}>
																	<Text style={styles.listItemTitle}>{i18n.t('COURSE.FILIATION')}</Text>
																	<Text style={styles.listItemBody}>{course.sionzeitFiliation.name}</Text>
																</View>
																{course.sionzeitFiliation.country &&
																	<Flag id={course.sionzeitFiliation.country} size={0.2} />
																}

															</View>
														</View>
													</TouchableComp>
													<TouchableComp onPress={() => {
														navigation.push('PatreDetail', { fatherId: course.sionzeitCoordinator.personId })
													}}>
														<View style={styles.listItem}>
															<Text style={styles.listItemTitle}>{i18n.t('COURSE.MASTER')}</Text>
															<View style={{ flexDirection: 'row', alignItems: 'center' }}>
																{course.sionzeitCoordinator &&
																	<Image
																		source={{ uri: `https://schoenstatt-fathers.link${course.sionzeitCoordinator.photo}` }}
																		style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
																}

																<Text style={styles.listItemBody}>{course.sionzeitCoordinator.fullName ? course.sionzeitCoordinator.fullName : ''}</Text>
															</View>

														</View>
													</TouchableComp>
													<View style={styles.listItem}>
														<Text style={styles.listItemTitle}>{i18n.t('COURSE.START_DATE')}</Text>
														<Text style={styles.listItemBody}>{course.sionzeitStartDate ? moment.utc(course.sionzeitStartDate).format('Do MMMM YYYY') : ''}</Text>
													</View>
													<View style={styles.listItem}>
														<Text style={styles.listItemTitle}>{i18n.t('COURSE.END_DATE')}</Text>
														<Text style={styles.listItemBody}>{course.sionzeitEndDate ? moment.utc(course.sionzeitEndDate).format('Do MMMM YYYY') : ''}</Text>
													</View>

												</Fragment>
											}
											<Text style={styles.sectionHeader}>{i18n.t('COURSE.MEMBERS')}</Text>
											{course.persons.map(person => {
												return (
													<TouchableComp key={person.personId} onPress={() => navigation.push('PatreDetail', { fatherId: person.personId })}>
														<View style={styles.memberItem}
														>

															<Image
																source={{ uri: `https://schoenstatt-fathers.link${person.photo}` }}
																style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
															/>


															<Text style={{ fontSize: 12, color: Colors.primaryColor, fontFamily: 'work-sans-semibold' }}>{person.fullName}</Text>
														</View>
													</TouchableComp>

												)
											})}
										</View>
									</Fragment>
								) : <ActivityIndicator size="large" color={Colors.primaryColor} />}
								<Snackbar visible={this.state.visible} onDismiss={() => this.setState({ visible: false })} style={styles.snackError}>
									{this.state.snackMsg}
								</Snackbar>
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
	memberItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.surfaceColorSecondary,
		padding: 15,
		borderBottomColor: Colors.onSurfaceColorSecondary,
		borderBottomWidth: 0.5,
	},
	snackError: {
		backgroundColor: Colors.secondaryColor,
	},

})

export default CourseDetailScreen;