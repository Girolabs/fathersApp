import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  ActivityIndicator,
  Pressable,
  Image,
} from 'react-native';
import * as Network from 'expo-network';
import i18n from 'i18n-js';
import { Ionicons } from 'expo-vector-icons';
import * as Linking from 'expo-linking';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect } from '@react-navigation/native';
import SnackBar from '../components/SnackBar';
import Colors from '../constants/Colors';
import { getBoard } from '../api';
import { BulletinCheckContext } from '../context/BulletinCheckProvider';
import archive from '../../assets/archive.png';

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

const BulletinScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const { unseenPostsCount, markCheckUnseenCounter, checkOnly } = useContext(BulletinCheckContext);

  const loadPosts = useCallback(async () => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      try {
        const res = await getBoard();
        const fetchedPosts = res.data.result;
        const notArchived = fetchedPosts.filter((post) => !post.isArchived);
        const sortedPosts = notArchived.sort((a, b) => a.title.localeCompare(b.title));

        setPosts(sortedPosts);
        markCheckUnseenCounter();
      } catch (error) {
        setSnackMsg(i18n.t('GENERAL.ERROR'));
        setVisible(true);
      } finally {
        setLoading(false);
      }
    } else {
      setSnackMsg(i18n.t('GENERAL.NO_INTERNET'));
      setVisible(true);
      setLoading(false);
    }
  }, [markCheckUnseenCounter]);

  useEffect(() => {
    loadPosts();
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

    return () => {
      checkOnly();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.unlockAsync();
      return () => ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }, []),
  );

  const handleRedirect = (item) => {
    if (item.redirectUrl) {
      item.isRedirectUrlExternal
        ? Linking.openURL(item.redirectUrl)
        : navigation.navigate('BulletinDetail', { url: item.redirectUrl, postId: item.postId });
    } else {
      navigation.navigate('BulletinDetail', { postId: item.postId });
    }
  };

  const TouchableComp =
    Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

  return (
    <View style={styles.screen}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      ) : (
        <>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, marginHorizontal: 20 }}
          >
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => navigation.navigate('Archived')}
            >
              <Text
                style={{ fontFamily: 'work-sans', marginRight: 5, fontSize: 15, fontWeight: '400', color: '#0104AC' }}
              >
                {i18n.t('ARCHIVE.ARCHIVED')}
              </Text>
              <Image source={archive} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Edit')}>
              <Text style={{ fontFamily: 'work-sans', fontSize: 15, fontWeight: '400', color: '#0104AC' }}>
                {i18n.t('ARCHIVE.EDIT')}
              </Text>
            </Pressable>
          </View>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.postId.toString()}
            renderItem={({ item }) => (
              <TouchableComp onPress={() => handleRedirect(item)}>
                <View style={styles.listItem}>
                  <View style={styles.leftSideListItem}>
                    <Ionicons
                      name={item.title === 'Links' ? 'md-link' : 'md-book'}
                      size={25}
                      color={Colors.primaryColor}
                    />
                    <Text numberOfLines={2} style={item.isSeen ? styles.listItemTitleSeen : styles.listItemTitle}>
                      {item.title}
                    </Text>
                  </View>
                  <Ionicons name="ios-arrow-forward" size={25} color={Colors.primaryColor} />
                </View>
              </TouchableComp>
            )}
          />
        </>
      )}
      <SnackBar visible={visible} onDismiss={() => setVisible(false)}>
        {snackMsg}
      </SnackBar>
    </View>
  );
};

export default BulletinScreen;
