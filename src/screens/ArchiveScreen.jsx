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
import BulletinItem from '../components/BulletinItem';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';

const ArchiveScreen = ({ navigation }) => {
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
          console.log(fetchedPosts);
          const notArchived = fetchedPosts.filter((res) => !res.isArchived);
          setPosts(notArchived);
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

  return (
    <ScrollView
      style={{
        backgroundColor: 'white',
      }}
    >
      {!loading ? (
        <View>
          {posts.map((post) => (
            <BulletinItem item={post} key={post.postId} />
          ))}
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
              {i18n.t('ARCHIVE.ARCHIVE')}
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

ArchiveScreen.navigationOptions = (navigationData) => ({
  headerTitle: i18n.t('ARCHIVE.EDIT'),
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

export default ArchiveScreen;
