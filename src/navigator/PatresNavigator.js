import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';
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
import PhotosScreen from '../screens/PhotosScreen';
import PhotoScreen from '../screens/PhotoScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
  headerBackTitle: i18n.t('GENERAL.BACK')
};

const HomeNavigator = () => (
  <Stack.Navigator screenOptions={defaultStackNavOptions}>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton />, headerLeft: '' }}
    />
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="Bulletin"
      component={BulletinScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="BulletinDetail"
      component={BulletinDetailScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="Archived"
      component={ArchivedScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="Edit"
      component={ArchiveScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="Community"
      component={CommunityScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="FreeCommunity"
      component={FreeCommunityScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="Assignments"
      component={AssignmentsScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="Gallery"
      component={GalleryScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="PatreDetail"
      component={PatreDetailScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="FiliationDetail"
      component={FiliationDetailScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="DelegationDetail"
      component={DelegationDetailScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="GenerationDetail"
      component={GenerationDetailScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="HouseDetail"
      component={HouseDetailScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="CourseDetail"
      component={CourseDetailScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="FatherForm"
      component={FatherFormScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />

    <Stack.Screen
      name="LivingSituationForm"
      component={LivingSituationsFormScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="IdealStatementDetail"
      component={IdealStatementDetail}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="Photos"
      component={PhotosScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="Photo"
      component={PhotoScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
    <Stack.Screen
      name="AssignmentsForm"
      component={AssignmentsFormScreen}
      options={{ headerTitle: '', headerRight: () => <DrawerToggleButton /> }}
    />
  </Stack.Navigator>
);

const activeTintColor = Colors.secondaryColor;
const inactiveTintColor = Colors.surfaceColorPrimary;

const labelStyle = {
  fontFamily: 'work-sans-semibold',
  fontSize: 18,
};

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => (
      <DefaultDrawer
        {...props}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        labelStyle={labelStyle}
      />
    )}
    useLegacyImplementation={false}
    screenOptions={{
      headerShown: false,
      headerLeft: false,
      drawerPosition: 'right',
      drawerStyle: {
        backgroundColor: Colors.primaryColor,
      },
      drawerContentOptions: {
        labelStyle: {
          fontFamily: 'work-sans-semibold',
          fontSize: 18,
        },
      },
    }}
  >
    <Drawer.Screen name="HomeNav" component={HomeNavigator} options={{ drawerLabel: i18n.t('GENERAL.HOME') }} />
  </Drawer.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Startup" component={StartupScreen} />
    <Stack.Screen name="Auth" component={AuthScreen} />
    <Stack.Screen name="Drawer" component={DrawerNavigator} />
  </Stack.Navigator>
);

export default AppNavigator;
