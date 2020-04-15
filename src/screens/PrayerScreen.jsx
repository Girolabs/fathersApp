import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PrayersScreen from './PrayersScreen';
import  Colors  from '../constants/Colors';

const PrayerScreen = ({ navigation }) => {
    const pray = navigation.getParam('pray');
    return (
        <View style={styles.screen}>
            <ScrollView>
                <Text style={styles.title}>{pray.title}</Text>
                <Text style={styles.body}>{pray.data}</Text>
            </ScrollView>
        </View>
    );
};

PrayerScreen.navigationOptions = (navigationData) => {
    const pray = navigationData.navigation.getParam('pray');
    return {
        headerTitle: pray.title,
    }
}

const styles = StyleSheet.create({
    screen: {
        padding: 15,
        backgroundColor: Colors.surfaceColorPrimary,
    },
    title: {
        fontSize: 18,
        color: Colors.primaryColor,
        fontFamily:'work-sans-semibold'
    },
    body: {
        fontSize: 15,
        fontFamily:'work-sans'

    },
});

export default PrayerScreen;
