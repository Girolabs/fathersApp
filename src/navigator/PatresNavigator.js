import React from 'react';

import { createAppContainer } from "react-navigation";
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'

import { Platform } from "react-native";
import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import PatreDetailScreen from "../screens/PatreDetailScreen";
import SearchScreen from '../screens/SearchScreen';
import { createDrawerNavigator } from 'react-navigation-drawer';







const defaultStackNavOptions = {
    headerStyle : {
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

},{
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
        screen: SearchNavigator, navigationOptions:{
            tabBarLabel: 'Search',
            tabBarIcon: (tabInfo) => {
                return <Ionicons name = 'ios-search' size={25} color={tabInfo.tintColor} />
            },
            tabBarColor: Colors.secondaryColor
        }
    }
}

const HomeSearchTabNavigator = 
    createMaterialBottomTabNavigator(tabScreenConfig,{
        activeColor:Colors.primaryColor,
        shifting:true,
        barStyle: {
            backgroundColor: Colors.surfaceColorPrimary
        }
    })
const ProfileNavigator = createStackNavigator({
    screen:PatreDetailScreen
},{
    navigationOptions:{

    },
    defaultNavigationOptions:defaultStackNavOptions
})

const MainNavigator = createDrawerNavigator({
    HomeSearch: {
        screen: HomeSearchTabNavigator,
        navigationOptions: {
            drawerLabel: 'Principal'
        },  
    },
    Profile:{
        screen: ProfileNavigator,
        navigationOptions: {
            drawerLabel: 'Profile'
        }
    }

},{
    contentOptions: {
        activeTintColor: Colors.secondaryColor,
        labelStyle: {
            fontFamily:'work-sans-semibold'
        }
    }
}
)

export default createAppContainer(MainNavigator);