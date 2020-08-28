import React from 'react';
import { View, Picker, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceColorSecondary,
    borderRadius: 5,
    marginVertical: 5,
    padding: 0,
  },
});

const Select = ({
  value, elements, valueChange, style,
}) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      <Picker selectedValue={value} onValueChange={(itemValue) => valueChange(itemValue)}>
        {elements.map((el) => {
          return <Picker.Item color={Colors.onSurfaceColorPrimary} label={el.name} value={el.value} />;
        })}
      </Picker>
    </View>
  );
};

export default Select;
