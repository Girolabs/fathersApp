import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	SectionList,
	TouchableOpacity,
	Platform,
	ActivityIndicator,
	TouchableNativeFeedback,
} from 'react-native';
import { Flag } from 'react-native-svg-flagkit';
import { Ionicons } from 'expo-vector-icons';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Colors from '../constants/Colors';
import axios from '../../axios-instance';
import Constants from 'expo-constants';
import i18n from 'i18n-js';

class CommunityScreen extends Component {
	state = {
		delegations: [],
	};

	componentDidMount() {
		axios
			.get(`${i18n.locale}/api/v1/territories?fields=all&key=${Constants.manifest.extra.secretKey}`)
			.then((res) => {
				console.log(res)
				if (res.data.status == "OK") {
					const fetchedDelegations = res.data.result.map(entry => {
						return {
							...entry,
							data: entry.filiations.filter(filiation => filiation.isActive)
						}
					}).filter( commuunity => commuunity.isActive == true)
					this.setState({ delegations: fetchedDelegations });
				}
			});
	}

	render() {
		let TouchableComp = TouchableOpacity;
		if (Platform.OS === 'android' && Platform.Version >= 21) {
			TouchableComp = TouchableNativeFeedback;
		}
		return (
			<SafeAreaView style={styles.container}>
				{this.state.delegations.length > 0 ?
					<SectionList
						sections={this.state.delegations}
						renderItem={({ item }) => <Filiation key={item.filiationId} title={item.name} flag={item.country} onSelect={() => this.props.navigation.navigate('FiliationDetail', { filiationId: item.filiationId })} />}
						renderSectionHeader={({ section: { name, territoryId } }) => (
							<TouchableComp key={territoryId} onPress={(section) => {
								console.log(section)
								this.props.navigation.navigate('DelegationDetail', { delegationId: territoryId })
							}}>
								<View style={styles.sectionHeaderContainer}>
									<Text style={styles.header}>{name}</Text>
									<Ionicons name='ios-help-circle-outline' size={23} color={Colors.primaryColor} />
								</View>

							</TouchableComp>
						)}
					/>
					:
					<View>
						<ActivityIndicator size="large" color={Colors.primaryColor} />
					</View>
				}

			</SafeAreaView>
		);
	}
}

CommunityScreen.navigationOptions = (navigationData) => ({
	headerTitle: '',
	headerLeft: (
		<HeaderButtons HeaderButtonComponent={HeaderButton}>
			<Item
				title="Menu"
				iconName="md-menu"
				onPress={() => {
					navigationData.navigation.toggleDrawer();
				}}
			/>
		</HeaderButtons>
	),
})

const Filiation = ({ title, flag, onSelect, key }) => {
	let TouchableComp = TouchableOpacity;
	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableComp = TouchableNativeFeedback;
	}


	return (
		<TouchableComp key={key} onPress={() => {
			console.log('[Navegar a Filiation screen]')

			onSelect()
		}}>
			<View style={styles.item}>
				<View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '80%', alignItems: 'center' }}>
					<Flag id={flag} size={0.2} />
					<Text style={styles.title}>{title}</Text>
				</View>
				<Ionicons name="ios-arrow-forward" size={23} color={Colors.primaryColor} />
			</View>
		</TouchableComp>

	)
}



const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 15,
	},
	item: {
		backgroundColor: Colors.surfaceColorSecondary,
		padding: 20,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between'
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
	title: {
		fontSize: 18,
		fontFamily: 'work-sans-semibold',
		color: Colors.primaryColor,
		paddingHorizontal: 10
	},
});

export default CommunityScreen;
