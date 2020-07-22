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
  ActivityIndicator,
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
import * as _ from 'lodash';
import * as Yup from 'yup';

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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
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
    marginVertical: 10,
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
    marginVertical: 10,
  },
  btnTextPrimary: {
    textAlign: 'center',
    fontSize: 12,
    width: '100%',
    fontFamily: 'work-sans-bold',
    textTransform: 'uppercase',
    color: Colors.primaryColor,
  },
  btnTextSecondary: {
    textAlign: 'center',
    fontSize: 12,
    width: '100%',
    fontFamily: 'work-sans-bold',
    textTransform: 'uppercase',
    color: Colors.secondaryColor,
  },
  itemContainer: {
    marginVertical: 10,
  },
});

const LivingSituationsFormScreen = ({ navigation }) => {
  const [livingSituation, setLivingSituation] = useState({});
  const [isCreate, setIsCreate] = useState(false);
  const [territories, setTerritories] = useState([]);
  const [statusLabels, setStatusLabels] = useState([]);
  const [startDate, setStartDate] = useState();
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [endDate, setEndDate] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const livingSituation = navigation.getParam('livingSituation');
    if (!!livingSituation) {
      setIsCreate(true);
    }
    loadTerritory();
    let transFormedLiving = {
      ...livingSituation,
      startDate: livingSituation && livingSituation.startDate ? livingSituation.startDate.split('T')[0] : null,
      endDate: livingSituation && livingSituation.endDate ? livingSituation.endDate.split('T')[0] : null,
    };

    setStartDate(transFormedLiving.startDate);
    setEndDate(transFormedLiving.endDate);

    setLivingSituation(transFormedLiving);
  }, []);

  const loadStatusCondition = async () => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected == true) {
      axios.get(`${i18n.locale}/api/v1/interface-data`).then((response) => {
        let livingConditionStatusLabels = response.data.result.livingConditionStatusLabels;

        let statusLabels = [];
        console.log(Object.keys(livingConditionStatusLabels));
        Object.keys(livingConditionStatusLabels).forEach((key) => {
          console.log(key);
          statusLabels.push({
            label: livingConditionStatusLabels[key],
            value: key,
          });
        });

        setStatusLabels(statusLabels);
        console.log(statusLabels);
        setLoading(false);
      });
    }
  };

  const loadTerritory = async () => {
    const status = await await Network.getNetworkStateAsync();
    if (status.isConnected === true) {
      axios.get(`${i18n.locale}/api/v1/territories?fields=all&ey=${Constants.manifest.extra.secretKey}`).then((res) => {
        loadStatusCondition();
        if (res.data.status === 'OK') {
          const fetchedDelegations = res.data.result.map((delegation) => {
            return {
              label: delegation.name,
              value: delegation.territoryId,
            };
          });
          //setLivingSituation(fetchedDelegations);
          setTerritories(fetchedDelegations);
        }
      });
    }
  };

  const onChangeStartDate = (event, selectedDate) => {
    setOpenStartDate(false);
    var newDate = new Date();
    newDate.setTime(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60 * 1000);
    selectedDate = newDate;

    let year = selectedDate.getUTCFullYear();
    let month =
      selectedDate.getUTCMonth() + 1 < 10 ? '0' + (selectedDate.getUTCMonth() + 1) : selectedDate.getUTCMonth() + 1;
    let day = selectedDate.getUTCDate() - 1;
    let dateString = year + '-' + month + '-' + day;

    console.log(selectedDate);
    console.log(dateString);

    setStartDate(dateString);
  };

  const onChangeEndDate = (event, selectedDate) => {
    setOpenEndDate(false);
    var newDate = new Date();
    newDate.setTime(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60 * 1000);
    selectedDate = newDate;
    let year = selectedDate.getUTCFullYear();
    let month =
      selectedDate.getUTCMonth() + 1 < 10 ? '0' + (selectedDate.getUTCMonth() + 1) : selectedDate.getUTCMonth() + 1;
    let day = selectedDate.getUTCDate();
    let dateString = year + '-' + month + '-' + day;

    console.log(selectedDate);
    console.log(dateString);

    setEndDate(dateString);
  };

  const onChangeTerritory = (item) => {
    //set;
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
          {!loading ? (
            <ScrollView>
              {isCreate ? (
                <Text style={styles.title}>{i18n.t('LIVING_SITUATION.EDIT_TITLE')}</Text>
              ) : (
                <Text style={styles.title}>{i18n.t('LIVING_SITUATION.CREATE_TITLE')}</Text>
              )}

              <Formik
                enableReinitialize
                initialValues={{
                  responsibleTerritoryName: livingSituation && {
                    label: livingSituation.responsibleTerritoryName,
                    value: livingSituation.responsibleTerritoryId,
                  },
                  startDate: startDate,
                  endDate: endDate,
                  status: { label: livingSituation.status, value: livingSituation.status },
                  publicNotes: livingSituation && livingSituation.publicNotes,
                  adminNotes: '',
                }}
                //validate={values}

                onSubmit={(values) => {
                  let transformValues = {
                    ...values,
                    responsibleTerritory: values.responsibleTerritoryName && values.responsibleTerritoryName.value,
                    status: values.status.value ? values.status.value : values.status,
                  };

                  console.log('values', values);

                  console.log(transformValues);
                  if (transformValues.endDate) {
                    if (transformValues.endDate > transformValues.startDate) {
                      axios
                        .put(
                          `${i18n.locale}/api/v1/living-situations/${livingSituation.livingSituationId}`,
                          transformValues,
                        )
                        .then(
                          (response) => {
                            console.log('edicion');

                            //this.setState(this.setState({ snackMsg: i18n.t('GENERAL.EDIT_SUCCESS'), visible: true}));
                          },
                          (err) => {
                            //this.setState(this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false }));
                          },
                        );
                    } else {
                      console.log('error');
                    }
                  } else {
                    axios
                      .put(
                        `${i18n.locale}/api/v1/living-situations/${livingSituation.livingSituationId}`,
                        transformValues,
                      )
                      .then(
                        (response) => {
                          console.log('edicion');
                          //this.loadPerson();
                          //this.setState(this.setState({ snackMsg: i18n.t('GENERAL.EDIT_SUCCESS'), visible: true}));
                        },
                        (err) => {
                          //this.setState(this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false }));
                        },
                      );
                  }
                }}
              >
                {({ handleChange, values, handleSubmit, errors }) => (
                  <>
                    <View>
                      {openStartDate && (
                        <DateTimePicker
                          value={startDate ? new Date(startDate) : new Date()}
                          mode={'date'}
                          //is24Hour={true}
                          display="default"
                          onChange={onChangeStartDate}
                        />
                      )}
                      {openEndDate && (
                        <DateTimePicker
                          value={endDate ? new Date(endDate) : new Date()}
                          mode={'date'}
                          //is24Hour={true}
                          display="default"
                          onChange={onChangeEndDate}
                        />
                      )}
                      <Text style={styles.label}>{i18n.t('LIVING_SITUATION.RESPONSIBLE_TERRITORY')}</Text>
                      <RNPickerSelect
                        name="responsibleTerritoryName"
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
                        value={_.get(values, 'responsibleTerritoryName').value || ''}
                        items={territories}
                        Icon={() => {
                          return <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />;
                        }}
                      />
                    </View>

                    <View style={styles.itemContainer}>
                      <Text style={styles.label}>{i18n.t('LIVING_SITUATION.STATUS')}</Text>
                      <RNPickerSelect
                        name="status"
                        style={{
                          inputAndroid: {
                            backgroundColor: Colors.surfaceColorSecondary,
                          },
                          iconContainer: {
                            top: 10,
                            right: 15,
                          },
                        }}
                        onValueChange={handleChange('status')}
                        items={statusLabels}
                        Icon={() => {
                          return <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />;
                        }}
                      />
                    </View>
                    <View>
                      <Text style={styles.label}>{i18n.t('LIVING_SITUATION.START_DATE')}</Text>
                      <TouchableOpacity onPress={() => setOpenStartDate(true)}>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputDatePicker}>{startDate}</Text>
                          <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <Text style={styles.label}>{i18n.t('LIVING_SITUATION.END_DATE')}</Text>
                      <TouchableOpacity onPress={() => setOpenEndDate(true)}>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputDatePicker}>{endDate}</Text>
                          <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View>
                      <Text style={styles.label}>{i18n.t('LIVING_SITUATION.PUBLIC_NOTES')}</Text>
                      <TextInput
                        name="publicNotes"
                        onChangeText={handleChange('publicNotes')}
                        style={styles.inputContainer}
                      />
                    </View>

                    <View>
                      <Text style={styles.label}>{i18n.t('LIVING_SITUATION.ADMIN_NOTES')}</Text>
                      <TextInput
                        name="adminNotes"
                        onChangeText={handleChange('adminNotes')}
                        style={styles.inputContainer}
                      />
                    </View>

                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity style={{ flex: 1 }}>
                        <View style={styles.btnContainerSecondary}>
                          <Text style={styles.btnTextSecondary}>{i18n.t('LIVING_SITUATION.ADD')}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleSubmit} style={{ flex: 1 }}>
                        <View style={styles.btnContainerPrimary}>
                          <Text style={styles.btnTextPrimary}>{i18n.t('LIVING_SITUATION.SAVE')}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </ScrollView>
          ) : (
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

LivingSituationsFormScreen.navigationOptions = () => ({
  headerTitle: '',
});

export default LivingSituationsFormScreen;
