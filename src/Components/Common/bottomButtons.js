import {View, Text} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../Constants';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {useSelector} from 'react-redux';
import CustomButton from './customButton';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';

const BottomButtons = ({
  button1Text,
  button2Text,
  button1Onpress,
  button2Onpress,
  isLoadingButton1,
  isLoadingButton2,
}) => {
  const state = useSelector(state => state.auth);

  return (
    <View
      style={{
        ...GeneralStyles.generalPaddingHomeStack,
        flexDirection: state.language == 'ar' ? 'row-reverse' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: HEIGHT_BASE_RATIO(100),
        backgroundColor: state?.darkTheme ? COLORS.DARK : COLORS.WHITE,
      }}>
      <CustomButton
        backgroundColor={
          state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightGray
        }
        width={WIDTH_BASE_RATIO(171)}
        height={HEIGHT_BASE_RATIO(60)}
        borderRadius={10}
        boderColor={state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightGray}
        text={button1Text}
        onPress={button1Onpress}
        textStyle={{
          ...FONTS.JakartaSans_Bold_16,
          color: COLORS.Gray,
        }}
        load={isLoadingButton1}
      />
      <CustomButton
        backgroundColor={COLORS.Brown}
        width={WIDTH_BASE_RATIO(171)}
        height={HEIGHT_BASE_RATIO(60)}
        borderRadius={10}
        boderColor={COLORS.Brown}
        text={button2Text}
        onPress={button2Onpress}
        textStyle={{
          ...FONTS.JakartaSans_Bold_16,
          color: COLORS.WHITE,
        }}
        load={isLoadingButton2}
      />
    </View>
  );
};

export default BottomButtons;
