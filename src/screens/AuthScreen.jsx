import React, { Component } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, View, Text, Image } from 'react-native';
import  { I18nContext } from '../context/I18nProvider';
import Colors from '../constants/Colors';
import logo from '../../assets/img/icono.png';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';

import moment from 'moment';
import 'moment/min/locales';
import i18n from 'i18n-js';

class AuthScreen extends Component {
  render() {
		const lng = [
			{name: 'ES', value:'es'},
			{name:'EN', value:'en'}
		]
    return (
			<I18nContext.Consumer>
				{(value) => {
				/* 	moment.locale(value.lang); */
					return(
						<KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.screen}>
						<View style={styles.container}>
							<View style={styles.titleContainer}>
								<Image source={logo} style={{ width: 80, height: 80 }} />
								<Text style={styles.title}>Padres de Schoenstatt</Text>
							</View>
							<Card style={styles.authContainer}>
								<Input
									id="email"
									label="Email"
									required
									email
									autoCapitalize="none"
									keyboardType="email-addres"
									placeholder={i18n.t('AUTH_SCREEN.EMAIL_PLACEHOLDER')}
									initialValue=""
								/>
								<Select
									elements={lng}
									value={value.lang}
									valueChange={value.changeLang}
								/>
								<Button onPress={() => {
									this.props.navigation.navigate('Drawer')
								}}>
									<View style={styles.btnPrimary}>
										<Text style={styles.btnText}>{i18n.t('AUTH_SCREEN.NEXT')}</Text>
									</View>
								</Button>
								<Button>
									<View style={styles.btnSecondary}>
										<Text style={styles.btnText}>{i18n.t('AUTH_SCREEN.CODE')}</Text>
									</View>
								</Button>
							</Card>
						</View>
					</KeyboardAvoidingView>
					)
				}}


			</I18nContext.Consumer>

    );
  }
}

AuthScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
		padding: 40,
		marginBottom:20
  },
  title: {
    color: 'white',
    fontFamily: 'work-sans-bold',
		fontSize: 27,
		marginLeft:10
  },
  authContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: Colors.surfaceColorPrimary,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnPrimary: {
    backgroundColor: Colors.primaryColor,
		width: '100%',
		paddingHorizontal:5,
		paddingVertical:5,
		borderRadius:5,
		marginVertical:2
	},
	btnSecondary: {
		backgroundColor: Colors.secondaryColor,
		width: '100%',
		paddingHorizontal:5,
		paddingVertical:5,
		borderRadius:5,
		marginVertical:2
	},
	btnText:{
		color: 'white',
		textAlign:'center',
		textTransform: 'uppercase',
		fontFamily:'work-sans-bold'
	}
});

export default AuthScreen;
