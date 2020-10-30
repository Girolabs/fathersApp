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
import SnackBar from '../components/SnackBar';
import { getTerritories } from '../api';

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

class CommunityScreen extends Component {
  state = {
    delegations: [],
  };

  _onToggleSnackBar = () => this.setState({ visible: !this.state.visible });
  _onDismissSnackBar = () => this.setState({ visible: false });

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
            keyExtractor={(item) => item.filiationId.toString()}
            renderItem={({ item }) => (
              <Filiation
                key={item.filiationId.toString()}
                title={item.name}
                flag={item.country}
                onSelect={() => this.props.navigation.navigate('FiliationDetail', { filiationId: item.filiationId })}
              />
            )}
            renderSectionHeader={({ section: { name, territoryId } }) => (
              <TouchableComp
                key={territoryId}
                onPress={(section) => {
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
        <SnackBar visible={this.state.visible} onDismiss={() => this.setState({ visible: false })}>
          {this.state.snackMsg}
        </SnackBar>
      </SafeAreaView>
    );
  }
}

CommunityScreen.navigationOptions = (navigationData) => ({
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

const Filiation = ({ title, flag, onSelect, key }) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <TouchableComp
      key={key}
      onPress={() => {
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

export default CommunityScreen;
