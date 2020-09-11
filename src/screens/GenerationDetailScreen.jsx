import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { I18nContext } from '../context/I18nProvider';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import moment from 'moment';
import 'moment/min/locales';
import * as Network from 'expo-network';
import SnackBar from '../components/SnackBar';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import { getGeneration } from '../api';
import IdealStatement from '../components/IdealStatement';
import GenerationCourses from '../components/GenerationCourses';

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.surfaceColorPrimary,
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'work-sans-semibold',
    fontSize: 27,
    color: Colors.primaryColor,
  },
  sectionHeader: {
    fontFamily: 'work-sans-medium',
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    padding: 15,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    backgroundColor: Colors.surfaceColorPrimary,
  },
  listItem: {
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 15,
  },
  listItemTitle: {
    fontFamily: 'work-sans-semibold',
    fontSize: 18,
    color: Colors.onSurfaceColorPrimary,
  },
  listItemBody: {
    fontFamily: 'work-sans',
    fontSize: 12,
    color: Colors.onSurfaceColorPrimary,
  },
  card: {
    width: '90%',
    marginLeft: 15,
    marginVertical: 15,
    padding: 15,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
  },
  cardTitle: {
    color: Colors.surfaceColorSecondary,
    fontSize: 18,
    fontFamily: 'work-sans-semibold',
  },
  cardBody: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomColor: Colors.onSurfaceColorSecondary,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  cardBodyText: {
    color: Colors.surfaceColorSecondary,
    fontSize: 15,
    fontFamily: 'work-sans',
    width: '50%',
  },
  cardBodyTextBold: {
    color: Colors.surfaceColorSecondary,
    fontSize: 15,
    fontFamily: 'work-sans-semibold',
    textAlign: 'left',
    width: '50%',
  },
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
});

class GenerationDetailScreen extends Component {
  state = {
    generation: {},
    loading: true,
  };

  loadGeneration = (generationId, fields) => {
    getGeneration(generationId, fields)
      .then((res) => {
        const generation = res.data.result;
        this.setState({ generation: generation, loading: false });
      })
      .catch(() => {
        this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
      });
  };
  async componentDidMount() {
    const { navigation } = this.props;
    const generationId = navigation.getParam('generationId');
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      this.loadGeneration(generationId, false);
    } else {
      this.setState({ snackMsg: i18n.t('GENERAL.NO_INTERNET'), visible: true, loading: false });
    }
  }
  render() {
    const { generation } = this.state;
    const { navigation } = this.props;
    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableComp = TouchableNativeFeedback;
    }

    return (
      <I18nContext.Consumer>
        {(value) => {
          moment.locale(value.lang);
          return (
            <SafeAreaView style={styles.screen}>
              {!this.state.loading ? (
                <ScrollView>
                  <View>
                    <View style={styles.titleContainer}>
                      <Text style={styles.title}>{generation.name}</Text>
                    </View>
                    <View>
                      <Text style={styles.sectionHeader}> {i18n.t('GENERATION.GENERATION_INFO')} </Text>
                      {generation.celebrationDate && (
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}> {i18n.t('GENERATION.CELEBRATION_DATE')} </Text>
                          <Text style={styles.listItemBody}>
                            {this.state.generation.celebrationDate
                              ? moment.utc(generation.celebrationDate).format('Do MMMM YYYY')
                              : ''}
                          </Text>
                        </View>
                      )}

                      <View style={styles.listItem}>
                        <Text style={styles.listItemTitle}>{i18n.t('GENERATION.FOUNDATION_DATE')}</Text>
                        <Text style={styles.listItemBody}>
                          {generation.foundingDate ? moment.utc(generation.foundingDate).format('Do MMMM YYYY') : ''}
                        </Text>
                      </View>
                      <IdealStatement
                        languages={generation ? generation.idealLanguages : []}
                        recommendedLang={generation.recommendedIdealField}
                        navigation={navigation}
                        entity={generation}
                      />
                      <GenerationCourses courses={generation.courses} />
                    </View>
                  </View>
                </ScrollView>
              ) : (
                <ActivityIndicator size="large" color={Colors.primaryColor} />
              )}
              <SnackBar visible={this.state.visible} onDismiss={() => this.setState({ visible: false })}>
                {this.state.snackMsg}
              </SnackBar>
            </SafeAreaView>
          );
        }}
      </I18nContext.Consumer>
    );
  }
}

GenerationDetailScreen.navigationOptions = (navigationData) => ({
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
});

export default GenerationDetailScreen;
