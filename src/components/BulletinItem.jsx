import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Image,
  Pressable,
} from 'react-native';
import * as Network from 'expo-network';
import SnackBar from '../components/SnackBar';
import { RadioButton } from 'react-native-paper';
import { getBoard } from '../api';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import { Ionicons } from 'expo-vector-icons';
import check from '../../assets/checked.png';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    backgroundColor: Colors.surfaceColorPrimary,
  },
  listItem: {
    backgroundColor: Colors.surfaceColorSecondary,
    borderBottomColor: Colors.surfaceColorPrimary,
    borderBottomWidth: 2,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemTitle: {
    fontSize: 16,
    fontFamily: 'work-sans-semibold',
    color: Colors.primaryColor,
    paddingHorizontal: 15,
    width: '85%',
  },
  listItemTitleSeen: {
    fontSize: 16,
    fontFamily: 'work-sans',
    color: Colors.primaryColor,
    paddingHorizontal: 15,
    width: '85%',
  },
  leftSideListItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const BulletinItem = ({ navigation, item }) => {
  const [checked, setChecked] = useState(false);
  return (
    <View style={styles.listItem}>
      <View>
        <RadioButton
          color="white"
          key={item.postId}
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => setChecked(!checked)}
        />
        {
          <Pressable onPress={() => setChecked(!checked)}>
            <Image
              style={{
                position: 'absolute',
                left: 8,
                bottom: 8,
              }}
              source={checked ? check : null}
            />
          </Pressable>
        }
      </View>

      <View style={styles.leftSideListItem}>
        <Text numberOfLines={2} style={item.isSeen ? styles.listItemTitleSeen : styles.listItemTitle}>
          {item.title}
        </Text>
      </View>
    </View>
  );
};

export default BulletinItem;
