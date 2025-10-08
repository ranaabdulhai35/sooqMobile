import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../BusinessLogics/Constants';
import * as images from '../../Ui/Assets/Images/index';
import * as SVGS from '../../Ui/Assets/DrawerSvgs/index';
import {FONTS} from '../../BusinessLogics/Constants';
import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../BusinessLogics/Utils/helpers';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {AuthSlice} from '../../BusinessLogics/Redux/store';
import {FontFamily} from '../Global/generalFonts';
import {Svg} from 'react-native-svg';
import {GeneralStyles} from '../Global/generalStyles';

const Drawer = ({active, drawerWidth, drawerTranslateX, handleColor}) => {
  // const Screens = useSelector(state => state?.auth?.customer?.menu);
  // const currentScreen = useSelector(state => state?.auth?.currentScreen);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: drawerTranslateX.value}],
    };
  });
  useAnimatedReaction(
    () => active.value,
    currentState => {
      if (currentState) {
        drawerTranslateX.value = withTiming(0);
      } else {
        drawerTranslateX.value = withTiming(-drawerWidth.value);
      }
    },
  );
  const backDrop = useAnimatedStyle(() => {
    const opacity = interpolate(
      drawerTranslateX.value,
      [-drawerWidth.value, 0],
      [0, 0.4],
      Extrapolate.CLAMP,
    );
    return {
      opacity: opacity,
      zIndex: drawerTranslateX.value === -drawerWidth.value ? 0 : 1,
    };
  });
  const pan = Gesture.Pan()
    .onChange(event => {
      if (event.translationX < 0) {
        drawerTranslateX.value = withSpring(event.translationX, {
          damping: 100,
          stiffness: 400,
        });
      } else {
        drawerTranslateX.value = withSpring(0, {
          damping: 100,
          stiffness: 400,
        });
      }
    })
    .onEnd(event => {
      if (event.velocityX < -1000) {
        drawerTranslateX.value = withTiming(
          -drawerWidth.value,
          undefined,
          () => {
            active.value = false;
          },
          // handleColor(COLORS.WHITE),
        );
      }
      if (event.translationX < -drawerWidth.value / 2) {
        drawerTranslateX.value = withTiming(
          -drawerWidth.value,
          undefined,
          () => {
            active.value = false;
          },
          // handleColor(COLORS.WHITE),
        );
      } else {
        drawerTranslateX.value = withTiming(0);
        handleColor(COLORS.WHITE);
      }
    });
  const menuOptions = [
    {
      name: 'My Account',
      icon: <SVGS.Account />,
      onPress: '',
    },
    {
      name: 'History',
      icon: <SVGS.History />,
      onPress: '',
    },
    {
      name: 'Billinng & Payment',
      icon: <SVGS.CardIcon />,
      onPress: '',
    },
    {
      name: 'Transaction History',
      icon: <SVGS.Wallet2 />,
      onPress: 'TransactionHistory',
    },
    {
      name: 'All Contracts',
      icon: <SVGS.AllConntracts />,
      onPress: 'AllContracts',
    },
  ];
  const moreMenuOptions = [
    {name: 'Blog', icon: <SVGS.AllConntracts />},
    {name: 'Workshop', icon: <SVGS.WorkShop />},
    {name: 'Help', icon: <SVGS.Help />},
    {name: 'FAQ', icon: <SVGS.FAQ />},
    {name: 'Privacy Policy', icon: <SVGS.Lock />},
    {name: 'Settings', icon: <SVGS.Setting2 />},
    {name: 'Log Out', icon: <SVGS.LogOut />},
  ];
  return (
    <>
      {/* <GestureDetector gesture={pan}> */}
      <Animated.View
        style={[styles.container, AnimatedStyle]}
        onLayout={e => {
          drawerWidth.value = e.nativeEvent.layout.width;
          drawerTranslateX.value = -e.nativeEvent.layout.width;
        }}>
        <View
          style={{
            width: '100%',
            height: HEIGHT_BASE_RATIO(150),
            backgroundColor: '#EA5B2C',
            overflow: 'hidden',
            paddingLeft: WIDTH_BASE_RATIO(20),
            paddingRight: WIDTH_BASE_RATIO(20),
            paddingTop: HEIGHT_BASE_RATIO(20),
            paddingBottom: HEIGHT_BASE_RATIO(20),
            marginTop: HEIGHT_BASE_RATIO(20),
          }}>
          <Pressable
            onPress={() => {
              active.value = false;
              handleColor(COLORS.WHITE);
            }}>
            <SVGS.ArrwoLeftWhite />
          </Pressable>
          <View
            style={{
              width: '100%',
              overflow: 'hidden',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: HEIGHT_BASE_RATIO(15),
            }}>
            <View
              style={{
                overflow: 'hidden',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={images.profilePicture}
                style={{
                  width: WIDTH_BASE_RATIO(71),
                  height: HEIGHT_BASE_RATIO(74),
                }}
              />
              <View style={{marginLeft: WIDTH_BASE_RATIO(15)}}>
                <Text
                  style={{
                    ...FONTS.TTMedium_16_Black,
                    fontSize: FONT_SIZE(20),
                    color: COLORS.WHITE,
                    fontFamily: FontFamily.Bold,
                  }}>
                  James John
                </Text>
                <Text
                  style={{
                    ...FONTS.TTSmall_12_Black,
                    color: COLORS.WHITE,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Animation Voice actress
                </Text>
              </View>
            </View>
            <Pressable style={{marginTop: HEIGHT_BASE_RATIO(10)}}>
              <SVGS.Ring />
            </Pressable>
          </View>
        </View>
        <View style={{paddingHorizontal: WIDTH_BASE_RATIO(20)}}>
          <Text
            style={{
              ...FONTS.TTMedium_16_Black,
              fontFamily: FontFamily.Bold,
              marginTop: HEIGHT_BASE_RATIO(25),
              marginBottom: HEIGHT_BASE_RATIO(2),
            }}>
            General
          </Text>
          {menuOptions.map(item => {
            return (
              <TouchableOpacity
                onPress={() => {
                  active.value = false;
                  handleColor(COLORS.WHITE);
                  navigation.navigate(item?.onPress);
                }}
                style={{
                  ...styles?.item,
                  backgroundColor: COLORS.WHITE,
                  marginTop: HEIGHT_BASE_RATIO(23),
                }}>
                {item?.icon}

                <Text style={styles?.itemText}>{item?.name}</Text>
              </TouchableOpacity>
            );
          })}
          <View
            style={{
              ...GeneralStyles.line,
              width: WIDTH_BASE_RATIO(351),
              marginTop: HEIGHT_BASE_RATIO(20),
              height: 1,
            }}></View>
          <Text
            style={{
              ...FONTS.TTMedium_16_Black,
              fontFamily: FontFamily.Bold,
              marginTop: HEIGHT_BASE_RATIO(20),
              marginBottom: HEIGHT_BASE_RATIO(2),
            }}>
            More
          </Text>
          {moreMenuOptions.map(item => {
            return (
              <TouchableOpacity
                onPress={() => {
                  active.value = false;
                  handleColor(COLORS.WHITE);
                  if (item?.name === 'Log Out') {
                    dispatch(AuthSlice.actions.log_out());
                    navigation.navigate('AuthNavigator');
                  }
                }}
                style={{
                  ...styles?.item,
                  backgroundColor: COLORS.WHITE,
                  marginTop: HEIGHT_BASE_RATIO(23),
                }}>
                {item?.icon}

                <Text
                  style={{
                    ...styles?.itemText,
                    color:
                      item?.name === 'Log Out' ? COLORS.PRIMARY : COLORS.BLACK,
                  }}>
                  {item?.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
      {/* </GestureDetector> */}
      {/* <AnimatedPressable
        style={[styles.backDrop, backDrop]}
        onPress={() => {
          active.value = false;
        }}
      /> */}
    </>
  );
};

export default Drawer;
const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 1,
    opacity: 0.4,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    backgroundColor: COLORS.WHITE,
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    // width:'100%'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    ...FONTS.TTNormal_14_Black,
    fontFamily: FontFamily.Medium,
    marginLeft: WIDTH_BASE_RATIO(6),
  },
});
