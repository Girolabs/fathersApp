import React, { useEffect, useState, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Pressable
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import i18n from 'i18n-js';
// import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from 'expo-vector-icons';
import { Formik } from 'formik';
import * as Network from 'expo-network';
import * as _ from 'lodash';
import * as Yup from 'yup';
import { Snackbar } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Colors from '../constants/Colors';
import HeaderButton from '../components/HeaderButton';
import {
  getFiliations,
  getTerritories,
  getHouses,
  getInterfaceData,
  saveLivingSituation,
  updateLivingSituation,
} from '../api';
import Button from '../components/Button';
import SelectModal from '../components/SelectModal';
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

    justifyContent: 'center',
  },
  label: {
    fontFamily: 'work-sans-semibold',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
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
    marginTop: 10,
    marginBottom: 7,
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
  errorText: {
    color: Colors.primaryColor,
  },
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
});
const stylePicker = {
  inputAndroid: {
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 10,
    paddingVertical: 17,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 7,
    height: 50,
    color: 'black',
  },
  inputIOS: {
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 10,
    paddingVertical: 17,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 7,
  },
  iconContainer: {
    top: 20,
    right: 15,
  },
};
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
  const [filiations, setFiliations] = useState([]);
  const [houses, setHouses] = useState([]);
  const [personId, setPersonId] = useState(null);
  const [snackMsg, setSnackMsg] = useState('');
  const [visible, setVisible] = useState('');
  const [filiationMainHouses, setFiliationMainHouses] = useState([]);
  const [houseHasBeenSelectedFlag, setHouseHasBeenSelectedFlag] = useState(false); //It become true when the user manually select a house option
  const loadHouses = async () => {
    const status = await Network.getNetworkStateAsync();

    if (status.isConnected == true) {
      getHouses(false).then((response) => {
        const fetchedHouses = response.data.result.map((house) => {
          if (house.isActive == true) {
            return {
              label: house.name,
              value: house.houseId,
            };
          }
        });
        setHouses(fetchedHouses);
      });
    }
  };

  const loadStatusCondition = async () => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected == true) {
      getInterfaceData().then((response) => {
        const { livingConditionStatusLabels } = response.data.result;
        console.log('get interface data ', response.data.result);
        setFiliationMainHouses(response.data.result.filiationMainHouses);
        const statusLabels = [];
        Object.keys(livingConditionStatusLabels).forEach((key) => {
          console.log(key);
          statusLabels.push({
            label: livingConditionStatusLabels[key],
            value: key,
          });
        });
        setStatusLabels(statusLabels);
        //GET FILIAITIONS DATA
        const fetchedFiliations = response.data.result.filiationOptions
          .sort((a, b) => {
            return a.sort - b.sort;
          })
          .map((filiation) => {
            return {
              label: filiation.label,
              value: filiation.id,
            };
          });
        setFiliations(fetchedFiliations);
        //GET HOUSE DATA
        const fetchedHouses = response.data.result.houseOptions
          .sort((a, b) => {
            return a.sort - b.sort;
          })
          .map((house) => {
            return {
              label: house.label,
              value: house.id,
            };
          });
        setHouses(fetchedHouses);
        setLoading(false);
      });
    }
  };

  const loadFiliations = async () => {
    const status = await Network.getNetworkStateAsync();

    if (status.isConnected == true) {
      getFiliations(false).then((response) => {
        const fetchedFiliations = response.data.result
          .map((filiation) => {
            if (filiation.isActive == true) {
              return {
                label: filiation.name,
                value: filiation.filiationId,
              };
            }
          })
          .filter((el) => el != undefined);
        setFiliations(fetchedFiliations);
      });
    }
  };

  const loadTerritory = async () => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected === true) {
      getTerritories(false).then((res) => {
        loadStatusCondition();
        if (res.data.status === 'OK') {
          const fetchedDelegations = res.data.result
            .map((delegation) => {
              return {
                label: delegation.name,
                value: delegation.territoryId,
              };
            })
            .filter((el) => el != undefined);
          setTerritories(fetchedDelegations);
        }
      });
    }
  };

  const formatDate = (selectedDate) => {
    // const newDate = new Date();
    // newDate.setTime(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60 * 1000);
    // selectedDate = newDate;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1 < 10 ? `0${selectedDate.getMonth() + 1}` : selectedDate.getMonth() + 1;
    let day = selectedDate.getDate();
    if (10 - day > 0) {
      day = `0${day}`;
    }
    const dateString = `${year}-${month}-${day}`;
    console.log(dateString);
    return dateString;
  };

  const editLivingSituation = (livingSituationId, values) => {
    updateLivingSituation(livingSituationId, values).then(
      () => {
        console.log('editLivingSituation = > ', values);
        setSnackMsg(i18n.t('GENERAL.EDIT_SUCCESS'));
        setVisible(true);
        navigation.replace('PatreDetail', {
          fatherId: values.personId,
          updated: true,
        });
      },
      (error) => {
        setSnackMsg(i18n.t('GENERAL.ERROR'));
        //console.log(error.response.data)
        setVisible(true);
      },
    );
  };

  const createLivingSituation = (values) => {
    saveLivingSituation(values).then(
      () => {
        setSnackMsg(i18n.t('GENERAL.CREATE_SUCCESS'));
        console.log('createLivingSituation = > ', values);
        setVisible(true);
        navigation.replace('PatreDetail', {
          fatherId: values.personId,
          updated: true,
        });
      },
      () => {
        setSnackMsg(i18n.t('GENERAL.ERROR'));
        setVisible(true);
      },
    );
  };
  useEffect(() => {
    //This use effect is use to update the initial value  status label to livingsituation
    //so can be used it as a initial value on the form
    if (livingSituation && statusLabels) {
      const statusLab = statusLabels.find((e) => e.value === livingSituation.status);
      const transFormedLiving = {
        ...livingSituation,
        statusLabel: statusLab && statusLab.label,
      };
      setLivingSituation(transFormedLiving);
      console.log('livingSituation  ', transFormedLiving);
    }
  }, [statusLabels]);

  useEffect(() => {
    const livingSituation = navigation.getParam('livingSituation');
    const paramPersonId = navigation.getParam('personId');
    if (!paramPersonId) {
      navigation.goBack();
    }
    // loadFiliations();
    // loadHouses();
    if (!livingSituation) {
      setIsCreate(true);
    } else {
      const transFormedLiving = {
        ...livingSituation,
        startDate: livingSituation && livingSituation.startDate ? livingSituation.startDate.split('T')[0] : null,
        endDate: livingSituation && livingSituation.endDate ? livingSituation.endDate.split('T')[0] : null,
      };
      setLivingSituation(transFormedLiving);
      console.log(' setLivingSituation ', transFormedLiving);
    }
    loadTerritory();
    setPersonId(paramPersonId);
  }, []);

  return (
    <>
      <NavigationEvents
        onDidFocus={() => {
          console.log('onDidFocus');
        }}
      />
      <KeyboardAvoidingView style={{ flex: 1, paddingHorizontal: 15 }}>
        <SafeAreaView style={styles.screen}>
          {!loading ? (
            <ScrollView>
              {isCreate ? (
                <Text style={styles.title}>{i18n.t('LIVING_SITUATION.CREATE_TITLE')}</Text>
              ) : (
                <Text style={styles.title}>{i18n.t('LIVING_SITUATION.EDIT_TITLE')}</Text>
              )}
              <Formik
                enableReinitialize
                initialValues={{
                  responsibleTerritoryId: livingSituation && livingSituation.responsibleTerritoryId,
                  startDate: livingSituation && livingSituation.startDate,
                  endDate: livingSituation && livingSituation.endDate,
                  status: livingSituation.status,
                  statusLabel: livingSituation.status && livingSituation.statusLabel,
                  publicNotes: livingSituation && livingSituation.publicNotes ? livingSituation.publicNotes : null,
                  adminNotes: '',
                  filiationId: livingSituation && livingSituation.filiationId,
                  houseId: livingSituation && livingSituation.houseId,
                  filiationName: livingSituation && livingSituation.filiationName,
                  houseName: livingSituation && livingSituation.houseName,
                  responsibleTerritoryName: livingSituation && livingSituation.responsibleTerritoryName,
                }}
                validationSchema={Yup.object().shape({
                  startDate: Yup.date(),
                  endDate: Yup.date()
                    .nullable(true)
                    .min(Yup.ref('startDate'), i18n.t('LIVING_SITUATION.ERROR_END_DATE')),
                })}
                onSubmit={(values) => {
                  const transformValues = {
                    ...values,
                    status: values.status.value ? values.status.value : values.status,
                    personId,
                  };
                  if (isCreate) {
                    createLivingSituation(transformValues);
                  } else {
                    editLivingSituation(livingSituation.livingSituationId, transformValues);
                  }

                  console.log('values', values);

                  console.log(transformValues);
                }}
              >
                {({ handleChange, values, handleSubmit, errors, setFieldValue }) => (
                  <>
                    <View>
                      <DateTimePickerModal
                        isVisible={openStartDate}
                        mode="date"
                        onConfirm={(date) => {
                          setOpenStartDate(false);
                          const dateFormated = formatDate(date);
                          setFieldValue('startDate', dateFormated);
                        }}
                        onCancel={() => setOpenStartDate(false)}
                      />
                      <DateTimePickerModal
                        isVisible={openEndDate}
                        mode="date"
                        onConfirm={(date) => {
                          setOpenEndDate(false);
                          const dateFormated = formatDate(date);
                          setFieldValue('endDate', dateFormated);
                        }}
                        onCancel={() => setOpenEndDate(false)}
                      />

                      <Text style={styles.label}>{i18n.t('LIVING_SITUATION.FILIATION')}</Text>
                      {/* <RNPickerSelect
                        name="filiationId"
                        useNativeAndroidPickerStyle={false}
                        style={stylePicker}
                        disabled={!isCreate}
                        onValueChange={(e) => setFieldValue('filiationId', e)}
                        value={_.get(values, 'filiationId') || ''}
                        items={filiations}
                        Icon={() => {
                          const icon = isCreate ? (
                            <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />
                          ) : null;
                          return icon;
                        }}
                      /> */}
                      <SelectModal
                        name="filiation"
                        data={filiations}
                        initValue={_.get(values, 'filiationName') || ''}
                        onChange={(option) => {
                          setFieldValue('filiationId', option.value);
                          setFieldValue('filiationName', option.label);
                          if (!houseHasBeenSelectedFlag && isCreate) {
                            //Automaticly fill the house input with the  mainhouse of the fillation, if the house has not yet been chosen
                            const houseId = filiationMainHouses[option.value];
                            const house = houses.find((e) => houseId === e.value);
                            console.log('autofill house', house);
                            if (house) {
                              setFieldValue('houseId', houseId);
                              setFieldValue('houseName', house.label);
                            } else {
                              setFieldValue('houseId', '');
                              setFieldValue('houseName', '');
                            }
                          }
                        }}
                        value={_.get(values, 'filiationName')}
                        arrowDropDown={isCreate}
                        disabled={!isCreate}
                      />

                      <Text style={styles.label}>{i18n.t('LIVING_SITUATION.HOUSE')}</Text>
                      {/* <RNPickerSelect
                        name="houseId"
                        useNativeAndroidPickerStyle={false}
                        style={stylePicker}
                        onValueChange={(e) => setFieldValue('houseId', e)}
                        value={_.get(values, 'houseId') || ''}
                        items={houses}
                        disabled={!isCreate}
                        Icon={() => {
                          const icon = isCreate ? (
                            <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />
                          ) : null;
                          return icon;
                        }}
                      /> */}
                      <SelectModal
                        name="houseId"
                        data={houses}
                        initValue={_.get(values, 'houseName') || ''}
                        onChange={(option) => {
                          setFieldValue('houseId', option.value);
                          setFieldValue('houseName', option.label);
                        }}
                        value={_.get(values, 'houseName')}
                        arrowDropDown={isCreate}
                        disabled={!isCreate}
                        onModalClose={(e) => {
                          if (e.label && !houseHasBeenSelectedFlag) setHouseHasBeenSelectedFlag(true);
                        }}
                      />
                      <Text style={styles.label}>{i18n.t('LIVING_SITUATION.RESPONSIBLE_TERRITORY')}</Text>
                      {/* <RNPickerSelect
                      responsibleTerritoryName
                        name="responsibleTerritoryId"
                        useNativeAndroidPickerStyle={false}
                        style={stylePicker}
                        onValueChange={(e) => setFieldValue('responsibleTerritoryId', e)}
                        value={_.get(values, 'responsibleTerritoryId') || ''}
                        items={territories}
                        Icon={() => {
                          return <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />;
                        }}
                      /> */}
                      <SelectModal
                        name="responsibleTerritoryId"
                        data={territories}
                        initValue={_.get(values, 'responsibleTerritoryName') || ''}
                        onChange={(option) => {
                          setFieldValue('responsibleTerritoryId', option.value);
                          setFieldValue('responsibleTerritoryName', option.label);
                        }}
                        value={_.get(values, 'responsibleTerritoryName')}
                        arrowDropDown={isCreate}
                        disabled={!isCreate}
                      />
                    </View>

                    <View style={styles.itemContainer}>
                      <Text style={styles.label}>{i18n.t('LIVING_SITUATION.STATUS')}</Text>
                      {/* <RNPickerSelect
                        name="status"
                        useNativeAndroidPickerStyle={false}
                        style={stylePicker}
                        onValueChange={(e) => setFieldValue('status', e)}
                        value={_.get(values, 'status') || ''}
                        items={statusLabels}
                        Icon={() => {
                          return <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />;
                        }}
                      /> */}
                      <SelectModal
                        name="status"
                        data={statusLabels}
                        initValue={_.get(values, 'statusLabel') || ''}
                        onChange={(option) => {
                          setFieldValue('status', option.value), setFieldValue('statusLabel', option.label);
                        }}
                        value={_.get(values, 'statusLabel')}
                        arrowDropDown={isCreate}
                        disabled={!isCreate}
                      />
                    </View>
                    <View>
                      <Text style={styles.label}>{i18n.t('LIVING_SITUATION.START_DATE')}</Text>
                        <Pressable
                            style={{
                                position: 'absolute',
                                left: '58%',
                                flexDirection: 'row',
                                backgroundColor: Colors.primaryColor,
                                padding: 3,
                                borderRadius: 5,
                                marginTop:10
                            }}
                            onPress={() => {
                                setFieldValue('startDate', null);
                            }}
                        >
                        <Text
                            style={{
                            color: 'white',
                            }}
                        >
                            {i18n.t('ASSIGNMENTS_FORM.MARK_NULL')}
                        </Text>
                        </Pressable>
                      <Button onPress={() => setOpenStartDate(true)}>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputDatePicker}>{_.get(values, 'startDate') || ''}</Text>
                          <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
                        </View>
                      </Button>
                    </View>
                    <View>
                      <Text style={styles.label}>{i18n.t('LIVING_SITUATION.END_DATE')}</Text>
                        <Pressable
                            style={{
                                position: 'absolute',
                                left: '58%',
                                flexDirection: 'row',
                                padding: 3,
                                backgroundColor: Colors.primaryColor,
                                borderRadius: 5,
                                marginTop:10
                            }}
                            onPress={() => {
                                setFieldValue('endDate', null);
                            }}
                            >
                            <Text
                                style={{
                                color: 'white',
                                }}
                            >
                                {i18n.t('ASSIGNMENTS_FORM.MARK_NULL')}
                            </Text>
                            </Pressable>
                      <Button onPress={() => setOpenEndDate(true)}>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputDatePicker}>{_.get(values, 'endDate') || ''}</Text>
                          <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
                        </View>
                      </Button>
                      {errors && errors.endDate && (
                        <Text style={styles.errorText}>{i18n.t('LIVING_SITUATION.ERROR_END_DATE')}</Text>
                      )}
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
                      <Button
                        onPress={() => {
                          handleSubmit();
                        }}
                        style={{ flex: 1 }}
                      >
                        <View style={styles.btnContainerPrimary}>
                          <Text style={styles.btnTextPrimary}>{i18n.t('LIVING_SITUATION.SAVE')}</Text>
                        </View>
                      </Button>
                    </View>
                  </>
                )}
              </Formik>
            </ScrollView>
          ) : (
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          )}
          <Snackbar visible={visible} onDismiss={() => setVisible(false)} style={styles.snackError}>
            {snackMsg}
          </Snackbar>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

LivingSituationsFormScreen.navigationOptions = (navigationData) => ({
  headerTitle: '',
  headerRight: () => (
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
  headerBackTitle: i18n.t('GENERAL.BACK'),
});

export default LivingSituationsFormScreen;
