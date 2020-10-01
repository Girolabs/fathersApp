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
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import { getPersons } from '../api';
import { CheckBox } from 'react-native-elements';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import { NavigationEvents } from 'react-navigation';

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
  };

  loadPersons = async (fields) => {
    getPersons(fields)
      .then(async (res) => {
        this.setState({ results: res.data.result, loading: false });
        console.log('res data', res.data.result);
        try {
          console.log('Cargar resultado en el localstorage');
          await AsyncStorage.setItem('result', JSON.stringify(res.data.result));
        } catch (e) {
          console.log('Error al cargar results ', e);
        }
      })
      .catch(() => {
        this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
      });
  };
  async getData(){
      //Verificamos si current Date es menor al DateDeadline
      //Si es menor no hace falta, hacer un nuevo request, se usa lo que esta en el local si existe sino existe se hace el get de los datos
      //Si es mayor se actualiza el item result on AsyncStorage llamando a la funcion loadPerson('all) y se actuliza el nuevo DateDeadline sumandole 24 horas al current date
      var isOldresult = false;
      try {
        var currentDate = new Date();
        const tem = await AsyncStorage.getItem('DateDeadline');
        if (tem !== null) {
          const date = new Date(tem);
          if (currentDate > date) {
            isOldresult=true;
            var newDateDeadline = new Date();
            newDateDeadline.setDate(currentDate.getDate() + 1);
            await AsyncStorage.setItem('DateDeadline', newDateDeadline);
          }
        } else {
          //si no existe cargamos
          var newDateDeadline = new Date();
          newDateDeadline.setDate(currentDate.getDate() + 1);
          await AsyncStorage.setItem('DateDeadline', newDateDeadline);
        }
      } catch (e) {
        console.log('Error at AsyncStorage get item on Date');
      }

      console.log('isOldresult => ', isOldresult);
      try {
        //Verificamos si esta almacenado en el local storage los fields
        const result = await AsyncStorage.getItem('result');
        if (result == null) {
          //si no esta en el local, cargamos los datos
          this.loadPersons('all');
        } else {
            console.log('result ',JSON.parse(result));
          if (isOldresult)
            //aunque este almacenado en el local storage, se tiene que actualizar los datos ya que vencio el tiempo
            this.loadPersons('all');
          else this.setState({ results: JSON.parse(result), loading: false });
        }
      } catch (e) {
        console.log('Error on asyncstorage get item result');
      }
  }
  async componentDidMount() {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      this.getData()
    } else {
      this.setState({ snackMsg: i18n.t('GENERAL.NO_INTERNET'), visible: true, loading: false });
    }
  }

  onChangeFilter = (texto) => {
    let filterResults = [];

    if (this.state.showDeceased && this.state.showExMember) {
      console.log('Ambos filtros');
      filterResults = this.state.results;
    } else if (this.state.showDeceased && !this.state.showExMember) {
      console.log('Mostrar fallecidos');
      filterResults = this.state.results.filter((persona) => persona.isMember != false);
    } else if (!this.state.showDeceased && this.state.showExMember) {
      console.log('Mostrar ex miembros');
      filterResults = this.state.results.filter((persona) => persona.isLiving != false);
    } else {
      console.log('Ningun filtro');
      filterResults = this.state.results.filter((persona) => persona.isLiving != false);
      filterResults = filterResults.filter((persona) => persona.isMember != false);
    }

    filterResults = filterResults.filter((persona) => {
      if (
        (persona.firstNameWithoutAccents &&
          persona.lastNameWithoutAccents &&
          (persona.firstNameWithoutAccents + ' ' + persona.lastNameWithoutAccents).trim().startsWith(texto)) ||
        (persona.firstNameWithoutAccents && persona.firstNameWithoutAccents.trim().startsWith(texto)) ||
        (persona.lastNameWithoutAccents && persona.lastNameWithoutAccents.trim().startsWith(texto))
      ) {
        return persona;
      }
    });
    this.setState({ filterResults: filterResults, loading: false });
  };

  handleFilter = (keyword) => {
    if (keyword) {
      this.setState({ searchText: keyword.toLowerCase(), loading: true });
      const texto = keyword.toLowerCase();

      this.onChangeFilter(texto);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showExMember != this.state.showExMember || prevState.showDeceased != this.state.showDeceased) {
      console.log('DidUpdate');
      this.setState({ loading: true });
      const texto = this.state.searchText.toLowerCase();
      this.onChangeFilter(texto);
    }
  }

  render() {
    return (
      <View style={styles.screen}>
          <NavigationEvents
            onDidFocus={()=>{
              this.getData()
          }}
          />
        {!this.state.loading ? (
          <Fragment>
            <View style={styles.inputBox}>
              <TextInput placeholder={i18n.t('SEARCH.PLACEHOLDER')} onChangeText={(text) => this.handleFilter(text)} />
              <Ionicons name="ios-search" size={25} colors={Colors.primaryColor} />
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
        <SnackBar visible={this.state.visible} onDismiss={() => this.setState({ visible: false })}>
          {this.state.snackMsg}
        </SnackBar>
      </View>
    );
  }
}

SearchScreen.navigationOptions = (navigationData) => ({
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
  headerBackTitle: i18n.t('GENERAL.BACK'),
});

export default SearchScreen;
