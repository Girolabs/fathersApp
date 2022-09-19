import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from 'expo-vector-icons';
import { getBoard } from '../api';
import Colors from '../constants/Colors';
import i18n from 'i18n-js';
import * as Network from 'expo-network';
import SnackBar from '../components/SnackBar';
import { RadioButton } from 'react-native-paper';
import { Button } from 'react-native';
import { Pressable } from 'react-native';
import { ScrollView } from 'react-native';

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
    fontSize: 18,
    fontFamily: 'work-sans-semibold',
    color: Colors.primaryColor,
    paddingHorizontal: 15,
    width: '85%',
  },
  listItemTitleSeen: {
    fontSize: 18,
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

const ArchivedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [checked, setChecked] = useState(false);

  const loadPosts = async () => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      getBoard()
        .then((res) => {
          const fetchedPosts = res.data.result;
          console.log(fetchedPosts);
          setPosts(fetchedPosts);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setVisible(true);
          setSnackMsg(i18n.t('GENERAL.ERROR'));
        });
    } else {
      setVisible(true);
      setSnackMsg(i18n.t('GENERAL.NO_INTERNET'));
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  const handleRedirect = (item) => {
    if (item.redirectUrl && item.isRedirectUrlExternal) {
      Linking.openURL(item.redirectUrl);
    } else if (item.redirectUrl && !item.isRedirectUrlExternal) {
      navigation.navigate('BulletinDetail', {
        url: item.redirectUrl,
      });
    } else {
      navigation.navigate('BulletinDetail', {
        postId: item.postId,
      });
    }
  };

  return (
    <ScrollView
      style={{
        backgroundColor: 'white',
      }}
    >
      {!loading ? (
        <View>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.postId.toString()}
            renderItem={({ item }) => (
              <TouchableComp
                onPress={() => {
                  handleRedirect(item);
                }}
              >
                <View style={styles.listItem}>
                  <View
                    style={{
                      marginRight: 5,
                    }}
                  >
                    <RadioButton
                      key={item.postId}
                      status={checked ? 'checked' : 'unchecked'}
                      onPress={() => setChecked(!checked)}
                    />
                  </View>
                  <View style={styles.leftSideListItem}>
                    <Ionicons
                      name={item.title === 'Links' ? 'md-link' : 'md-book'}
                      size={25}
                      color={Colors.primaryColor}
                    />
                    <Text numberOfLines={2} style={item.isSeen ? styles.listItemTitleSeen : styles.listItemTitle}>
                      {item.title}
                    </Text>
                    <Ionicons name="ios-arrow-forward" size={25} color={Colors.primaryColor} />
                  </View>
                </View>
              </TouchableComp>
            )}
          />
          <Pressable
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              margin: 45,
            }}
          >
            <Text
              style={{
                fontFamily: 'work-sans',
                fontStyle: 'normal',
                fontWeight: '700',
                fontSize: 14,
                textTransform: 'uppercase',
                color: 'rgba(0, 0, 0, 0.37)',
                letterSpacing: 1,
              }}
            >
              Desarchivar
            </Text>
          </Pressable>
        </View>
      ) : (
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      )}
      <SnackBar visible={visible} onDismiss={() => setVisible(false)}>
        {snackMsg}
      </SnackBar>
    </ScrollView>
  );
};

export default ArchivedScreen;
