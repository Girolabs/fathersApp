import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, Button, AsyncStorage } from 'react-native';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputWithFormik from '../components/InputWithFormik';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { pathHasError } from '../utils/form-utils';
import * as Network from 'expo-network';
import axios from '../../axios-instance';
import i18n from 'i18n-js';
import { jwtDecode } from '../utils/jwt-utils';
import jwt from 'jwt-decode' // import dependency
import Constants from 'expo-constants';
import { Snackbar } from 'react-native-paper';
import Colors from '../constants/Colors';



const styles = StyleSheet.create({
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
})

class FatherFormScreen extends Component {
  state = {
    father:{},
    loading:false
  }
  async componentDidMount() {
    await this.loadPerson();
    await this.loadInterfaceData();
  };

  loadInterfaceData = () => {
    this.setState({loading:true});
    if(status.isConnected == true ) {
      axios.get(`${i18n.locale}/api/v1/interface-data`).then (response => {
        
      
      })
    }
    
  }

  loadPerson = async () => {
    this.setState({loading:true})
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected === true ) {
      const fatherId = this.props.navigation.getParam('fatherId');
      if (!!fatherId) {
        axios.get(`${i18n.locale}/api/v1/persons/${fatherId}?fields=all&$key=${Constants.manifest.extra.secrekey}`)
        .then(response =>{
          const father = response.data.result;
          this.setState({father, loading:false})
          
        })
      }else {
        let decode = await AsyncStorage.getItem('token');
        decode = JSON.parse(decode);
        decode = jwt(decode.jwt).sub;
        axios.get(`${i18n.locale}/api/v1/persons?userId=${5}&fields=all&key=${Constants.manifest.extra.secretKey}`).
        then(response => {
          const fatherId = !!response.data.result && response.data.result[0].personId;
          axios.get(`${i18n.locale}/api/v1/persons/${fatherId}?fields=all&key=${Constants.manifest.extra.secrekey}`)
            .then(response => {
              const father = response.data.result;
              this.setState({father,loading:false})
            },(error) => {
              this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false })
            })
        },
        (error) => {
          this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false })
        } )
      }
    }else {
      this.setState({loading:false,visible:true, snackMsg:i18n.t('GENERAL.NO_INTERNET')});
    }
  }
  render() {
    return (<>
      <Formik initialValues={{ email: 'ola' }} onSubmit={(values) => console.log(values)}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <Fragment>
            <InputWithFormik label="email" name="email" />
            <InputWithFormik label="contactNotes" name="contactNotes" />
            <Button onPress={handleSubmit} title="Submit" />
          </Fragment>
        )}
      </Formik>
      <Snackbar visible={this.state.visible} onDismiss={() => this.setState({ visible: false })} style={styles.snackError}>
            {this.state.snackMsg}
      </Snackbar>
      </>
    );
  }
}

FatherFormScreen.navigationOptions = (navigationData) => ({
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
});




export default FatherFormScreen;
