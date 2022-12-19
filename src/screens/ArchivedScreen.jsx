import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { errorHandler, getArchivedPosts, getBoard, unarchivePost } from '../api';
import Colors from '../constants/Colors';
import i18n from 'i18n-js';
import * as Network from 'expo-network';
import SnackBar from '../components/SnackBar';
import { Pressable } from 'react-native';
import { ScrollView } from 'react-native';
import BulletinItem from '../components/BulletinItem';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';

const ArchivedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [postToUpdate, setPostToUpdate] = useState([]);

  const loadPosts = async () => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      getArchivedPosts()
        .then((res) => {
          const fetchedPosts = res.data.result;
          console.log('Archivados', fetchedPosts);
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

  const sendToUnarchive = () => {
    postToUpdate.map((postId) => {
      unarchivePost(postId).then(
        (res) => {
          console.log('RESPUESTA: ', res);
        },
        (err) => {
          console.log('ERROR: ', err);
          errorHandler(err);
          return;
        },
      );
    });
  };

  const windowHeight = useWindowDimensions().height;

  return (
    <ScrollView
      style={{
        backgroundColor: 'white',
      }}
    >
      {!loading ? (
        <View>
          {posts.map((post) => (
            <BulletinItem
              item={post}
              key={post.postId}
              postToUpdate={() => {
                if (!postToUpdate.includes(post.postId)) {
                  setPostToUpdate((prev) => [post.postId, ...prev]);
                } else {
                  setPostToUpdate((prev) => prev.filter((id) => id !== post.postId));
                }
              }}
            />
          ))}
          {posts.length === 0 ? (
            <View
              style={{
                height: windowHeight,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'work-sans',
                  fontStyle: 'normal',
                  fontWeight: '700',
                  fontSize: 16,
                  color: 'rgba(0, 0, 0, 0.37)',
                  letterSpacing: 1,
                }}
              >
                {i18n.t('ARCHIVE.NO_POSTS')}
              </Text>
            </View>
          ) : (
            <Pressable
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                margin: 45,
              }}
              onPress={() => {
                if (postToUpdate.length > 0) {
                  sendToUnarchive();
                  //Alert.alert('POST TO UPDATE: ', postToUpdate.toString());
                  navigation.goBack();
                } else {
                  Alert.alert('Error', i18n.t('ARCHIVE.ERROR'));
                }
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
                {i18n.t('ARCHIVE.UNARCHIVE')}
              </Text>
            </Pressable>
          )}
        </View>
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
    </ScrollView>
  );
};

ArchivedScreen.navigationOptions = (navigationData) => ({
  headerTitle: i18n.t('ARCHIVE.ARCHIVED'),
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

export default ArchivedScreen;
