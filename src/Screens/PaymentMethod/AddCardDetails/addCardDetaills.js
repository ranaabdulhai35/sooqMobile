import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';
import {COLORS, FONTS} from '../../../Constants';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../Components/Common/header';
import * as SVGS from '../../../Assets/svgs/index';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import CustomInputTitle from '../../../Components/Common/customInputTitle';
import styles from './Styles/styles';
import CustomButton from '../../../Components/Common/customButton';
import {useTranslation} from 'react-i18next';
const AddCardDetaills = () => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const {t} = useTranslation();

  return (
    <View
      style={[
        GeneralStyles.container,
        GeneralStyles.containerTopPadding,
        state?.darkTheme
          ? {backgroundColor: COLORS.DARK}
          : {backgroundColor: COLORS.WHITE},
      ]}>
      <Header
        backgroundColor={state?.darkTheme ? COLORS.DARK : COLORS.WHITE}
        rightIcon={<View style={{width: WIDTH_BASE_RATIO(15)}}></View>}
        leftIcon={state?.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
        screennName={t('paymentMethod')}
        style={{
          paddingBottom: HEIGHT_BASE_RATIO(20),
          borderBottomWidth: 1,
          borderBottomColor: state?.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightBrown,
        }}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
      />
      <View style={GeneralStyles.generalPaddingHomeStack}>
        <CustomInputTitle
          placeholder={t('nameOnCard')}
          borderColor={
            state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
          }
          placeholderColor={COLORS.Gray}
          width={'100%'}
          height={HEIGHT_BASE_RATIO(60)}
          borderRadius={12}
          borderWidth={2}
          marginTop={HEIGHT_BASE_RATIO(16)}
        />
        <CustomInputTitle
          placeholder={t('cardNumber')}
          borderColor={
            state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
          }
          placeholderColor={COLORS.Gray}
          width={'100%'}
          height={HEIGHT_BASE_RATIO(60)}
          borderRadius={12}
          borderWidth={2}
          marginTop={HEIGHT_BASE_RATIO(10)}
        />
        <View style={styles.bottomFieldsContainer}>
          <CustomInputTitle
            placeholder={t('expiry')}
            borderColor={
              state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
            }
            placeholderColor={COLORS.Gray}
            width={WIDTH_BASE_RATIO(175)}
            height={HEIGHT_BASE_RATIO(60)}
            borderRadius={12}
            borderWidth={2}
          />
          <CustomInputTitle
            placeholder={'CVV'}
            borderColor={
              state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
            }
            placeholderColor={COLORS.Gray}
            width={WIDTH_BASE_RATIO(175)}
            height={HEIGHT_BASE_RATIO(60)}
            borderRadius={12}
            borderWidth={2}
          />
        </View>
      </View>
      <View
        style={[
          styles.bottomButtonContainer,
          {backgroundColor: state.darkTheme ? COLORS.DARK : COLORS.WHITE},
        ]}>
        <CustomButton
          backgroundColor={COLORS.Brown}
          width={WIDTH_BASE_RATIO(358)}
          height={HEIGHT_BASE_RATIO(60)}
          borderRadius={12}
          boderColor={COLORS.Brown}
          text={t('addCard')}
          textStyle={{
            ...FONTS.AvenirMedium_16_black,
            color: COLORS.WHITE,
          }}
        />
      </View>
    </View>
  );
};

export default AddCardDetaills;
