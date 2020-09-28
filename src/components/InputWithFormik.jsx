import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'formik';
import * as _ from 'lodash';
import { TextInput } from 'react-native-paper';
import { pathHasError } from '../utils/form-utils';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  label: {
    fontFamily: 'work-sans-semibold',
    fontSize: 18,
    color: Colors.primaryColor,
  },
  container: {
    padding: 15,
  },
});

const InputWithFormik = ({
  name,
  label,
  formik,
  hasPerm,
  placeholder,
  mode,
  underlineColor,
  onFocus,
  onBlur,
  keyboardType,
  numberOfLines,
  multiline,
  ...props
}) => {
  const value = _.get(formik.values, name) || '';
  const error = pathHasError(name, formik.errors);

  console.log('error', error);
  const onChangeText = formik.handleChange(name);
  const id = name;
  const innerProps = {
    id,
    name,
    value,
    onChangeText,
    placeholder,
    mode,
    underlineColor,
    keyboardType,
    numberOfLines,
    multiline,
  };
  const textFieldProps = { ...innerProps };

  return (
    <>
      {hasPerm ? (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TextInput onFocus={onFocus} onBlur={onBlur} {...textFieldProps} error={error} />
        </View>
      ) : null}
    </>
  );
};

export default connect(InputWithFormik);
