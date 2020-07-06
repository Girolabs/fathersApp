import React, { Fragment } from 'react';
import {
  TextInput, Text, View, StyleSheet,
} from 'react-native';
import { connect } from 'formik';
import * as _ from 'lodash';
import { pathHasError } from '../utils/form-utils';
import Colors from '../constants/Colors';

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
  name, label, formik, hasPerm, ...props
}) => {
  const value = _.get(formik.values, name) || '';
  const error = pathHasError(name, formik.touched, formik.errors);
  const onChangeText = formik.handleChange(name);
  const id = name;
  const innerProps = {
    id,
    name,
    value,
    onChangeText,
  };
  const textFieldProps = { ...innerProps };

  return (
    <>
      {hasPerm
        ? (
          <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput {...textFieldProps} />
          </View>
        )
        : null}
    </>
  );
};

export default connect(InputWithFormik);
