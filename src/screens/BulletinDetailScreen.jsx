import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Pressable,
  useWindowDimensions,
  Alert,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import i18n from 'i18n-js';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as Network from 'expo-network';
import { NavigationEvents } from 'react-navigation';
import * as ScreenOrientation from 'expo-screen-orientation';
import SnackBar from '../components/SnackBar';
import Colors from '../constants/Colors';
import HeaderButton from '../components/HeaderButton';
import { getBoardPost, savePinnedPost, saveUnpinnedPost, getPinnedPosts, errorHandler } from '../api';
import star from '../../assets/star-outline.png';
import starActive from '../../assets/star-active.png';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

const BulletinDetail = ({ navigation }) => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [id, setId] = useState(null);

  const postId = navigation.getParam('postId');
  const navigationUrl = navigation.getParam('url');

  const loadPost = async (source) => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      if (source.html) {
        getBoardPost(source.html)
          .then((res) => {
            console.log(res.data.result);
            const { content } = res.data.result;
            const head =
              '<head><meta http-equiv="content-type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css"> body {-webkit-user-select:none;-webkit-touch-callout:none; font-family: "Arial"; background-color:#FFFFFF;font-size:1.2em} div { color : black};*{ user-select: none; };</style></head>';
            const body =
              `<!DOCTYPE html />${head}<body oncopy="return false" onpaste="return false" oncut="return false"><div style="padding-bottom: 30px;font-weight: bold; text-align: center">` +
              `</div>${content}</body></html>`;

            const fetchedPost = {
              ...res.data.result,
              content: { html: body },
            };
            setId(fetchedPost.postId);
            setPost(fetchedPost.content);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            setVisible(true);
            setSnackMsg();
          });
      }
      if (source.uri) {
        const content = { uri: source.uri };
        setPost(content);
        setLoading(false);
      }
    } else {
      setVisible(true);
      setSnackMsg(i18n.t('GENERAL.NO_INTERNET'));
    }
  };

  const loadPinPost = async () => {
    await getPinnedPosts()
      .then((res) => {
        if (res.data.result.postId === id || res.data.result.redirectUrl === navigationUrl) {
          setFavorite(true);
        }
      })
      .catch((err) => {
        setFavorite(false);
      });
  };

  const savePin = () => {
    setLoading(true);
    savePinnedPost(postId).then(
      (res) => {
        //Alert.alert(i18n.t('ARCHIVE.SUCCESS'));
        setFavorite(!favorite);
      },
      (err) => {
        errorHandler(err);
      },
    );
    setLoading(false);
  };

  const saveUnpin = () => {
    setLoading(true);
    saveUnpinnedPost(postId).then(
      (res) => {
        //Alert.alert(i18n.t('ARCHIVE.SUCCESS'));
        setFavorite(!favorite);
      },
      (err) => {
        errorHandler(err);
      },
    );
    setLoading(false);
  };

  useEffect(() => {
    let source = null;
    if (post) {
      source = {
        html: postId,
      };
    }
    if (navigationUrl) {
      source = {
        uri: navigationUrl,
      };
    }
    loadPost(source);
    console.log('id: ', id);
  }, []);

  useEffect(() => {
    loadPinPost();
  }, [favorite, post]);

  const windowHeight = useWindowDimensions().height;

  return (
    <View style={styles.screen}>
      <NavigationEvents
        onDidFocus={async () => {
          // Unlock landscape orentation
          console.log(' Focus on Bulletin Detail ');
          await ScreenOrientation.unlockAsync();
        }}
        onDidBlur={async () => {
          // Restric orentiation to Portrait Up
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }}
      />
      {!loading ? (
        <>
          <Pressable
            style={{
              position: 'absolute',
              top: Platform.OS === 'android' ? -40 : 10,
              left: Platform.OS === 'android' ? '78%' : '90%',
              zIndex: 9,
            }}
            onPress={() => {
              if (!favorite) {
                savePin();
              } else {
                saveUnpin();
              }
            }}
          >
            {favorite ? <Image source={starActive} /> : <Image source={star} />}
          </Pressable>
          <WebView originWhitelist={['*']} source={post} />
        </>
      ) : (
        <ActivityIndicator
          style={{
            height: windowHeight,
          }}
          size="large"
          color={Colors.primaryColor}
        />
      )}
      <SnackBar visible={visible} onDismiss={() => setVisible(false)}>
        {snackMsg}
      </SnackBar>
    </View>
  );
};

BulletinDetail.navigationOptions = (navigationData) => ({
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

export default BulletinDetail;
