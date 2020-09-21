import React from 'react';
import { ActionSheetIOS, Text, View, Picker, StyleSheet, Platform, Button } from 'react-native';

import Colors from '../constants/Colors';
import { result } from 'lodash';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceColorSecondary,
    borderRadius: 5,
    marginVertical: 5,
    padding: 0,
  },
});

const Select = ({ value, elements, valueChange, style }) => {
  const [result, setResult] = React.useState(elements[0].name);
  const [options, setOption] = React.useState([]);

  React.useEffect(() => {
    const options = [];
    elements.forEach((e) => {
      options.push(e.name);
      if (value === e.value) setResult(e.name);
    });
    setOption(options);
  }, []);
  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: options,
      },
      (buttonIndex) => {
        valueChange(elements[buttonIndex].value);
        setResult(elements[buttonIndex].name);
      },
    );
  return (
    <View style={{ ...styles.container, ...style }}>
      {Platform.OS === 'android' ? (
        <Picker selectedValue={value} onValueChange={(itemValue) => valueChange(itemValue)}>
          {elements.map((el) => {
            return <Picker.Item color={Colors.onSurfaceColorPrimary} label={el.name} value={el.value} />;
          })}
        </Picker>
      ) : (
        <Button color={Colors.onSurfaceColorPrimary} onPress={onPress} title={result} />
      )}
    </View>
  );
};

export default Select;
