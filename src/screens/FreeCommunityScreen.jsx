import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  SectionList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  TouchableNativeFeedback,
} from 'react-native';
import { Ionicons } from 'expo-vector-icons';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Colors from '../constants/Colors';
import i18n from 'i18n-js';
import * as Network from 'expo-network';
import SnackBar from '../components/SnackBar';
import { getCourses } from '../api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    justifyContent: 'center',
  },
  item: {
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 15,
    color: Colors.onSurfaceColorPrimary,
    fontFamily: 'work-sans-medium',

    marginVertical: 10,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'work-sans-semibold',
    color: Colors.primaryColor,
    paddingHorizontal: 10,
  },
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
});

class FreeCommunityScreen extends Component {
  state = {
    generations: [],
  };

  loadCourses = (fields) => {
    getCourses(fields)
      .then((res) => {
        let data = [];
        res.data.result.forEach((a) => {
          let i = a.generationId == null ? 0 : a.generationId;
          data[i] = data[i] || { data: [], name: '', generationId: '' };
          data[i].name = a.generationName || i18n.t('GENERATION.WITHOUT_GENERATIONS');
          data[i].generationId = i;
          data[i].data.push(a);
        });
        let temp = data[0];
        data.shift();
        data.push(temp);
        const datafilter = data.filter((d) => d.generationId !== undefined);
        this.setState({ generations: datafilter });
      })
      .catch(() => {
        this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
      });
  };

  async componentDidMount() {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      this.loadCourses(false);
    } else {
      this.setState({ snackMsg: i18n.t('GENERAL.NO_INTERNET'), visible: true, loading: false });
    }
  }

  render() {
    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableComp = TouchableNativeFeedback;
    }
    return (
      <SafeAreaView style={styles.container}>
        {this.state.generations.length > 0 ? (
          <SectionList
            stickySectionHeadersEnabled={false}
            sections={this.state.generations}
            keyExtractor={(item) => item.courseId}
            renderItem={({ item }) => {
              return (
                <Course
                  title={item.name}
                  onSelect={() => this.props.navigation.navigate('CourseDetail', { courseId: item.courseId })}
                />
              );
            }}
            renderSectionHeader={({ section: { name, generationId } }) => (
              <TouchableComp
                key={generationId}
                onPress={(section) => {
                  if (generationId) this.props.navigation.navigate('GenerationDetail', { generationId: generationId });
                }}
              >
                <View style={styles.sectionHeaderContainer}>
                  <Text style={styles.header}>{name}</Text>
                  <Ionicons name="ios-help-circle-outline" size={23} color={Colors.primaryColor} />
                </View>
              </TouchableComp>
            )}
          />
        ) : (
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        )}
        <SnackBar visible={this.state.visible} onDismiss={() => this.setState({ visible: false })}>
          {this.state.snackMsg}
        </SnackBar>
      </SafeAreaView>
    );
  }
}

FreeCommunityScreen.navigationOptions = (navigationData) => ({
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

const Course = ({ title, onSelect }) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <TouchableComp
      onPress={() => {
        console.log('[Navegar a Filiation screen]');

        onSelect();
      }}
    >
      <View style={styles.item}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '80%', alignItems: 'center' }}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Ionicons name="ios-arrow-forward" size={23} color={Colors.primaryColor} />
      </View>
    </TouchableComp>
  );
};

export default FreeCommunityScreen;
