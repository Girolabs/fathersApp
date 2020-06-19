import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import { Ionicons } from 'expo-vector-icons';
import Constants from 'expo-constants';
import axios from '../../axios-instance';
import { Checkbox } from 'react-native-paper';
import i18n from 'i18n-js';
class SearchScreen extends Component {
  state = {
    results: [],
    filterResults: [],
    loading: true,
    deceased: false,
    member: false,
    searchText: '',
  };

  componentDidMount() {
    axios.get(`en/api/v1/persons?fields=all&key=${Constants.manifest.extra.secretKey}`).then((res) => {
      if (res.status == 200) {
        this.setState({ results: res.data.result, loading: false });
      }
    });
  }

  handleFilter = (keyword) => {
    this.setState({ loading: true });
    if (keyword) {
      this.setState({ searchText: keyword.toLowerCase() });
      let filterResults = [];
      const texto = keyword.toLowerCase();
      filterResults = this.state.results.filter((persona) => {
        if ((persona.firstNameWithoutAccents + ' ' + persona.lastNameWithoutAccents).trim().startsWith(texto)) {
          return persona;
        }
        if (persona.firstNameWithoutAccents.trim().startsWith(texto)) {
          return persona;
        }
        if (persona.lastNameWithoutAccents.trim().startsWith(texto)) {
          return persona;
        }
      });

      filterResults = filterResults.filter((persona) => {
        if (persona.isMember == !this.state.member && persona.isLiving == !this.state.deceased) {
          return persona;
        }
      });
      this.setState({ filterResults: filterResults, loading: false });
    }
    this.setState({ loading: false });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.member != this.state.member || prevState.deceased != this.state.deceased) {
      this.setState({ loading: true });

      const texto = this.state.searchText.toLowerCase();

      let filterResults = this.state.results.filter((persona) => {
        if ((persona.firstNameWithoutAccents + ' ' + persona.lastNameWithoutAccents).trim().startsWith(texto)) {
          return persona;
        }
        if (persona.firstNameWithoutAccents.trim().startsWith(texto)) {
          return persona;
        }
        if (persona.lastNameWithoutAccents.trim().startsWith(texto)) {
          return persona;
        }
      });
      filterResults = filterResults.filter((el) => {
        if (el.isMember == !this.state.member && el.isLiving == !this.state.deceased) {
          return el;
        }
      });
      this.setState({ filterResults: filterResults, loading: false });
    }
  }

  render() {
    return (
      <View style={styles.screen}>
        {!this.state.loading ? (
          <Fragment>
            <View style={styles.inputBox}>
              <TextInput placeholder={i18n.t('SEARCH.PLACEHOLDER')} onChangeText={(text) => this.handleFilter(text)} />
              <Ionicons name="ios-search" size={25} colors={Colors.primaryColor} />
            </View>
            <View style={styles.filtersContainer}>
              <View style={styles.optionContainer}>
                <Checkbox
                  status={this.state.deceased ? 'checked' : 'unchecked'}
                  onPress={() => this.setState({ deceased: !this.state.deceased })}
                />
                <Text style={styles.option}>{i18n.t('SEARCH.DECEASED')} </Text>
              </View>

              <View style={styles.optionContainer}>
                <Checkbox
                  status={this.state.member ? 'checked' : 'unchecked'}
                  onPress={() => this.setState({ member: !this.state.member })}
                />
                <Text style={styles.option}>{i18n.t('SEARCH.EX')} </Text>
              </View>
            </View>

            <FlatList
              data={this.state.filterResults}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.item}
                    onPress={() => {
                      this.props.navigation.navigate('PatreDetail', {
                        fatherId: item.personId,
                      });
                    }}
                  >
                    <Text>{item.fullName}</Text>
                    <Ionicons name="ios-arrow-forward" size={23} color={Colors.primaryColor} />
                  </TouchableOpacity>
                );
              }}
            />
          </Fragment>
        ) : (
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        )}
      </View>
    );
  }
}

SearchScreen.navigationOptions = () => ({
  headerTitle: '',
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.surfaceColorPrimary,
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
  item: {
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 15,
    borderBottomColor: Colors.surfaceColorPrimary,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  option: {},
});

export default SearchScreen;
