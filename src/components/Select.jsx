import React from 'react';
import { ActionSheetIOS, Text, View, Picker, StyleSheet, Platform, Button } from 'react-native';

import { result } from 'lodash';
import Colors from '../constants/Colors';

const Select = ({ value, elements, valueChange, style, containerStyle, itemColor }) => {
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
        options,
      },
      (buttonIndex) => {
        valueChange(elements[buttonIndex].value);
        setResult(elements[buttonIndex].name);
      },
    );
  return (
    <View style={{ ...containerStyle, ...style }}>
      {Platform.OS === 'android' ? (
        <Picker selectedValue={value} onValueChange={(itemValue) => valueChange(itemValue)}>
          {elements.map((el) => {
            return <Picker.Item color={Colors.onSurfaceColorPrimary} label={el.name} value={el.value} />;
          })}
        </Picker>
      ) : (
        <Button color={itemColor || Colors.onSurfaceColorPrimary} onPress={onPress} title={result} />
      )}
    </View>
  );
};

export default Select;
