import React, { Fragment } from 'react';
import { TextInput, Text,View } from 'react-native';

const InputWithFormik = ({ name, label, ...props }) => {
    return (
        <View>
            <Text>{label}</Text>
            <TextInput   />
        </View>
    )
}

export default InputWithFormik;
