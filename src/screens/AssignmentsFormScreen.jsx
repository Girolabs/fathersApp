import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import InputWithFormik from '../components/InputWithFormik';

import * as Network from 'expo-network';
import i18n from 'i18n-js';
import SnackBar from '../components/SnackBar';
import Colors from '../constants/Colors';

import {
  assigmentsUserPermissions,
  createAssignment,
  deleteAssignment,
  errorHandler,
  getAssignments,
  getPersons,
  saveAssignment,
  updateAssignment,
} from '../api';
import Button from '../components/Button';
import SwitchWithFormik from '../components/SwitchWithFormik';
import Select from '../components/Select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as _ from 'lodash';
import { Ionicons } from 'expo-vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import Input from '../components/Input';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

const toIsoString = (date) => {
  const pad = (num) => (num < 10 ? '0' : '') + num;

  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
};

const parseLocalDate = (dateString) => {
  if (!dateString) return new Date();

  const [year, month, day] = dateString.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day), 12);
};
const today = new Date();
const todayString = toIsoString(today);

const EditableDateItem = function (props) {
  const [show, setShow] = useState(false);

  return (
    <View
      style={{
        width: '90%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 7,
        backgroundColor: '#FFFFFF',
      }}
    >
      <Pressable
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => setShow(true)}
      >
        <Text
          style={{
            color: Colors.onSurfaceColorPrimary,
            fontSize: 16,
          }}
        >
          {props.date || 'Seleccionar fecha'}
        </Text>

        <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
      </Pressable>

      {show && (
        <DateTimePicker
          textColor="black"
          display={Platform.OS === 'android' ? 'default' : 'spinner'}
          value={parseLocalDate(props.date)}
          onChange={(event, val) => {
            if (Platform.OS === 'android') {
              setShow(false);
            }

            if (event.type === 'set' && val) {
              const safeDate = new Date(val.getFullYear(), val.getMonth(), val.getDate(), 12);

              const pickedDate = toIsoString(safeDate);
              props.onDateChange(pickedDate);
            }
          }}
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            zIndex: 10,
          }}
        />
      )}

      {Platform.OS === 'ios' && show && (
        <Pressable
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            padding: 8,
            backgroundColor: '#000000DE',
            borderRadius: 5,
            zIndex: 20,
          }}
          onPress={() => {
            setShow(false);
            props.onClose && props.onClose();
          }}
        >
          <Text style={{ color: 'white' }}>OK</Text>
        </Pressable>
      )}
    </View>
  );
};

const AssignmentsFormScreen = ({ navigation, route }) => {
  const rolesRep = route.params.roles;
  let hash = {};
  const _assignmentId = route.params.assignmentId;
  const entityRoles = rolesRep?.filter((o) => (hash[o.value] ? false : (hash[o.value] = true)));
  const entityId = route.params.entityId;
  const entityName = route.params.entityName;
  const fatherId = route.params.fatherId;
  const roleTitle = route.params.roleTitle;
  const roleId = route.params.roleId;
  const updated = route.params.isCreate;
  const personName = route.params.personName;
  const start = route.params.startDate;
  const end = route.params.endDate;
  const [role, setRole] = useState(roleId ? roleId : entityRoles[0]?.value);
  const [persons, setPersons] = useState(null);
  const [roles, setRoles] = useState(entityRoles ? entityRoles : null);
  const [person, setPerson] = useState(fatherId ? fatherId : null);
  const [startDate, setStartDate] = useState(start ? start : null);
  const [endDate, setEndDate] = useState(end ? end : null);
  const [isCreate, setIsCreate] = useState(updated);
  const [assignmentId, setAssignmentId] = useState(_assignmentId ? _assignmentId : null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState({});
  const [startDateNull, setStartDateNull] = useState(false);
  const [endDateNull, setEndDateNull] = useState(false);

  const windowHeight = useWindowDimensions().height;

  useEffect(() => {
    assigmentsUserPermissions().then((res) => setPermission(res.data.result));
    getPersons().then((res) => {
      const resData = res.data.result;
      const resDataFilter = resData.filter((p) => p.isActive === true);
      setPersons(
        resDataFilter.map((p) => ({
          id: p.personId,
          title: p.fullName,
        })),
      );
    });
  }, []);

  const validateForm = function (formValues) {
    const formatStartDate = startDate ? parseLocalDate(startDate) : null;
    const formatEndDate = endDate ? parseLocalDate(endDate) : null;
    let claves = Object.keys(formValues);
    for (let i = 0; i < claves.length; i++) {
      let clave = claves[i];
      if (role === null || person === null || entityId === null) {
        setError(i18n.t('ASSIGNMENTS_FORM.ERROR'));
        return false;
      } else if (formatStartDate && formatEndDate && formatStartDate >= formatEndDate) {
        setError(i18n.t('ASSIGNMENTS_FORM.ERROR_END_DATE'));
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = function () {
    const formValues = {
      roleId: role,
      personId: person,
      startDate: startDate,
      endDate: endDate,
    };
    const formValuesEdit = {
      startDate: startDate,
      endDate: endDate,
    };
    if (validateForm(formValues) && isCreate) {
      setLoading(true);
      console.log(formValues);
      saveAssignment(formValues).then(
        (res) => {
          setLoading(false);
          Alert.alert(i18n.t('ASSIGNMENTS_FORM.SUCCESS'));
          navigation.goBack();
        },
        (err) => {
          console.log(err.response.status);
          setLoading(false);
          errorHandler(err);
        },
      );
    } else if (validateForm(formValuesEdit) && !isCreate) {
      setLoading(true);
      updateAssignment(assignmentId, formValuesEdit).then(
        (res) => {
          setLoading(false);
          Alert.alert(i18n.t('ASSIGNMENTS_FORM.SUCCESS'));
          navigation.goBack();
        },
        (err) => {
          setLoading(false);
          errorHandler(err);
        },
      );
    }
  };

  const handleDelete = () => {
    Alert.alert(i18n.t('ASSIGNMENTS_FORM.DELETE_TITLE'), i18n.t('ASSIGNMENTS_FORM.DELETE_BODY'), [
      {
        text: 'Cancel',
        onPress: () => {
          console.log('Cancel Pressed');
        },
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          setLoading(true);
          deleteAssignment(assignmentId).then(
            (res) => {
              setLoading(false);
              Alert.alert(i18n.t('ASSIGNMENTS_FORM.SUCCESS'));
              navigation.goBack();
            },
            (err) => {
              setLoading(false);
              Alert.alert(err);
            },
          );
          console.log('OK Pressed');
        },
      },
    ]);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'position' : null}
      //keyboardVerticalOffset={150}
      style={{ flex: 1 }}
    >
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F2F3FF',
        }}
      >
        {loading ? (
          <View
            style={{
              flex: 1,
              padding: 15,
              backgroundColor: Colors.surfaceColorPrimary,
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator
              style={{
                height: windowHeight,
              }}
              size="large"
              color={Colors.primaryColor}
            />
          </View>
        ) : (
          <>
            <Text
              style={{
                fontFamily: 'work-sans-semibold',
                color: Colors.primaryColor,
                fontSize: 20,
                textAlign: 'left',
                letterSpacing: 2.5,
                //textTransform: 'uppercase',
                //margin: 10,
              }}
            >
              {entityName}
            </Text>
            {isCreate ? (
              <Text
                style={{
                  fontFamily: 'work-sans-semibold',
                  color: Colors.primaryColor,
                  fontSize: 20,
                  textAlign: 'left',
                  letterSpacing: 2.5,
                  //textTransform: 'uppercase',
                  //margin: 10,
                  padding: 20,
                }}
              >
                {i18n.t('ASSIGNMENTS_FORM.TITLE')}
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: 'work-sans-semibold',
                  color: Colors.primaryColor,
                  fontSize: 20,
                  textAlign: 'left',
                  letterSpacing: 2.5,
                  //textTransform: 'uppercase',
                  //margin: 10,
                  padding: 20,
                }}
              >
                {i18n.t('ASSIGNMENTS_FORM.TITLE_EDIT')}
              </Text>
            )}
            {
              <View
                style={{
                  width: '90%',
                }}
              >
                <Text
                  style={{
                    //color: Colors.onSurfaceColorSecondary,
                    //color: Colors.onSurfaceColorPrimary,
                    fontWeight: 'bold',
                    //textAlign: 'center',
                    fontFamily: 'work-sans-semibold',
                    color: Colors.primaryColor,
                  }}
                  required
                >
                  {i18n.t('ASSIGNMENTS_FORM.ROLE')}
                </Text>
                {isCreate ? (
                  <Select
                    style={{
                      backgroundColor: Colors.surfaceColorSecondary,
                      height: 50,
                      marginVertical: 10,
                      borderRadius: 5,
                      padding: Platform.OS === 'ios' ? 8 : 0,
                    }}
                    elements={roles}
                    value={role}
                    valueChange={(value) => setRole(value)}
                  />
                ) : (
                  <TextInput
                    style={{
                      height: 50,
                      marginVertical: 10,
                      borderRadius: 5,
                      backgroundColor: '#FFFFFF',
                    }}
                    theme={{ colors: { primary: '#0104AC', underlineColor: 'transparent' } }}
                    required
                    value={role}
                    autoCapitalize="none"
                    placeholderTextColor={Colors.onSurfaceColorSecondary}
                    placeholder={roleTitle}
                    onChangeText={(value) => setRole(value)}
                    disabled={true}
                  />
                )}
              </View>
            }
            {
              <View
                style={{
                  width: '90%',
                  zIndex: 12,
                }}
              >
                <Text
                  style={{
                    //color: Colors.onSurfaceColorSecondary,
                    //color: Colors.onSurfaceColorPrimary,
                    fontWeight: 'bold',
                    //textAlign: 'center',
                    fontFamily: 'work-sans-semibold',
                    color: Colors.primaryColor,
                  }}
                  required
                >
                  {i18n.t('ASSIGNMENTS_FORM.PERSON')}
                </Text>
                {isCreate ? (
                  <AutocompleteDropdown
                    key={person?.personId}
                    containerStyle={{ marginVertical: 10 }}
                    clearOnFocus={false}
                    closeOnSubmit={false}
                    //initialValue={{ id: person }}
                    onSelectItem={(item) => {
                      item && setPerson(item.id);
                    }}
                    dataSet={persons}
                  />
                ) : (
                  <TextInput
                    style={{
                      height: 50,
                      marginVertical: 10,
                      borderRadius: 5,
                      backgroundColor: '#FFFFFF',
                    }}
                    theme={{ colors: { primary: '#0104AC', underlineColor: 'transparent' } }}
                    required
                    value={person}
                    autoCapitalize="none"
                    placeholderTextColor={Colors.onSurfaceColorSecondary}
                    placeholder={personName}
                    onChangeText={(value) => setPerson(value)}
                    disabled={true}
                  />
                )}
              </View>
            }
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  //color: Colors.onSurfaceColorSecondary,
                  //color: Colors.onSurfaceColorPrimary,
                  fontWeight: 'bold',
                  //textAlign: 'center',
                  fontFamily: 'work-sans-semibold',
                  color: Colors.primaryColor,
                }}
              >
                {i18n.t('ASSIGNMENTS_FORM.START_DATE')}
              </Text>
              {startDate ? (
                <Pressable
                  style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.primaryColor,
                    padding: 3,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    setStartDate(null);
                    setStartDateNull(true);
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                    }}
                  >
                    {!startDate && startDateNull
                      ? i18n.t('ASSIGNMENTS_FORM.NULL')
                      : i18n.t('ASSIGNMENTS_FORM.MARK_NULL')}
                  </Text>
                </Pressable>
              ) : null}
              {!startDate ? (
                <Pressable
                  style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.primaryColor,
                    padding: 3,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    setStartDate(todayString);
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                    }}
                  >
                    {i18n.t('ASSIGNMENTS_FORM.MARK_TODAY')}
                  </Text>
                </Pressable>
              ) : null}
            </View>
            <EditableDateItem
              date={startDate}
              onDateChange={(value) => {
                setStartDate(value);
              }}
              onClose={() => (!startDate ? setStartDate(toIsoString(new Date())) : null)}
            />
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  //color: Colors.onSurfaceColorSecondary,
                  //color: Colors.onSurfaceColorPrimary,
                  fontWeight: 'bold',
                  //textAlign: 'center',
                  fontFamily: 'work-sans-semibold',
                  color: Colors.primaryColor,
                }}
              >
                {i18n.t('ASSIGNMENTS_FORM.END_DATE')}
              </Text>
              {endDate ? (
                <Pressable
                  style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.primaryColor,
                    padding: 3,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    setEndDate(null);
                    setEndDateNull(true);
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                    }}
                  >
                    {!endDate && endDateNull ? i18n.t('ASSIGNMENTS_FORM.NULL') : i18n.t('ASSIGNMENTS_FORM.MARK_NULL')}
                  </Text>
                </Pressable>
              ) : null}
              {!endDate ? (
                <Pressable
                  style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.primaryColor,
                    padding: 3,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    setEndDate(todayString);
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                    }}
                  >
                    {i18n.t('ASSIGNMENTS_FORM.MARK_TODAY')}
                  </Text>
                </Pressable>
              ) : null}
            </View>
            <EditableDateItem
              date={endDate}
              onDateChange={(value) => {
                setEndDate(value);
              }}
              onClose={() => (!endDate ? setEndDate(toIsoString(new Date())) : null)}
            />
            <Button
              onPress={handleSubmit}
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: 'white',
                  borderColor: Colors.primaryColor,
                  borderRadius: 5,
                  borderWidth: 2,
                  paddingHorizontal: 10,
                  width: '90%',
                  height: 50,
                  justifyContent: 'center',
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 12,
                    width: '100%',
                    fontFamily: 'work-sans-bold',
                    textTransform: 'uppercase',
                    color: Colors.primaryColor,
                  }}
                >
                  {i18n.t('ASSIGNMENTS_FORM.SAVE')}
                </Text>
              </View>
            </Button>
            {!isCreate && permission.userCanDeleteAssignments ? (
              <Button
                onPress={() => {
                  handleDelete();
                }}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'red',
                    borderRadius: 5,
                    borderWidth: 2,
                    paddingHorizontal: 10,
                    width: '90%',
                    height: 50,
                    justifyContent: 'center',
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 12,
                      width: '100%',
                      fontFamily: 'work-sans-bold',
                      textTransform: 'uppercase',
                      color: 'red',
                    }}
                  >
                    {i18n.t('ASSIGNMENTS_FORM.DELETE')}
                  </Text>
                </View>
              </Button>
            ) : null}

            {error && (
              <Text
                style={{
                  fontSize: 14,
                  width: '90%',
                  fontWeight: '600',
                  color: Colors.primaryColor,
                }}
              >
                {error}
              </Text>
            )}
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AssignmentsFormScreen;
