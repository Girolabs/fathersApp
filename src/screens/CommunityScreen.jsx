import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    SectionList,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
} from 'react-native';
import { Flag } from 'react-native-svg-flagkit';
import { Ionicons } from 'expo-vector-icons';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Colors from '../constants/Colors';
import axios from 'axios';
import Constants from 'expo-constants';

class CommunityScreen extends Component {
    state = {
        delegations: [],
    };

    componentDidMount() {
        axios
            .get(`https://schoenstatt-fathers.link/en/api/v1/territories?fields=all&key=${Constants.manifest.extra.secretKey}`)
            .then((res) => {
                console.log(res)
                if (res.data.status == "OK") {
                    const fetchedDelegations = res.data.result.entries.map(entry => {
                        return {
                            ...entry,
                            data: [
                                { flag: 'AR', text: 'Buenos Aires' },
                                { flag: 'AR', text: 'Córdoba' },
                                { flag: 'AR', text: 'Tucumán' },
                            ]
                        }
                    })
                    
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
                {this.state.delegations.length > 0 && 
                <SectionList
                sections={this.state.delegations}
                renderItem={({ item }) => <Filiation title={item.text} flag={item.flag} onSelect = {() =>this.props.navigation.navigate('FiliationDetail')} />}
                renderSectionHeader={({ section: { name } }) => (
                    <TouchableComp onPress ={() =>{
                        this.props.navigation.navigate('DelegationDetail')
                    }}>
                        <View style={styles.sectionHeaderContainer}>
                        <Text style={styles.header}>{name}</Text>
                        <Ionicons name='ios-help-circle-outline' size={23} color={Colors.primaryColor} />
                        </View>
                       
                    </TouchableComp>
                )}
            />
                }
                
            </SafeAreaView>
        );
    }
}

CommunityScreen.navigationOptions = (navigationData) => ({
	headerTitle: 'Comunidad Oficial',
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

const Filiation = ({ title, flag, onSelect }) => {
	let TouchableComp = TouchableOpacity;
        if (Platform.OS === 'android' && Platform.Version >= 21) {
            TouchableComp = TouchableNativeFeedback;
        }


	return (
		<TouchableComp onPress = {() => {
			console.log('[Navegar a Filiation screen]')
			onSelect()
		}}>
			<View style={styles.item}>
				<View style={{flexDirection: 'row', justifyContent:'flex-start'}}>
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
        
		flexDirection: 'row',
		justifyContent: 'space-between'
    },
    header: {
        fontSize: 15,
        color: Colors.onSurfaceColorPrimary,
		fontFamily: 'work-sans-medium',
	
		marginVertical:10
	},
	sectionHeaderContainer: {
		flexDirection: 'row',
		marginVertical:10,
		paddingHorizontal:16,
		justifyContent:'space-between',
		alignItems: 'center'

	},
    title: {
		fontSize: 18,
		fontFamily:'work-sans-semibold',
		color: Colors.primaryColor,
		paddingHorizontal:10
    },
});

export default CommunityScreen;
