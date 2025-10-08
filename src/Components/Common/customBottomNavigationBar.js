import {View, Text, Pressable} from 'react-native';
import React from 'react';
import * as SVGS from '../../Ui/Assets/Svgs/index';

import {
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../BusinessLogics/Utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {AuthSlice} from '../../BusinessLogics/Redux/store';
import { COLORS } from '../../Constants';

const CustomBottomNavigationBar = ({active}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: COLORS.WHITE,
        height: HEIGHT_BASE_RATIO(59.5),
        paddingHorizontal: WIDTH_BASE_RATIO(30),
      }}>
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          active.value = true;
        }}>
        <SVGS.MenuBlack />
        <Text
          style={{
            // color: focused ? COLORS.BLUE : COLORS.GRAY_3,
            color: COLORS.GRAY_3,
            ...FONTS.PoppinsNormal_14_Black,
            marginLeft: 10,
            lineHeight: 55,
          }}>
          Menu
        </Text>
      </Pressable>
      <Pressable
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          top: -20,
        }}
        onPress={() => {
          navigation.navigate('Home');
          dispatch(AuthSlice.actions.setCurrentScreen('Home'));
        }}>
        <View
          style={{
            width: 74,
            height: 74,
            borderRadius: 37,
            backgroundColor: COLORS.BLUE,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 5,
            zIndex: 1,
            position: 'absolute',
          }}>
          <SVGS.Home />
          <Text
            style={{
              ...FONTS.PoppinsNormal_14_Black,
              color: COLORS.WHITE,
              fontFamily: 'Poppins-Medium',
              marginTop: 2,
            }}>
            Home
          </Text>
        </View>
        <View
          style={{
            top: 2,
          }}>
          <SVGS.CircleBackgroundCurve />
        </View>
      </Pressable>
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          navigation?.getState()?.routes?.length == 1
            ? console.log('nothing')
            : navigation.goBack();

          console.log(navigation.getState().routes);
          navigation?.getState()?.routes?.length > 1
            ? dispatch(
                AuthSlice.actions.setCurrentScreen(
                  navigation?.getState()?.routes[
                    navigation?.getState()?.routes.length - 2
                  ]?.name,
                ),
              )
            : dispatch(
                AuthSlice.actions.setCurrentScreen(
                  navigation?.getState()?.routes[0]?.name,
                ),
              );
          console.log(
            navigation?.getState()?.routes[
              navigation?.getState()?.routes.length - 2
            ]?.name
          );
        }}>
        <SVGS.Goback />
        <Text
          style={{
            // color: focused ? COLORS.BLUE : COLORS.GRAY_3,
            color: COLORS.GRAY_3,
            ...FONTS.PoppinsNormal_14_Black,
            marginLeft: 10,
            lineHeight: 55,
          }}>
          Back
        </Text>
      </Pressable>
    </View>
  );
};

export default CustomBottomNavigationBar;
