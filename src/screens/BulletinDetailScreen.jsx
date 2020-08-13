import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import { getBoardPost } from '../api';
import * as Network from 'expo-network';
import { Snackbar } from 'react-native-paper';

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

  const loadPost = async (lang, postId) => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      getBoardPost(lang, postId)
        .then((res) => {
          const { content } = res.data.result;
          const head =
            '<head><meta http-equiv="content-type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css"> body {-webkit-user-select:none;-webkit-touch-callout:none; font-family: "Arial"; background-color:#FFFFFF;font-size:16} div { color : black};*{ user-select: none; };</style></head>';
          const body =
            `<!DOCTYPE html />${head}<body oncopy="return false" onpaste="return false" oncut="return false"><div style="padding-bottom: 30px;font-weight: bold; text-align: center">` +
            `</div>${content}</body></html>`;

          const fetchedPost = {
            ...res.data.result,
            content: body,
          };

          setPost(fetchedPost);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setVisible(true);
          setSnackMsg();
        });
    } else {
      setVisible(true);
      setSnackMsg(i18n.t('GENERAL.NO_INTERNET'));
    }
  };

  useEffect(() => {
    const postId = navigation.getParam('postId');

    loadPost(i18n.locale, postId);
  }, []);

  return (
    <View style={styles.screen}>
      {!loading ? (
        <WebView originWhitelist={['*']} source={{ html: post.content }} />
      ) : (
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      )}
      <Snackbar visible={visible} onDismiss={() => setVisible(false)} style={styles.snackError}>
        {snackMsg}
      </Snackbar>
    </View>
  );
};

BulletinDetail.navigationOptions = () => ({
  headerTitle: '',
});

export default BulletinDetail;
