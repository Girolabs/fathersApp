import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { Ionicons } from 'expo-vector-icons';
import Constants from 'expo-constants';
import axios from 'axios';

class SearchScreen extends Component {
    state = {
        results: [],
        filterResults: [],
    };

    componentDidMount() {
        axios
            .get(`https://schoenstatt-fathers.link/en/api/v1/persons?fields=all&key=${Constants.manifest.extra.secretKey}`)
            .then((res) => {
                if (res.status == 200) {
                    this.setState({ results: res.data.result });
                }
            });
    }
    handleFilter = (keyword) => {
        console.log(keyword);
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
        this.setState({ filterResults: filterResults });
    };

   
    render() {
        return (
            <View style={styles.screen}>
                <View style={styles.inputBox}>
                    <TextInput placeholder="Search" onChangeText={(text) => this.handleFilter(text)} />
                    <Ionicons name="ios-search" size={25} colors={Colors.primaryColor} />
                </View>
                <FlatList
                    data={this.state.filterResults}
                    renderItem={({ item, data }) => {
                        return (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => {
                                    this.props.navigation.navigate('PatreDetail', {
                                        profile: item,
                                    });
                                }}
                            >
                                <Text>{item.fullName}</Text>
                                <Ionicons name="ios-arrow-forward" size={23} color={Colors.primaryColor} />
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        );
    }
}

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
});

export default SearchScreen;
