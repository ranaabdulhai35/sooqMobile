import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import * as SVGS from '../Assets/svgs';
import {
  Image,
  View,
  Text,
  Platform,
  Dimensions,
  useColorScheme,
} from 'react-native';
import {
  DEVICE_HEIGHT,
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../src/Utils/helpers';
import {useSelector} from 'react-redux';
import {COLORS, FONTS} from '../Constants';
import {FontFamily} from '../GeneralStyles/generalFonts';
import HomeScreen from '../Screens/HomeScreen/HomeScreen';
import FavoritesScreen from '../Screens/Favourites/favouritesScreen';
import MyOrdersScreen from '../Screens/MyOrders/MyOrdersScreen';
import CategoriesScreen from '../Screens/Categories/CategoriesScreen';
import VendorsScreen from '../Screens/Vendors/VendorsScreen';
import {useTranslation} from 'react-i18next';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HEIGHT = Dimensions.get('screen').height;

function HomeStackNavigationContainer() {
  return (
    <Stack.Navigator
      initialRouteName={HomeScreen}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardOverlayEnabled: true,
        animationEnabled: false,
        animation: true,
      }}>
      <Stack.Screen name={'HomeScreen'} component={HomeScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

function VendorsStackNavigationContainer() {
  return (
    <Stack.Navigator
      initialRouteName={CategoriesScreen}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardOverlayEnabled: true,
        animationEnabled: false,
        animation: true,
      }}>
      <Stack.Screen
        name={' VendorsScreen'}
        component={VendorsScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

function FavoritesStackNavigationContainer() {
  return (
    <Stack.Navigator
      initialRouteName={FavoritesScreen}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardOverlayEnabled: true,
        animationEnabled: false,
        animation: true,
      }}>
      <Stack.Screen
        name={'FavoritesScreen'}
        component={FavoritesScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

function OrderStackNavigationContainer() {
  return (
    <Stack.Navigator
      initialRouteName={MyOrdersScreen}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardOverlayEnabled: true,
        animationEnabled: false,
        animation: true,
      }}>
      <Stack.Screen
        name={'MyOrdersScreen'}
        component={MyOrdersScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

function MyTabs() {
  const state = useSelector(state => state.auth);
  const {t} = useTranslation();

  return (
    <View
      style={{
        backgroundColor: state.darkTheme ? COLORS.DARK : COLORS.WHITE,
        flex: 1,
      }}>
      <Tab.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
          // tabBarActiveBackgroundColor:COLORS.WHITE,
          tabBarStyle: {
            height: HEIGHT_BASE_RATIO(70),
            width: WIDTH_BASE_RATIO(360),
            alignSelf: 'center',
            backgroundColor: state.darkTheme ? COLORS.DARK : COLORS.WHITE,
            borderRadius: 18,
            borderWidth: 1,
            borderTopWidth: 1,
            borderColor: state.darkTheme ? COLORS.DARK_BTN_BG : COLORS.Brown,
            borderTopColor: state.darkTheme ? COLORS.DARK_BTN_BG : COLORS.Brown,
            // marginBottom: HEIGHT_BASE_RATIO(30),
            marginTop: HEIGHT_BASE_RATIO(20),
            shadowOpacity: 0,
            // paddingHorizontal: WIDTH_BASE_RATIO(5),
            shadowColor: state.darkTheme ? COLORS.DARK : COLORS.WHITE,
          },
        }}>
        <Tab.Screen
          listeners={{
            tabPress: e => {},
          }}
          options={{
            tabBarLabel: ({focused, color, size}) => <></>,
            tabBarItemStyle: {
              height: Platform.OS == 'ios' ? HEIGHT_BASE_RATIO(65) : 'auto',
            },
            tabBarIcon: ({focused}) => (
              <View style={{alignItems: 'center'}}>
                <View
                  style={{
                    borderRadius: 2,
                    backgroundColor: 'transparent',
                  }}
                />

                {focused ? (
                  <SVGS.focusHome />
                ) : state.darkTheme ? (
                  <SVGS.homeWhite />
                ) : (
                  <SVGS.home />
                )}
                <Text
                  style={[
                    {
                      color: focused
                        ? COLORS.Brown
                        : state.darkTheme
                        ? COLORS.WHITE
                        : COLORS.DARK,
                      fontFamily: FontFamily.PlusJakartaSansBold,
                      fontSize: FONT_SIZE(12),
                      marginTop: HEIGHT_BASE_RATIO(5),
                    },
                  ]}>
                  {t('explore')}
                </Text>
              </View>
            ),
          }}
          name="HomeScreen"
          component={HomeStackNavigationContainer}
        />

        <Tab.Screen
          listeners={{
            tabPress: e => {},
          }}
          options={{
            tabBarLabel: ({focused, color, size}) => <></>,
            tabBarItemStyle: {
              height: Platform.OS == 'ios' ? HEIGHT_BASE_RATIO(65) : 'auto',
            },
            tabBarIcon: ({focused}) => (
              <View style={{alignItems: 'center'}}>
                <View
                  style={{
                    borderRadius: 2,
                    backgroundColor: 'transparent',
                  }}
                />

                {focused ? (
                  <SVGS.focusCategory />
                ) : state.darkTheme ? (
                  <SVGS.categoryWhite />
                ) : (
                  <SVGS.category />
                )}
                <Text
                  style={[
                    {
                      color: focused
                        ? COLORS.Brown
                        : state.darkTheme
                        ? COLORS.WHITE
                        : COLORS.DARK,
                      fontFamily: FontFamily.PlusJakartaSansBold,
                      fontSize: FONT_SIZE(12),
                      marginTop: HEIGHT_BASE_RATIO(5),
                    },
                  ]}>
                  {t('vendors')}
                </Text>
              </View>
            ),
          }}
          name="VendorsScreen"
          component={VendorsStackNavigationContainer}
        />

        <Tab.Screen
          listeners={{
            tabPress: e => {},
          }}
          options={{
            tabBarLabel: ({focused, color, size}) => <></>,
            tabBarItemStyle: {
              height: Platform.OS == 'ios' ? HEIGHT_BASE_RATIO(65) : 'auto',
            },
            tabBarIcon: ({focused}) => (
              <View style={{alignItems: 'center'}}>
                <View
                  style={{
                    borderRadius: 2,
                    backgroundColor: 'transparent',
                  }}
                />

                {focused ? (
                  <SVGS.focusHeart />
                ) : state.darkTheme ? (
                  <SVGS.heartWhite />
                ) : (
                  <SVGS.heart />
                )}
                <Text
                  style={[
                    {
                      color: focused
                        ? COLORS.Brown
                        : state.darkTheme
                        ? COLORS.WHITE
                        : COLORS.DARK,
                      fontFamily: FontFamily.PlusJakartaSansBold,
                      fontSize: FONT_SIZE(12),
                      marginTop: HEIGHT_BASE_RATIO(5),
                    },
                  ]}>
                  {t('favorites')}
                </Text>
              </View>
            ),
          }}
          name="FavoritesScreen"
          component={FavoritesStackNavigationContainer}
        />

        <Tab.Screen
          listeners={{
            tabPress: e => {},
          }}
          options={{
            tabBarLabel: ({focused, color, size}) => <></>,
            tabBarItemStyle: {
              height: Platform.OS == 'ios' ? HEIGHT_BASE_RATIO(65) : 'auto',
            },
            tabBarIcon: ({focused}) => (
              <View style={{alignItems: 'center'}}>
                <View
                  style={{
                    borderRadius: 2,
                    backgroundColor: 'transparent',
                    margin: 0,
                  }}
                />

                {focused ? (
                  <SVGS.focusBag />
                ) : state.darkTheme ? (
                  <SVGS.bagWhite />
                ) : (
                  <SVGS.bag />
                )}
                <Text
                  style={[
                    {
                      color: focused
                        ? COLORS.Brown
                        : state.darkTheme
                        ? COLORS.WHITE
                        : COLORS.DARK,
                      fontFamily: FontFamily.PlusJakartaSansBold,
                      fontSize: FONT_SIZE(12),
                      marginTop: HEIGHT_BASE_RATIO(5),
                    },
                  ]}>
                  {t('orders')}
                </Text>
              </View>
            ),
          }}
          name="MyOrdersScreen"
          component={OrderStackNavigationContainer}
        />
      </Tab.Navigator>
    </View>
  );
}
export default MyTabs;
