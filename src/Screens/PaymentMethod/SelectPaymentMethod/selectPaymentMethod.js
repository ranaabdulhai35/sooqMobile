import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';
import {COLORS, FONTS} from '../../../Constants';
import {useSelector} from 'react-redux';
import Header from '../../../Components/Common/header';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import * as SVGS from '../../../Assets/svgs/index';
import {useNavigation} from '@react-navigation/native';
import SelectCircle from '../../../Components/Common/selectCircle';
import styles from './Styles/styles';
import CustomButton from '../../../Components/Common/customButton';
import {useTranslation} from 'react-i18next';
const SelectPaymentMethod = () => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const {t} = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('Gpay');
  const handlePaymentMethod = item => {
    setPaymentMethod(item);
  };
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
        rightIcon={<View style={{width: WIDTH_BASE_RATIO(10)}}></View>}
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
        <View style={styles.methodsContainer}>
          <TouchableOpacity
            style={[
              styles.method,
              {
                borderColor: state.darkTheme
                  ? COLORS.DARK_BTN_BG
                  : COLORS.LightBrown,
              },
            ]}
            onPress={() => {
              setPaymentMethod('applePay');
            }}>
            <SelectCircle
              method={'applePay'}
              selected={paymentMethod == 'applePay' ? true : false}
              handleSelect={handlePaymentMethod}
            />
            {state.darkTheme ? <SVGS.applePayWhite /> : <SVGS.applePay />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.method,
              {
                borderColor: state.darkTheme
                  ? COLORS.DARK_BTN_BG
                  : COLORS.LightBrown,
              },
            ]}
            onPress={() => {
              setPaymentMethod('Gpay');
            }}>
            <SelectCircle
              method={'Gpay'}
              selected={paymentMethod == 'Gpay' ? true : false}
              handleSelect={handlePaymentMethod}
            />
            <SVGS.googlePay />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.visaMethod,
            {
              borderColor: state.darkTheme
                ? COLORS.DARK_BTN_BG
                : COLORS.LightBrown,
            },
          ]}
          onPress={() => {
            setPaymentMethod('Cash');
          }}>
          <SelectCircle
            method={'Cash'}
            selected={paymentMethod == 'Cash' ? true : false}
            handleSelect={handlePaymentMethod}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: WIDTH_BASE_RATIO(16),
            }}>
            <SVGS.visa />
            <Text
              style={{
                ...FONTS.JakartaSansMedium_14,
                color: state.darkTheme ? COLORS.WHITE : COLORS.BLACK,
                marginLeft: WIDTH_BASE_RATIO(16),
              }}>
              XXXX XXXX XXXX 5232
            </Text>
          </View>
        </TouchableOpacity>
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
          onPress={() => {
            navigation.navigate('AddCardDetaills');
          }}
        />
      </View>
    </View>
  );
};

export default SelectPaymentMethod;
