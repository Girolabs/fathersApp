import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Picker,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import axios from '../../axios-instance';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from 'expo-vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import { HeaderTitle } from 'react-navigation-stack';
import * as Network from 'expo-network';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  title: {
    fontFamily: 'work-sans-semibold',
    fontSize: 24,
    color: Colors.primaryColor,
    marginVertical: 40,
  },
  screen: {
    backgroundColor: Colors.surfaceColorPrimary,
    height: '100%',
    paddingHorizontal: 10,
  },
  label: {
    fontFamily: 'work-sans-semibold',
    fontSize: 18,
    color: Colors.primaryColor,
  },
  pickerInnerContainer: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 10,
  },
  inputContainer: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.surfaceColorSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  inputDatePicker: {
    width: '80%',
  },
  buttonsContainer:{
    flexDirection: 'row',
    justifyContent:'space-between',
    flex:1,
  },
  btnContainerPrimary: {
    backgroundColor: 'white',
    borderColor: Colors.primaryColor,
    borderRadius: 5,
    borderWidth: 2,
    paddingHorizontal: 10,
    width: '99%',
    height: 50,
    justifyContent: 'center',
    marginVertical:10
   
  
  },
  btnContainerSecondary: {
    backgroundColor: 'white',
    borderColor: Colors.secondaryColor,
    borderRadius: 5,
    borderWidth: 2,
    paddingHorizontal: 10,
    width: '99%',
    height: 50,
    justifyContent: 'center',
    marginVertical:10
   
  
  },
  btnTextPrimary:{
    textAlign:'center',
    fontSize: 12,
    width:'100%',
    fontFamily:'work-sans-bold',
    textTransform:'uppercase',
    color:Colors.primaryColor
  },
  btnTextSecondary:{
    textAlign:'center',
    fontSize: 12,
    width:'100%',
    fontFamily:'work-sans-bold',
    textTransform:'uppercase',
    color:Colors.secondaryColor
  },
  itemContainer: {
    marginVertical:10
  }
});

const LivingSituationsFormScreen = ({ navigation }) => {
  const [livingSituation, setLivingSituation] = useState({});
  const [isCreate, setIsCreate] = useState(false);
  const [territories, setTerritories] = useState([]);

  useEffect(() => {
    const livingSituation = navigation.getParam('livingSituation');
    if (!!livingSituation) {
      setIsCreate(true);
    }
    loadTerritory();

    setLivingSituation(livingSituation);
  }, []);

  const loadTerritory = async () => {
    const status = await (await Network.getNetworkStateAsync());
    if ( status.isConnected ===true) {
      axios.get(`${i18n.locale}/api/v1/territories?fields=all&ey=${Constants.manifest.extra.secretKey}`)
        .then((res) => {
          if( res.data.status === "OK") {
            const fetchedDelegations =res.data.result.map(delegation =>{
              return {
                label: delegation.name,
                value: delegation.territoryId,
              }
            });
            //setLivingSituation(fetchedDelegations);
            setTerritories(fetchedDelegations);
          }
        })
    }
    
  };
  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <>
      <NavigationEvents
        onDidFocus={() => {
          console.log('onDidFocus');
        }}
      />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <SafeAreaView style={styles.screen}>
          <ScrollView>
            {isCreate ? (
              <Text style={styles.title}>{i18n.t('LIVING_SITUATION.EDIT_TITLE')}</Text>
            ) : (
              <Text style={styles.title}>{i18n.t('LIVING_SITUATION.CREATE_TITLE')}</Text>
            )}
            <Formik initialValues={{}} />
            <View>
              <Text style={styles.label}>{i18n.t('LIVING_SITUATION.RESPONSIBLE_TERRITORY')}</Text>
              <RNPickerSelect
                style={{
                  inputAndroid: {
                    backgroundColor: Colors.surfaceColorSecondary,
                    borderRadius: 10,
                  },
                  iconContainer: {
                    top: 10,
                    right: 15,
                  },
                }}
                onValueChange={(value) => console.log(value)}
                items={territories}
                Icon={() => {
                  return <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />;
                }}
              />
            </View>

            <View style={styles.itemContainer}>
              <Text style={styles.label}>{i18n.t('LIVING_SITUATION.STATUS')}</Text>
              <RNPickerSelect
                style={{
                  inputAndroid: {
                    backgroundColor: Colors.surfaceColorSecondary,
                  },
                  iconContainer: {
                    top: 10,
                    right: 15,
                  },
                }}
                onValueChange={(value) => console.log(value)}
                items={[
                  { label: 'Football', value: 'football' },
                  { label: 'Baseball', value: 'baseball' },
                  { label: 'Hockey', value: 'hockey' },
                ]}
                Icon={() => {
                  return <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />;
                }}
              />
            </View>
            <View>
              <Text style={styles.label}>{i18n.t('LIVING_SITUATION.START_DATE')}</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputDatePicker}></Text>
                <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
              </View>
            </View>
            <View>
              <Text style={styles.label}>{i18n.t('LIVING_SITUATION.END_DATE')}</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputDatePicker}></Text>
                <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
              </View>
            </View>

            <View>
              <Text style={styles.label}>{i18n.t('LIVING_SITUATION.PUBLIC_NOTES')}</Text>
              <TextInput style={styles.inputContainer} />
            </View>

            <View>
              <Text style={styles.label}>{i18n.t('LIVING_SITUATION.ADMIN_NOTES')}</Text>
              <TextInput style={styles.inputContainer} />
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={{flex:1}}>
                <View style={styles.btnContainerSecondary}>
                  <Text style={styles.btnTextSecondary}>{i18n.t('LIVING_SITUATION.ADD')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{flex:1}}>
                <View style={styles.btnContainerPrimary}>
                  <Text style={styles.btnTextPrimary}>{i18n.t('LIVING_SITUATION.SAVE')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

LivingSituationsFormScreen.navigationOptions = () => ({
  headerTitle:'',
})

export default LivingSituationsFormScreen;
