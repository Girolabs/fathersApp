import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Platform,
    TouchableNativeFeedback,
} from 'react-native';
import PatreDetail from './PatreDetailScreen';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import { Ionicons } from 'expo-vector-icons';
import Colors from '../constants/Colors';
import Constants from 'expo-constants';
import axios from 'axios';

import moment from 'moment';
import 'moment/min/locales';

/* import 'moment/min/locales'; */
import * as Localization from 'expo-localization';

const HomeScreen = ({ navigation }) => {
    const [reminders, setReminders] = useState([]);
    const [selectedReminder, setSelectedReminder] = useState(null);

    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableComp = TouchableNativeFeedback;
    }

    useEffect(() => {
        axios
            .get(
                `https://schoenstatt-fathers.link/en/api/v1/date-tiles?daysInAdvance=8&key=${Constants.manifest.extra.secretKey}`,
            )
            .then((res) => {
                console.log(res.data.result);
                const fetchedReminders = res.data.result;
                console.log('fetched', fetchedReminders);
                setReminders(fetchedReminders);
                console.log('reminder', reminders);
            });
    }, []);
    console.log('render: HomeScreen');
    return (
        <View style={styles.screen}>
            <TouchableComp>
                <View style={styles.prayerCard}>
                    <Text style={styles.prayerCardTitle}>Oracion de la comunidad</Text>
                    <Ionicons name="ios-arrow-forward" size={23} color={Colors.primaryColor} />
                </View>
            </TouchableComp>

            <Text style={styles.title}>Recordatorios</Text>

            <FlatList
                data={reminders}
                renderItem={({ item, index }) => {
                    moment.locale('es');

                    let date = moment(item[0].date).format('dddd,  Do MMMM YYYY');
                    return (
                        <View>
                            {item[0].isImportant ? (
                                <TouchableComp style={{ flex: 1, marginBottom: 15 }}>
                                    <View style={styles.reminderImportantHeader}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Ionicons
                                                name="ios-calendar"
                                                size={23}
                                                color={Colors.surfaceColorPrimary}
                                            />
                                            <Text style={styles.reminderHeaderTitle}>{date}</Text>
                                        </View>
                                        {selectedReminder == index ? (
                                            <Ionicons
                                                name="md-arrow-dropup"
                                                size={23}
                                                color={Colors.surfaceColorPrimary}
                                            />
                                        ) : (
                                            <Ionicons
                                                name="md-arrow-dropdown"
                                                size={23}
                                                color={Colors.surfaceColorPrimary}
                                            />
                                        )}
                                    </View>
                                </TouchableComp>
                            ) : (
                                <TouchableComp
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                        if (selectedReminder == null) {
                                            setSelectedReminder(index);
                                        } else if (selectedReminder == index) {
                                            setSelectedReminder(null);
                                        } else {
                                            setSelectedReminder(index);
                                        }
                                    }}
                                >
                                    <View style={styles.reminderHeader}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Ionicons
                                                name="ios-calendar"
                                                size={23}
                                                color={Colors.surfaceColorPrimary}
                                            />
                                            <Text style={styles.reminderHeaderTitle}>{date}</Text>
                                        </View>

                                        {selectedReminder == index ? (
                                            <Ionicons
                                                name="md-arrow-dropup"
                                                size={23}
                                                color={Colors.surfaceColorPrimary}
                                            />
                                        ) : (
                                            <Ionicons
                                                name="md-arrow-dropdown"
                                                size={23}
                                                color={Colors.surfaceColorPrimary}
                                            />
                                        )}
                                    </View>
                                </TouchableComp>
                            )}
                            {selectedReminder == index && (
                                <FlatList
                                    data={item}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={styles.reminderListItem}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Ionicons
                                                        name="ios-flag"
                                                        size={23}
                                                        color={Colors.onSurfaceColorSecondary}
                                                    />
                                                    <View style={{ marginLeft: 15 }}>
                                                        <Text style={{ fontFamily: 'work-sans', fontSize: 15 }}>
                                                            {item.text}
                                                        </Text>
                                                        <Text
                                                            style={{ fontFamily: 'work-sans-semibold', fontSize: 12 }}
                                                        >
                                                            {item.entityName}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Ionicons
                                                    name="logo-whatsapp"
                                                    size={23}
                                                    color={Colors.onSurfaceColorSecondary}
                                                />
                                            </View>
                                        );
                                    }}
                                />
                            )}
                        </View>
                    );
                }}
            />
        </View>
    );
};

HomeScreen.navigationOptions = (navigationData) => {
    return {
        headerTitle: '',
        headerLeft: (
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
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        padding: 15,
    },
    prayerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.secondaryColor,
        width: '100%',
        height: 80,
        padding: 20,
        borderRadius: 15,
    },
    prayerCardTitle: {
        fontFamily: 'work-sans-semibold',
        fontSize: 18,
        color: Colors.primaryColor,
    },
    title: {
        color: Colors.primaryColor,
        fontFamily: 'work-sans-semibold',
        fontSize: 27,
        marginTop: 20,
        padding: 20,
    },
    reminderHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 20,
        backgroundColor: Colors.primaryColor,
        borderRadius: 15,
        marginTop: 15,
    },
    reminderHeaderTitle: {
        color: Colors.surfaceColorPrimary,
        fontSize: 15,
        marginLeft: 10,
        fontFamily: 'work-sans-medium',
    },
    reminderImportantHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 20,
        backgroundColor: Colors.secondaryColor,
        borderRadius: 15,
        marginTop: 15,
    },
    reminderListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderRadius: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.surfaceColorPrimary,
        backgroundColor: Colors.surfaceColorSecondary,
    },
});

export default HomeScreen;
