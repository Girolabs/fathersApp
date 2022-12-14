import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Platform, Image, Pressable } from 'react-native';
import * as Network from 'expo-network';
import SnackBar from '../components/SnackBar';
import { Checkbox } from 'react-native-paper';
import Colors from '../constants/Colors';
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

const BulletinItem = ({ navigation, item, postToUpdate }) => {
  const [checked, setChecked] = useState(false);
  return (
    <View style={styles.listItem}>
      <View
        style={{
          height: 'auto',
          //borderRadius: 50,
          borderWidth: Platform.OS === 'ios' ? 1 : 0,
          width: 20,
          height: 20,
          borderColor: '#A4A2A2',
          justifyContent: 'center',
          alignItems: 'center',
          //backgroundColor: Platform.OS == 'android' ? 'black' : 'white',
        }}
      >
        <Checkbox
          color="#0104AC"
          key={item.postId}
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked);
            postToUpdate();
          }}
        />
        {
          <Pressable
            style={{
              position: 'absolute',
            }}
            onPress={() => {
              setChecked(!checked);
              postToUpdate();
            }}
          ></Pressable>
        }
      </View>

      <View style={styles.leftSideListItem}>
        <Text numberOfLines={2} style={item.isSeen ? styles.listItemTitleSeen : styles.listItemTitle}>
          {item.title /*+ ' ' + checked*/}
        </Text>
      </View>
    </View>
  );
};

export default BulletinItem;
