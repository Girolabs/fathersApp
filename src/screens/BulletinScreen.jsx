import React, { useEffect, useState, useContext } from 'react';
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
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { NavigationEvents } from 'react-navigation';
import * as ScreenOrientation from 'expo-screen-orientation';
import SnackBar from '../components/SnackBar';
import Colors from '../constants/Colors';
import HeaderButton from '../components/HeaderButton';
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

  const loadPosts = async () => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      getBoard()
        .then((res) => {
          const fetchedPosts = res.data.result;
          const notArchived = fetchedPosts.filter((res) => !res.isArchived);
          setPosts(notArchived);
          console.log('posts', res.data.result);
          markCheckUnseenCounter();
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

  const handleRedirect = (item) => {
    if (item.redirectUrl && item.isRedirectUrlExternal) {
      Linking.openURL(item.redirectUrl);
    } else if (item.redirectUrl && !item.isRedirectUrlExternal) {
      navigation.navigate('BulletinDetail', {
        url: item.redirectUrl,
        postId: item.postId,
      });
    } else {
      navigation.navigate('BulletinDetail', {
        postId: item.postId,
      });
    }
  };

  useEffect(() => {
    loadPosts();
    async function orientationBack() {
      // Restric orientation PORTRAIT_UP screen
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
    return () => {
      checkOnly();
      orientationBack();
    };
  }, []);

  useEffect(() => {
    getBoard()
      .then((res) => {
        const fetchedPosts = res.data.result;
        const notArchived = fetchedPosts.filter((res) => !res.isArchived);
        setPosts(notArchived);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setVisible(true);
        setSnackMsg(i18n.t('GENERAL.ERROR'));
      });
  }, [posts]);

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.screen}>
      <NavigationEvents
        onDidFocus={async () => {
          // Unlock landscape orentation
          await ScreenOrientation.unlockAsync();
        }}
        onWillBlur={async (pay) => {
          // if the next navigation is not BulletinDetail, restric orientation to PortraitUp mode
          if (pay.state.routeName !== 'BulletinDetail') {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
          }
        }}
      />
      {!loading ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 20,
              marginHorizontal: 20,
            }}
          >
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.navigate('Archived');
              }}
            >
              <Text
                style={{
                  fontFamily: 'work-sans',
                  fontStyle: 'normal',
                  marginRight: 5,
                  fontSize: 15,
                  fontWeight: '400',
                  color: '#0104AC',
                }}
              >
                {i18n.t('ARCHIVE.ARCHIVED')}
              </Text>
              <Image source={archive} />
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate('Edit');
              }}
            >
              <Text
                style={{
                  fontFamily: 'work-sans',
                  fontStyle: 'normal',
                  fontSize: 15,
                  fontWeight: '400',
                  color: '#0104AC',
                }}
              >
                {i18n.t('ARCHIVE.EDIT')}
              </Text>
            </Pressable>
          </View>
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
      ) : (
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      )}
      <SnackBar visible={visible} onDismiss={() => setVisible(false)}>
        {snackMsg}
      </SnackBar>
    </View>
  );
};

BulletinScreen.navigationOptions = (navigationData) => ({
  headerTitle: '',
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="Menu"
        iconName="md-menu"
        onPress={() => {
          navigationData.navigation.toggleDrawer();
        }}
      />
    </HeaderButtons>
  ),
  headerBackTitle: i18n.t('GENERAL.BACK'),
});

export default BulletinScreen;
