import React from 'react';
import { Snackbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  style: {
    backgroundColor: Colors.onSurfaceColorPrimary,
  },
});

const SnackBar = (props) => {
  return (
    <Snackbar {...props} style={styles.style}>
      {props.children}
    </Snackbar>
  );
};
export default SnackBar;
