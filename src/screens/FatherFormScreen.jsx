import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, Button, AsyncStorage, Platform, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import { NavigationEvents, SafeAreaView } from 'react-navigation';



const styles = StyleSheet.create({
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
  btnContainer: {
    backgroundColor: 'white',
    borderColor: Colors.primaryColor,
    borderRadius: 5,
    borderWidth: 2,
    paddingHorizontal: 10,
    width: '45%',
    height: 50,
    marginHorizontal: 15,
    justifyContent: 'center',
    marginVertical:10
  },
  btnText:{
    textAlign:'center',
    fontSize: 12,
    fontFamily:'work-sans-bold',
    textTransform:'uppercase',
    color:Colors.primaryColor
  }
})

class FatherFormScreen extends Component {
  state = {
    father:{},
    loading:false,
    updateFields:[]
  }
  async componentDidMount() {
    await this.loadPerson();
    
  };

  loadInterfaceData = async  () => {
    this.setState({loading:true});
    const status = await Network.getNetworkStateAsync();
    if(status.isConnected == true ) {
      axios.get(`${i18n.locale}/api/v1/interface-data`).then (response => {
        console.log('father', this.state.father)
        const viewPermRole = this.state.father.viewPermissionForCurrentUser;
        const updatePermRole = this.state.father.updatePermissionForCurrentUser;

        const personFieldsByViewPermission = response.data.result.personFieldsByViewPermission;
        const personFieldsByUpdatePermission = response.data.result.personFieldsByUpdatePermission;

        

        let updateRoles = Object.keys(personFieldsByUpdatePermission);
        
        const arrayOfRoles = updateRoles.map(rol => {
          return personFieldsByUpdatePermission[rol];
        })
        console.log(arrayOfRoles)

        const accumulatedFieldsPerRol = arrayOfRoles.map((rol,index) => {
          let accu = [];
          arrayOfRoles.forEach((el,i) => {
            if (i<=index) {
              accu = accu.concat(el);
            }
          })
          return accu
        })

        let index = updateRoles.indexOf(
          updatePermRole
        );
        const updateFields = accumulatedFieldsPerRol[index];

        this.setState({updateFields})

        console.log('final', accumulatedFieldsPerRol);
        const regex = {
          instagramUserRegex:response.data.result.instagramUserRegex,
          skypeUserRegex:response.data.result.skypeUserRegex,
          slackUserRegex:response.data.result.slackUserRegex,
          twitterUserRegex:response.data.result.twitterUserRegex,
        }
        this.setState({fieldsPerm : accumulatedFieldsPerRol,regex:regex,loading:false});    
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
          axios.get(`${i18n.locale}/api/v1/interface-data`).then (response => {
            console.log('father', this.state.father)
            this.loadInterfaceData();
          
          })
        }
          
        )
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
              this.loadInterfaceData();
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

  /* onSubmit = (values) => {
    console.log('calling on submit',values);
    this.setState({loading:true});
    this.setState({loading:false})

  
  } */

  render() {
    let TouchableComp = TouchableOpacity;
    if(Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableComp = TouchableNativeFeedback;
    }
    

    const { father, updateFields, regex, loading } = this.state;
    let validationSchema 
    if(regex) {
    validationSchema = Yup.object().shape({
        ...(updateFields.indexOf('slackUser') != -1 && !!father.slackUser ? {slackUser:Yup.string().matches('^[a-z0-9][a-z0-9._-]*$')}:null),
        ...(updateFields.indexOf('instagramUser') != -1 && !!father.instagramUser ? {instagramUser:Yup.string().matches(regex.instagramUserRegex)}:null),
        //...(updateFields.indexOf('instagramUser') != -1 && !!father.instagramUser ? {instagramUser:father.instagramUser}:null),
        ...(updateFields.indexOf('twitterUser') != -1 && !!father.twitterUser ? {twitterUser:Yup.string().matches(regex.twitterUserRegex)}:null)  
      })
    }
    

    return (<>
      <NavigationEvents onDidFocus={async () => {
        await this.loadPerson();
      }} />
      {!loading ?
      <>
      <View style={{ paddingHorizontal:15, marginVertical:30, width: '80%' }}>
        <Text style={{
                        fontFamily: 'work-sans-semibold',
                        fontSize: 24,
                        color: Colors.onSurfaceColorPrimary,
                      }}>{i18n.t('FATHER_EDIT.EDIT')}</Text>
      </View>
      <Formik initialValues={{ 
       // email: (!!father.email && father.email) || null,
        ...(updateFields.indexOf('slackUser') != -1 && !!father.slackUser ? {slackUser:father.slackUser}:{slackUser:null}),
        ...(updateFields.indexOf('instagramUser') != -1 && !!father.instagramUser ? {instagramUser:father.instagramUser}:{instagramUser:null}),
        ...(updateFields.indexOf('twitterUser') != -1 && !!father.twitterUser ? {twitterUser:father.twitterUser}:{twitterUser:null})  
        
        }} onSubmit={
          values => {
            console.log(values);
            axios.put(`${i18n.locale}/api/v1/persons/${this.state.father.personId}`,values).then(response => {

            })
          }
          }
          enableReinitialize
          validationSchema={validationSchema}
          >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          
          <Fragment>
            <InputWithFormik hasPerm={updateFields.indexOf('slackUser') != -1} label={i18n.t("FATHER_EDIT.INSTAGRAM")} name="instagramUser" />
            <InputWithFormik hasPerm={updateFields.indexOf('slackUser') != -1} label={i18n.t("FATHER_EDIT.SLACK")} name="slackUser" />
            <InputWithFormik hasPerm={updateFields.indexOf('slackUser') != -1} label={i18n.t("FATHER_EDIT.TWITTER")} name = "twitterUser" />
            <TouchableComp
              onPress={handleSubmit}>
              <View style={styles.btnContainer}>
                <Text style={styles.btnText}>{i18n.t('FATHER_EDIT.SAVE')}</Text>
              </View>
            </TouchableComp>
           
          </Fragment>
        )}
      </Formik>
      <Snackbar visible={this.state.visible} onDismiss={() => this.setState({ visible: false })} style={styles.snackError}>
            {this.state.snackMsg}
      </Snackbar>
      </>
      :  (<ActivityIndicator size="large" color={Colors.primaryColor} />)}
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
