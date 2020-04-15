import React from 'react';

import { createAppContainer } from "react-navigation";
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'

import { Platform, SafeAreaView, Image, View, Text } from "react-native";
import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import PatreDetailScreen from "../screens/PatreDetailScreen";
import SearchScreen from '../screens/SearchScreen';
import PrayersScreen from '../screens/PrayersScreen';
import PrayerScreen from '../screens/PrayerScreen'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';







const defaultStackNavOptions = {
    headerStyle: {
        backgroundColor: Colors.surfaceColorPrimary
    },
    headerTitleStyle: {
        fontFamily: 'work-sans-semibold',
    },
    headerBackTitle: {
        fontFamily: 'work-sans',
    },
    headerTintColor: Colors.onSurfaceColorPrimary,
}



const HomeNavigator = createStackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            headerTitle: '',
        }
    },
    PatreDetail: {
        screen: PatreDetailScreen,
    },
    Prayers: {
        screen: PrayersScreen,
    },
    Prayer: {
        screen: PrayerScreen
    }

}, {
    defaultNavigationOptions: defaultStackNavOptions
});

const SearchNavigator = createStackNavigator({
    Search: {
        screen: SearchScreen
    },
    PatreDetail: {
        screen: PatreDetailScreen
    }
})

const tabScreenConfig = {
    Home: {
        screen: HomeNavigator, navigationOptions: {
            tabBarIcon: (tabInfo) => {
                console.log(tabInfo)
                return <Ionicons name='ios-home' size={25} color={tabInfo.tintColor} />
            },
            tabBarColor: Colors.surfaceColorPrimary,
        }
    },
    Search: {
        screen: SearchNavigator, navigationOptions: {
            tabBarLabel: 'Search',
            tabBarIcon: (tabInfo) => {
                return <Ionicons name='ios-search' size={25} color={tabInfo.tintColor} />
            },
            tabBarColor: Colors.secondaryColor
        }
    }
}

const HomeSearchTabNavigator =
    createMaterialBottomTabNavigator(tabScreenConfig, {
        activeColor: Colors.primaryColor,
        shifting: true,
        barStyle: {
            backgroundColor: Colors.surfaceColorPrimary
        }
    })
const ProfileNavigator = createStackNavigator({
    screen: PatreDetailScreen
}, {
    navigationOptions: {

    },
    defaultNavigationOptions: defaultStackNavOptions
})

const MainNavigator = createDrawerNavigator({
    HomeSearch: {
        screen: HomeSearchTabNavigator,
        navigationOptions: {
            drawerLabel: 'Principal'
        },
    },
    Profile: {
        screen: ProfileNavigator,
        navigationOptions: {
            drawerLabel: 'Profile'
        }
    }

}, {
    contentComponent: props => <DefaultDrawer {...props} />,
    drawerBackgroundColor: Colors.primaryColor,
    contentOptions: {
        activeTintColor: Colors.secondaryColor,
        inactiveTintColor: Colors.surfaceColorPrimary,
        labelStyle: {
            fontFamily: 'work-sans-semibold',
            fontSize: 18
        }


    }


}
)

export default createAppContainer(MainNavigator);

const DefaultDrawer = (props) => {
    console.log('ENTRO ACA')
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity style={{ margin:15,padding: 15 }} onPress={() => {
                props.navigation.toggleDrawer();
            }

            }>
                <Ionicons name='md-close' size={36} color={Colors.surfaceColorPrimary} />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{ justifyContent: 'flex-start',alignItems:'flex-start', height: '100%', padding: 15 }}>


                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                    <Image source={require('../../assets/img/icono.png')} style={{ width: 88, height: 88 }} />
                    <Text numberOfLines={2} style={{ width: '70%', fontSize: 18, fontFamily: 'work-sans', color: 'white', paddingHorizontal: 15 }}>Padres de Schoenstatt</Text>
                </View>

                <DrawerItems {...props} />


            </ScrollView>
        </SafeAreaView>
    )
}