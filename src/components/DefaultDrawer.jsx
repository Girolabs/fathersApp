import React from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  View,
  Platform,
  TouchableNativeFeedback,
} from 'react-native';
import i18n from 'i18n-js';
import { DrawerItems, DrawerItem } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const DefaultDrawer = (props) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }
  console.log('DefaultDrawer: Rendering');
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <TouchableOpacity
          style={{ margin: 15, padding: 15 }}
          onPress={() => {
            props.navigation.toggleDrawer();
          }}
        >
          <Ionicons name="md-close" size={36} color={Colors.surfaceColorPrimary} />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            height: '100%',
            padding: 15,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
            <Image source={require('../../assets/img/icono.png')} style={{ width: 88, height: 88 }} />
            <Text
              numberOfLines={2}
              style={{
                width: '70%',
                fontSize: 18,
                fontFamily: 'work-sans',
                color: 'white',
                paddingHorizontal: 15,
              }}
            >
              {i18n.t('GENERAL.FATHERS')}
            </Text>
          </View>

          <DrawerItems {...props} />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DefaultDrawer;
