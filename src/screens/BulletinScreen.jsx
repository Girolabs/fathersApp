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
import axios from '../../axios-instance';
import Colors from '../constants/Colors';

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
});

const BulletinScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected === true) {
      axios
        .get(`${i18n.locale}/api/v1/bulletin-board`)
        .then((res) => {
          const fetchedPosts = res.data.result;
          setPosts(fetchedPosts);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
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
  }, []);

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.screen}>
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
    </View>
  );
};

BulletinScreen.navigationOptions = () => ({
  headerTitle: '',
});

export default BulletinScreen;
