import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { I18nContext } from '../context/I18nProvider';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import moment from 'moment';
import 'moment/min/locales';
class GenerationDetailScreen extends Component {
	state = {
		generation: []
	}
	componentDidMount() {
		const { navigation } = this.props;
		const generationId = navigation.getParam('generationId');
		axios
			.get(`https://schoenstatt-fathers.link/en/api/v1/generations/${generationId}?fields=all&key=${Constants.manifest.extra.secretKey}`)
			.then((res) => {
				this.setState({ generation: res.data.result })
			})
	}
	render() {
		let TouchableComp = TouchableOpacity;
		if (Platform.OS === 'android' && Platform.Version >= 21) {
			TouchableComp = TouchableNativeFeedback;
		}
		return (
			<I18nContext.Consumer>
				{(value) => {
					moment.locale(value.lang);
					return (
						<SafeAreaView>
							<ScrollView>
								{this.state.generation ? (
									<Fragment>
										<View style={styles.titleContainer}>
											<Text style={styles.title}>{this.state.generation.name}</Text>
										</View>
										<View>
											<Text style={styles.sectionHeader}> {i18n.t('GENERATION.GENERATION_INFO')} </Text>

											<View style={styles.listItem}>
												<Text style={styles.listItemTitle}> {i18n.t('GENERATION.CELEBRATION_DATE')} </Text>
												<Text style={styles.listItemBody}>{this.state.generation.celebrationDate ? moment.utc(this.state.generation.celebrationDate).format('Do MMMM YYYY') : ''}</Text>
											</View>

											<View style={styles.listItem} >
												<Text style={styles.listItemTitle}>{i18n.t('GENERATION.FOUNDATION_DATE')}</Text>
												<Text style={styles.listItemBody}>{this.state.generation.foundingDate ? moment.utc(this.state.generation.foundingDate).format('Do MMMM YYYY') : ''}</Text>
											</View>
											<Text style={styles.sectionHeader}> {i18n.t('GENERATION.COURSES')} </Text>
											{this.state.generation.courses &&
												<View>
													{
														this.state.generation.courses.map(course => {
															return (
																<TouchableComp onPress={() => {
																	this.props.navigation.navigate('CourseDetail', {
																		courseId: course.courseId
																	})
																}}>
																	<View style={styles.card}>
																		<Text style={styles.cardTitle}>{course.name}</Text>
																		<View style={styles.cardBody}>
																			<Text style={styles.cardBodyText}>{i18n.t('GENERATION.CELEBRATION_DATE')}</Text>
																			<Text style={styles.cardBodyTextBold}>{course.celebrationDate ? moment.utc(course.celebrationDate).format('Do MMMM YYYY') : ''}</Text>
																		</View>
																	</View>
																</TouchableComp>
															)
														})
													}
												</View>
											}

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

GenerationDetailScreen.navigationOptions = () => ({
	headerTitle: '',
});

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
	card: {
		width: '90%',
		marginLeft: 15,
		marginVertical: 15,
		padding: 15,
		backgroundColor: Colors.primaryColor,
		borderRadius: 5,
	},
	cardTitle: {
		color: Colors.surfaceColorSecondary,
		fontSize: 18,
		fontFamily: 'work-sans-semibold',

	},
	cardBody: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomColor: Colors.onSurfaceColorSecondary,
		borderBottomWidth: 0.5,
		paddingVertical: 10,
	},
	cardBodyText: {
		color: Colors.surfaceColorSecondary,
		fontSize: 15,
		fontFamily: 'work-sans',
		width: '50%',
	},
	cardBodyTextBold: {
		color: Colors.surfaceColorSecondary,
		fontSize: 15,
		fontFamily: 'work-sans-semibold',
		textAlign: 'left',
		width: '50%',
	}


})

export default GenerationDetailScreen;