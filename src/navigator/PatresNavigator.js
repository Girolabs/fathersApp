import React from 'react';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import { SafeAreaView, Image, View, Text } from 'react-native';
import { createDrawerNavigator, DrawerItems, DrawerNavigatorItems } from 'react-navigation-drawer';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import PatreDetailScreen from '../screens/PatreDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import PrayersScreen from '../screens/PrayersScreen';
import PrayerScreen from '../screens/PrayerScreen';
import CommunityScreen from '../screens/CommunityScreen';
import FiliationDetailScreen from '../screens/FiliationDetailScreen';
import DelegationDetailScreen from '../screens/DelegationDetailScreen';
import HouseDetailScreen from '../screens/HouseDetailScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import GenerationDetailScreen from '../screens/GenerationDetailScreen';
import FreeCommunityScreen from '../screens/FreeCommunityScreen';
import AssignmentsScreen from '../screens/AssignmentsScreen';
import AuthScreen from '../screens/AuthScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StartupScreen from '../screens/StartupScreen';
import DefaultDrawer from '../components/DefaultDrawer';

const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Colors.surfaceColorPrimary,
  },
  headerTitleStyle: {
    fontFamily: 'work-sans-semibold',
  },
  headerBackTitle: {
    fontFamily: 'work-sans',
  },
  headerTintColor: Colors.onSurfaceColorPrimary,
};

const HomeNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerTitle: '',
      },
    },
    PatreDetail: {
      screen: PatreDetailScreen,
    },
    Prayers: {
      screen: PrayersScreen,
    },
    Prayer: {
      screen: PrayerScreen,
    },
    FiliationDetail: {
      screen: FiliationDetailScreen,
    },
    DelegationDetail: {
      screen: DelegationDetailScreen,
    },
    GenerationDetail: {
      screen: GenerationDetailScreen,
    },
    HouseDetail: {
      screen: HouseDetailScreen,
    },
    CourseDetail: {
      screen: CourseDetailScreen,
    },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  },
);

const SearchNavigator = createStackNavigator(
  {
    Search: {
      screen: SearchScreen,
    },
    PatreDetail: {
      screen: PatreDetailScreen,
    },
    FiliationDetail: {
      screen: FiliationDetailScreen,
    },
    DelegationDetail: {
      screen: DelegationDetailScreen,
    },
    GenerationDetail: {
      screen: GenerationDetailScreen,
    },
    HouseDetail: {
      screen: HouseDetailScreen,
    },
    CourseDetail: {
      screen: CourseDetailScreen,
    },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  },
);

const tabScreenConfig = {
  Home: {
    screen: HomeNavigator,
    navigationOptions: (navigationData) => {
      return {
        tabBarLabel: '',
        tabBarIcon: (tabInfo) => {
        console.log(tabInfo);
        return <Ionicons name="ios-home" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.surfaceColorPrimary,
      }
    }
  },
  Search: {
    screen: SearchNavigator,
    navigationOptions: {
        tabBarLabel: '',
        tabBarIcon: (tabInfo) => <Ionicons name="ios-search" size={25} color={tabInfo.tintColor} />,
        tabBarColor: Colors.secondaryColor,
      
    }
  }
};

const HomeSearchTabNavigator = createMaterialBottomTabNavigator(tabScreenConfig, {
  activeColor: Colors.primaryColor,
  labeled: false,
  shifting: true,
  barStyle: {
    backgroundColor: Colors.surfaceColorPrimary,
  },
});
const ProfileNavigator = createStackNavigator(
  {
    screen: PatreDetailScreen,
  },
  {
    navigationOptions: {},
    defaultNavigationOptions: defaultStackNavOptions,
  },
);

const CommunityNavigator = createStackNavigator(
  {
    Comunidad: {
      screen: CommunityScreen,
      navigationOptions: {
        headerTitle: '',
      },
    },
    FiliationDetail: {
      screen: FiliationDetailScreen,
    },
    DelegationDetail: {
      screen: DelegationDetailScreen,
    },
    PatreDetail: {
      screen: PatreDetailScreen,
    },
    GenerationDetail: {
      screen: GenerationDetailScreen,
    },
    HouseDetail: {
      screen: HouseDetailScreen,
    },
    CourseDetail: {
      screen: CourseDetailScreen,
    },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  },
);

const FreeCommunityNavigator = createStackNavigator({
  FreeCommunity: {
    screen: FreeCommunityScreen,
    navigationOptions: {
      headerTitle: '',
    },
  },
  GenerationDetail: {
    screen: GenerationDetailScreen,
  },
  CourseDetail: {
    screen: CourseDetailScreen,
  },
});

const AssignmentsNavigator = createStackNavigator({
  Assignments: {
    screen: AssignmentsScreen,
   
  },
  CourseDetail: {
    screen: CourseDetailScreen,
  },
  PatreDetail: {
    screen: PatreDetailScreen,
  },
  GenerationDetail: {
    screen: GenerationDetailScreen,
  },
  DelegationDetail: {
    screen: DelegationDetailScreen,
  },
  FiliationDetail: {
    screen: FiliationDetailScreen,
  },
});

const SettingsNavigator = createStackNavigator(
  {
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  },
);

const DrawerNavigator = () =>{
  console.log('Render DrawerNavigator')
  return createDrawerNavigator(
    {
      HomeSearch: {
        screen: HomeSearchTabNavigator,
        navigationOptions: {
          drawerLabel: i18n.t('GENERAL.HOME'),
        },
      },
      Profile: {
        screen: ProfileNavigator,
        navigationOptions: {
          drawerLabel: i18n.t('GENERAL.PROFILE'),
        },
      },
      Community: {
        screen: CommunityNavigator,
        navigationOptions: {
          drawerLabel: i18n.t('GENERAL.GENERAL_COMMUNITY'),
        },
      },
      FreeCommunity: {
        screen: FreeCommunityNavigator,
        navigationOptions: {
          drawerLabel: i18n.t('GENERAL.FREE_COMMUNITY'),
        },
      },
      Assignments: {
        screen: AssignmentsNavigator,
        navigationOptions: {
          drawerLabel: i18n.t('GENERAL.ASSIGNMENTS'),
        },
      },
      Settings: {
        screen: SettingsNavigator,
        navigationOptions: {
          drawerLabel: i18n.t('GENERAL.SETTINGS'),
        },
      },
    },
    {
      contentComponent: (props) => <DefaultDrawer {...props} />,
      drawerBackgroundColor: Colors.primaryColor,
      contentOptions: {
        activeTintColor: Colors.secondaryColor,
        inactiveTintColor: Colors.surfaceColorPrimary,
        labelStyle: {
          fontFamily: 'work-sans-semibold',
          fontSize: 18,
        },
      },
    },
  )


};

const AuthNavigator = createStackNavigator({
  Auth: AuthScreen,
});


const MainNavigator = () => (createSwitchNavigator({
  Startup:{
    screen:StartupScreen,
  },
  Auth: AuthNavigator,
  Drawer: DrawerNavigator(),
}));

export default createAppContainer(MainNavigator());

