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
import { Flag } from 'react-native-svg-flagkit';
import { Ionicons } from 'expo-vector-icons';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Colors from '../constants/Colors';
import i18n from 'i18n-js';
import * as Network from 'expo-network';
import { Snackbar } from 'react-native-paper';
import { getTerritories } from '../api';

class CommunityScreen extends Component {
  state = {
    delegations: [],
  };

  _onToggleSnackBar = () => this.setState({ visible: !this.state.visible });
  _onDismissSnackBar = () => this.setState({ visible: false });

<<<<<<< HEAD
  async componentDidMount() {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected === true) {
      axios
        .get(`${i18n.locale}/api/v1/territories?fields=all&key=${Constants.manifest.extra.secretKey}`)
        .then((res) => {
          console.log(res);
          if (res.data.status == 'OK') {
            const fetchedDelegations = res.data.result
              .map((entry) => {
                return {
                  ...entry,
                  data: entry.filiations.filter((filiation) => filiation.isActive),
                };
              })
              .filter((commuunity) => commuunity.isActive == true);
            this.setState({ delegations: fetchedDelegations });
          }
        })
        .catch((error) => {
          this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
        });
=======
  loadTerritories = (fields) => {
    getTerritories(fields)
      .then((res) => {
        const fetchedDelegations = res.data.result
          .map((entry) => {
            return {
              ...entry,
              data: entry.filiations.filter((filiation) => filiation.isActive),
            };
          })
          .filter((commuunity) => commuunity.isActive == true);
        this.setState({ delegations: fetchedDelegations });
      })
      .catch(() => {
        this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
      });
  };

  async componentDidMount() {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      this.loadTerritories('all');
>>>>>>> 2369f54abc28e3c8c02804ec0477c6493a92ec34
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
        {this.state.delegations.length > 0 ? (
          <SectionList
            sections={this.state.delegations}
<<<<<<< HEAD
            renderItem={({ item }) => (
              <Filiation
                key={item.filiationId}
=======
            keyExtractor={(item) => item.filiationId}
            renderItem={({ item }) => (
              <Filiation
>>>>>>> 2369f54abc28e3c8c02804ec0477c6493a92ec34
                title={item.name}
                flag={item.country}
                onSelect={() => this.props.navigation.navigate('FiliationDetail', { filiationId: item.filiationId })}
              />
            )}
            renderSectionHeader={({ section: { name, territoryId } }) => (
              <TouchableComp
                key={territoryId}
                onPress={(section) => {
<<<<<<< HEAD
                  console.log(section);
=======
>>>>>>> 2369f54abc28e3c8c02804ec0477c6493a92ec34
                  this.props.navigation.navigate('DelegationDetail', { delegationId: territoryId });
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
          <View>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          </View>
        )}
        <Snackbar
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
          style={styles.snackError}
        >
          {this.state.snackMsg}
        </Snackbar>
      </SafeAreaView>
    );
  }
}

CommunityScreen.navigationOptions = (navigationData) => ({
  headerTitle: '',
<<<<<<< HEAD
  headerRight: (
=======
  headerLeft: (
>>>>>>> 2369f54abc28e3c8c02804ec0477c6493a92ec34
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

const Filiation = ({ title, flag, onSelect, key }) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <TouchableComp
      key={key}
      onPress={() => {
<<<<<<< HEAD
        console.log('[Navegar a Filiation screen]');

=======
>>>>>>> 2369f54abc28e3c8c02804ec0477c6493a92ec34
        onSelect();
      }}
    >
      <View style={styles.item}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '80%', alignItems: 'center' }}>
          <Flag id={flag} size={0.2} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Ionicons name="ios-arrow-forward" size={23} color={Colors.primaryColor} />
      </View>
    </TouchableComp>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
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

export default CommunityScreen;
