import React from 'react';

import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from 'expo-vector-icons';
import Colors from '../constants/Colors';

const CustomHeaderButton = (props) => (
  <HeaderButton
    {...props}
    style={{ marginLeft: 10 }}
    IconComponent={Ionicons}
    iconSize={25}
    color={Colors.primaryColor}
  />
);

export default CustomHeaderButton;
