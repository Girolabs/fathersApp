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

const ArchivedScreen = ({ navigation }) => {
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
