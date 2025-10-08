import {View, Text, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import i18next from '../../../services/i18next';
import {useTranslation} from 'react-i18next';
import {COLORS, FONTS} from '../../Constants';
import {useDispatch, useSelector} from 'react-redux';
import {AuthSlice} from '../../Redux/slice';

const LangChanger = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const changeLanguage = lng => {
    i18next.changeLanguage(lng);
    dispatch(AuthSlice.actions.setLanguage(lng));
  };
  const state = useSelector(state => state.auth);
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity
        onPress={() => {
          changeLanguage('en');
        }}
        style={{
          ...GeneralStyles.langButton,
          backgroundColor:
            i18next.language == 'en'
              ? COLORS.Brown
              : state.darkTheme
              ? COLORS.DARK
              : COLORS.WHITE,
        }}>
        <Text
          style={{
            ...FONTS.JakartaSans_Bold_14,
            color:
              i18next.language == 'en'
                ? COLORS.WHITE
                : state.darkTheme
                ? COLORS.WHITE
                : COLORS.DARK,
          }}>
          English
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          changeLanguage('ar');
        }}
        style={{
          ...GeneralStyles.langButton,
          backgroundColor:
            i18next.language == 'ar'
              ? COLORS.Brown
              : state.darkTheme
              ? COLORS.DARK
              : COLORS.WHITE,
        }}>
        <Text
          style={{
            ...FONTS.JakartaSans_Bold_14,
            color:
              i18next.language == 'ar'
                ? COLORS.WHITE
                : state.darkTheme
                ? COLORS.WHITE
                : COLORS.DARK,
          }}>
          Arabic
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LangChanger;
