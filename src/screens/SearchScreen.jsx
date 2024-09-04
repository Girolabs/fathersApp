import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Colors from '../constants/Colors';
import { Ionicons } from 'expo-vector-icons';
import { Checkbox } from 'react-native-paper';
import i18n from 'i18n-js';
import * as Network from 'expo-network';
import SnackBar from '../components/SnackBar';
import { getPersons } from '../api';
import { CheckBox } from 'react-native-elements';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.surfaceColorPrimary,
    justifyContent: 'center',
  },
  inputBox: {
    backgroundColor: Colors.surfaceColorSecondary,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  searchInput: {
    minWidth: '75%',
    maxWidth: '85%',
  },
  item: {
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 15,
    borderBottomColor: Colors.surfaceColorPrimary,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 5,
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
  CheckBoxContainer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  textCheckBox: {
    fontFamily: 'work-sans',
  },
  option: {},
});

class SearchScreen extends Component {
  state = {
    results: [],
    filterResults: [],
    loading: true,
    showDeceased: false,
    showExMember: false,
    searchText: '',
    visible: false,
    snackMsg: '',
  };

  loadPersons = async (fields) => {
    try {
      const res = await getPersons(fields);
      this.setState({ results: res.data.result, loading: false });
      await AsyncStorage.setItem('result', JSON.stringify(res.data.result));
    } catch (e) {
      this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
    }
  };

  async getData() {
    let isOldresult = false;
    try {
      const currentDate = new Date();
      const tem = await AsyncStorage.getItem('DateDeadline');
      if (tem !== null) {
        const date = new Date(tem);
        if (currentDate > date) {
          isOldresult = true;
          const newDateDeadline = new Date();
          newDateDeadline.setDate(currentDate.getDate() + 1);
          await AsyncStorage.setItem('DateDeadline', newDateDeadline.toString());
        }
      } else {
        const newDateDeadline = new Date();
        newDateDeadline.setDate(currentDate.getDate() + 1);
        await AsyncStorage.setItem('DateDeadline', newDateDeadline.toString());
      }
    } catch (e) {
      const newDateDeadline = new Date();
      newDateDeadline.setDate(currentDate.getDate() + 1);
      await AsyncStorage.setItem('DateDeadline', newDateDeadline.toString());
      console.log('Error at AsyncStorage get item on Date');
    }

    try {
      const result = await AsyncStorage.getItem('result');
      if (result == null || isOldresult) {
        this.loadPersons(false);
      } else {
        this.setState({ results: JSON.parse(result), loading: false });
      }
    } catch (e) {
      this.loadPersons(false);
      console.log('Error on asyncstorage get item result');
    }
  }

  async componentDidMount() {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      await this.getData();
    } else {
      this.setState({ snackMsg: i18n.t('GENERAL.NO_INTERNET'), visible: true, loading: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showExMember !== this.state.showExMember || prevState.showDeceased !== this.state.showDeceased) {
      this.setState({ loading: true });
      const texto = this.state.searchText.toLowerCase();
      this.onChangeFilter(texto);
    }
  }

  onChangeFilter = (texto) => {
    let filterResults = [];
    if (this.state.showDeceased && this.state.showExMember) {
      filterResults = this.state.results;
    } else if (this.state.showDeceased && !this.state.showExMember) {
      filterResults = this.state.results.filter((persona) => persona.isMember !== false);
    } else if (!this.state.showDeceased && this.state.showExMember) {
      filterResults = this.state.results.filter((persona) => persona.isLiving !== false);
    } else {
      filterResults = this.state.results.filter((persona) => persona.isLiving !== false && persona.isMember !== false);
    }

    filterResults = filterResults.filter((persona) => {
      return (
        (persona.firstNameWithoutAccents &&
          persona.lastNameWithoutAccents &&
          (persona.firstNameWithoutAccents + ' ' + persona.lastNameWithoutAccents).trim().startsWith(texto)) ||
        (persona.firstNameWithoutAccents && persona.firstNameWithoutAccents.trim().startsWith(texto)) ||
        (persona.lastNameWithoutAccents && persona.lastNameWithoutAccents.trim().startsWith(texto)) ||
        (persona.firstNameWithoutAccents + ' ' + persona.lastNameWithoutAccents).trim().includes(texto)
      );
    });
    this.setState({ filterResults, loading: false });
  };

  handleFilter = (keyword) => {
    if (keyword) {
      this.setState({ searchText: keyword.toLowerCase(), loading: true });
      this.onChangeFilter(keyword.toLowerCase());
    }
  };

  render() {
    return (
      <View style={styles.screen}>
        {!this.state.loading ? (
          <Fragment>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.searchInput}
                placeholder={i18n.t('SEARCH.PLACEHOLDER')}
                onChangeText={(text) => this.handleFilter(text)}
              />
              <Ionicons name="ios-search" size={25} color={Colors.primaryColor} />
            </View>
            <View style={styles.filtersContainer}>
              {Platform.OS === 'ios' ? (
                <Fragment>
                  <CheckBox
                    textStyle={styles.textCheckBox}
                    containerStyle={styles.CheckBoxContainer}
                    title={i18n.t('SEARCH.DECEASED')}
                    checked={this.state.showDeceased}
                    onPress={() => this.setState({ showDeceased: !this.state.showDeceased })}
                    checkedIcon={<AntDesign name="checksquareo" size={24} color={Colors.primaryColor} />}
                    uncheckedIcon={
                      <MaterialCommunityIcons
                        name="checkbox-blank-outline"
                        size={24}
                        color={Colors.onSurfaceColorSecondary}
                      />
                    }
                  />
                  <CheckBox
                    textStyle={styles.textCheckBox}
                    containerStyle={styles.CheckBoxContainer}
                    title={i18n.t('SEARCH.EX')}
                    checked={this.state.showExMember}
                    onPress={() => this.setState({ showExMember: !this.state.showExMember })}
                    checkedIcon={<AntDesign name="checksquareo" size={24} color={Colors.primaryColor} />}
                    uncheckedIcon={
                      <MaterialCommunityIcons
                        name="checkbox-blank-outline"
                        size={24}
                        color={Colors.onSurfaceColorSecondary}
                      />
                    }
                  />
                </Fragment>
              ) : (
                <Fragment>
                  <View style={styles.optionContainer}>
                    <Checkbox
                      color={Colors.primaryColor}
                      status={this.state.showDeceased ? 'checked' : 'unchecked'}
                      onPress={() => this.setState({ showDeceased: !this.state.showDeceased })}
                    />
                    <Text style={styles.option}>{i18n.t('SEARCH.DECEASED')} </Text>
                  </View>

                  <View style={styles.optionContainer}>
                    <Checkbox
                      color={Colors.primaryColor}
                      status={this.state.showExMember ? 'checked' : 'unchecked'}
                      onPress={() => this.setState({ showExMember: !this.state.showExMember })}
                    />
                    <Text style={styles.option}>{i18n.t('SEARCH.EX')} </Text>
                  </View>
                </Fragment>
              )}
            </View>

            <FlatList
              data={this.state.filterResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', { personId: item.id })}>
                  <View style={styles.item}>
                    <Text>{item.firstName + ' ' + item.lastName}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </Fragment>
        ) : (
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        )}
        <SnackBar
          visible={this.state.visible}
          textMessage={this.state.snackMsg}
          actionHandler={() => this.setState({ visible: false })}
          actionText={i18n.t('GENERAL.CLOSE')}
          backgroundColor={Colors.secondaryColor}
        />
      </View>
    );
  }
}

export default SearchScreen;
