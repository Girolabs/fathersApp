import React from 'react';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import PatreDetailScreen from '../screens/PatreDetailScreen';
import SearchScreen from '../screens/SearchScreen';
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
import FatherFormScreen from '../screens/FatherFormScreen';
import LivingSituationsFormScreen from '../screens/LivingSituations';
import BulletinScreen from '../screens/BulletinScreen';
import BulletinDetailScreen from '../screens/BulletinDetailScreen';
import IdealStatementDetail from '../components/IdealStatementDetail';
import GalleryScreen from '../screens/GalleryScreen';
import AssignmentsFormScreen from '../screens/AssignmentsFormScreen';
import ArchivedScreen from '../screens/ArchivedScreen';
import ArchiveScreen from '../screens/ArchiveScreen';

const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Colors.surfaceColorPrimary,
  },
  headerTitleStyle: {
    fontFamily: 'work-sans-semibold',
  },
  headerBackTitleStyle: {
    fontFamily: 'work-sans',
  },
  headerTintColor: Colors.onSurfaceColorPrimary,
};

/*const BulletinNavigator = createStackNavigator({
  screen: BulletinScreen,
  BulletinDetail: {
    screen: BulletinDetailScreen,
  }
});*/

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
    FatherForm: {
      screen: FatherFormScreen,
    },
    Bulletin: {
      screen: BulletinScreen,
    },
    BulletinDetail: {
      screen: BulletinDetailScreen,
    },
    Archived: {
      screen: ArchivedScreen,
    },
    Edit: {
      screen: ArchiveScreen,
    },
    LivingSituationForm: {
      screen: LivingSituationsFormScreen,
    },
    IdealStatementDetail: {
      screen: IdealStatementDetail,
    },
    Gallery: {
      screen: GalleryScreen,
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
    FatherForm: {
      screen: FatherFormScreen,
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
    LivingSituationForm: {
      screen: LivingSituationsFormScreen,
    },
    IdealStatementDetail: {
      screen: IdealStatementDetail,
    },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  },
);

const ProfileNavigator = createStackNavigator(
  {
    screen: FatherFormScreen,
    LivingSituationForm: {
      screen: LivingSituationsFormScreen,
    },
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
    FatherForm: {
      screen: FatherFormScreen,
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
    LivingSituationForm: {
      screen: LivingSituationsFormScreen,
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
  PatreDetail: {
    screen: PatreDetailScreen,
  },
  FatherForm: {
    screen: FatherFormScreen,
  },
  LivingSituationForm: {
    screen: LivingSituationsFormScreen,
  },
  IdealStatementDetail: {
    screen: IdealStatementDetail,
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
  FatherForm: {
    screen: FatherFormScreen,
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

const GalleryNavigator = createStackNavigator(
  {
    Gallery: {
      screen: GalleryScreen,
    },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  },
);

const AssigmentsFormScreenNavigator = createStackNavigator(
  {
    AssigmentsForm: {
      screen: AssignmentsFormScreen,
    },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  },
);

const DrawerNavigator = createDrawerNavigator(
  {
    HomeSearch: {
      screen: HomeNavigator,
      navigationOptions: {
        drawerLabel: i18n.t('GENERAL.HOME'),
      },
    },
    Search: {
      screen: SearchNavigator,
      navigationOptions: {
        drawerLabel: i18n.t('GENERAL.SEARCH'),
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
    AssigmentsForm: {
      screen: AssigmentsFormScreenNavigator,
      navigationOptions: {
        drawerLabel: i18n.t('GENERAL.SETTINGS'),
      },
    },
    Gallery: {
      screen: GalleryNavigator,
      navigationOptions: {
        drawerLabel: i18n.t('GENERAL.SETTINGS'),
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
    drawerPosition: 'right',
  },
);

const AuthNavigator = createStackNavigator({
  Auth: AuthScreen,
});

const MainNavigator = createSwitchNavigator({
  Startup: {
    screen: StartupScreen,
  },
  Auth: AuthNavigator,
  Drawer: DrawerNavigator,
});

export default createAppContainer(MainNavigator);
