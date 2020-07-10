import React, { Fragment } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import { connect } from 'formik';
import * as _ from 'lodash';
import { pathHasError } from '../utils/form-utils';
import Colors from '../constants/Colors';
import { TextInput } from 'react-native-paper';

const styles = StyleSheet.create({
  label: {
    fontFamily: 'work-sans-semibold',
    fontSize: 18,
    color: Colors.onSurfaceColorPrimary,
  },
  container: {
    padding: 15,
    backgroundColor: Colors.surfaceColorSecondary,
  }
});

const InputWithFormik = ({
  name, label, formik, hasPerm, placeholder, ...props
}) => {
  const value = _.get(formik.values, name) || '';
  const error = pathHasError(name, formik.errors);
  
  console.log('error',error)
  const onChangeText = formik.handleChange(name);
  const id = name;
  const innerProps = {
    id,
    name,
    value,
    onChangeText,
    placeholder,
  };
  const textFieldProps = { ...innerProps };

  return (
    <>
      {hasPerm
        ? (
          <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput {...textFieldProps} error ={error} />
          </View>
        )
        : null}
    </>
  );
};

export default connect(InputWithFormik);
