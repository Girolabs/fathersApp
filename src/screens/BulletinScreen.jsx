import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Network from 'expo-network';
import i18n from 'i18n-js';
import { Ionicons } from 'expo-vector-icons';
import * as Linking from 'expo-linking';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import SnackBar from '../components/SnackBar';
import Colors from '../constants/Colors';
import HeaderButton from '../components/HeaderButton';
import { getBoard } from '../api';
import { NavigationEvents } from 'react-navigation';
import * as ScreenOrientation from 'expo-screen-orientation';
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

  const loadPosts = async () => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      getBoard()
        .then((res) => {
          const fetchedPosts = res.data.result;
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

  const handleRedirect = (item) => {
    console.log(item);
    if (item.redirectUrl) {
      Linking.openURL(item.redirectUrl);
    } else {
      navigation.navigate('BulletinDetail', {
        postId: item.postId,
      });
    }
  };

  useEffect(() => {
    loadPosts();
    async function orientationBack() {
      //Restric orientation PORTRAIT_UP screen
      console.log(' Destructor Bulletin');
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
    return () => {
      orientationBack();
    };
  }, []);

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.screen}>
      <NavigationEvents
        onDidFocus={async () => {
          //Unlock landscape orentation
          console.log(' Focus on bulletin ');
          await ScreenOrientation.unlockAsync();
        }}
        onWillBlur={async (pay) => {
          console.log(' on Blur bulletin Screen ');
          //if the next navigation is not BulletinDetail, restric orientation to PortraitUp mode
          if (pay.state.routeName !== 'BulletinDetail')
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }}
      />
      {!loading ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <TouchableComp
              onPress={() => {
                handleRedirect(item);
              }}
            >
              <View style={styles.listItem}>
                <View style={styles.leftSideListItem}>
                  <Ionicons name="md-book" size={25} color={Colors.primaryColor} />
                  <Text numberOfLines={2} style={styles.listItemTitle}>
                    {item.title}
                  </Text>
                </View>
                <Ionicons name="ios-arrow-forward" size={25} color={Colors.primaryColor} />
              </View>
            </TouchableComp>
          )}
        />
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
  headerRight: (
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
