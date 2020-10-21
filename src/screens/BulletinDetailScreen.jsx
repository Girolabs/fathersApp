import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import i18n from 'i18n-js';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as Network from 'expo-network';
import { NavigationEvents } from 'react-navigation';
import * as ScreenOrientation from 'expo-screen-orientation';
import SnackBar from '../components/SnackBar';
import Colors from '../constants/Colors';
import HeaderButton from '../components/HeaderButton';
import { getBoardPost } from '../api';

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

  const loadPost = async (source) => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      if (source.html) {
        getBoardPost(source.html)
          .then((res) => {
            const { content } = res.data.result;
            const head =
              '<head><meta http-equiv="content-type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css"> body {-webkit-user-select:none;-webkit-touch-callout:none; font-family: "Arial"; background-color:#FFFFFF;font-size:16} div { color : black};*{ user-select: none; };</style></head>';
            const body =
              `<!DOCTYPE html />${head}<body oncopy="return false" onpaste="return false" oncut="return false"><div style="padding-bottom: 30px;font-weight: bold; text-align: center">` +
              `</div>${content}</body></html>`;

            const fetchedPost = {
              ...res.data.result,
              content: { html: body },
            };

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

  useEffect(() => {
    const postId = navigation.getParam('postId');
    const navigationUrl = navigation.getParam('url');
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
  }, []);

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
        <WebView originWhitelist={['*']} source={post} />
      ) : (
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      )}
      <SnackBar visible={visible} onDismiss={() => setVisible(false)}>
        {snackMsg}
      </SnackBar>
    </View>
  );
};

BulletinDetail.navigationOptions = (navigationData) => ({
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

export default BulletinDetail;
