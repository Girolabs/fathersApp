import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Switch } from 'react-native-paper';
import * as _ from 'lodash';
import { connect } from 'formik';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  label: {
    fontFamily: 'work-sans-semibold',
    fontSize: 18,
    color: Colors.primaryColor,
  },
  container: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const SwitchWithFormik = ({ name, label, formik, hasPerm, color }) => {
  const value = _.get(formik.values, name) || false;
  const id = name;
  const switchProps = {
    id,
    name,
    value,
    color,
  };

  return (
    <>
      {hasPerm ? (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <Switch onValueChange={(value) => formik.setFieldValue(name, value)} {...switchProps} />
        </View>
      ) : null}
    </>
  );
};

export default connect(SwitchWithFormik);
