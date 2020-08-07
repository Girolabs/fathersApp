import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import i18n from 'i18n-js';
import axios from '../../axios-instance';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

const BulletinDetail = ({ navigation }) => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postId = navigation.getParam('postId');
    axios
      .get(`${i18n.locale}/api/v1/bulletin-board/${postId}`)
      .then((res) => {
        const head =
          '<head><meta http-equiv="content-type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css"> body {-webkit-user-select:none;-webkit-touch-callout:none; font-family: "Arial"; background-color:#FFFFFF;font-size:16} div { color : black};*{ user-select: none; };</style></head>';
        const body =
          `<!DOCTYPE html />${head}<body oncopy="return false" onpaste="return false" oncut="return false"><div style="padding-bottom: 30px;font-weight: bold; text-align: center">` +
          `</div>${res.data.result.content}</body></html>`;
        const fetchedPost = {
          ...res.data.result,
          content: body,
        };

        setPost(fetchedPost);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.screen}>
      {!loading ? (
        <WebView originWhitelist={['*']} source={{ html: post.content }} style={{ flex: 1 }} />
      ) : (
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      )}
    </View>
  );
};

BulletinDetail.navigationOptions = () => ({
  headerTitle: '',
});

export default BulletinDetail;
