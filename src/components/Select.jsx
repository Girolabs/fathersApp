import React from 'react';
import { ActionSheetIOS, Text, View, Platform, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
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
        <TouchableOpacity
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          onPress={onPress}
        >
          <Button color={itemColor || Colors.onSurfaceColorPrimary} title={result} onPress={onPress} />
          {/* <Text style={{fontSize:16}} color={itemColor || Colors.onSurfaceColorPrimary} title={result} >{result}</Text> */}
          <Ionicons name="md-arrow-dropdown" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Select;
