import {View, Text} from 'react-native';
import React from 'react';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import {useNavigation} from '@react-navigation/native';
import BackButton from '../../../Components/Common/backButton';
import {styles} from './Styles/styles';
import * as SVGS from '../../../Assets/svgs';
import CustomButton from '../../../Components/Common/customButton';
import {COLORS, FONTS} from '../../../Constants';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
const SignUpSuccess = ({route}) => {
  const navigation = useNavigation();
  const params = route.params;
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
      {/* <BackButton
        onPress={() => navigation.goBack()}
        style={{
          ...GeneralStyles.backButton,
          backgroundColor: state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.WHITE,
        }}
      /> */}
      <View style={styles.parentConatiner}>
        <Text
          style={[
            styles.profileTxt,
            {
              color: state?.darkTheme ? COLORS.WHITE : COLORS.BLACK,
            },
          ]}>
          {t('success')}
        </Text>
        <SVGS.success style={{marginTop: HEIGHT_BASE_RATIO(65)}} />
        <Text
          style={[
            styles.infoTxt,
            {
              color: state?.darkTheme ? COLORS.WHITE : COLORS.BLACK,
            },
          ]}>
          {params?.text ? params?.text : t('account_success')}
        </Text>
        <CustomButton
          backgroundColor={COLORS.Brown}
          width={WIDTH_BASE_RATIO(328)}
          height={HEIGHT_BASE_RATIO(60)}
          borderRadius={12}
          boderColor={COLORS.Brown}
          marginTop={HEIGHT_BASE_RATIO(120)}
          onPress={() => {
            navigation.navigate('BottomTabBar');
          }}
          text={params?.btnTxt ? params?.btnTxt : t('proceed')}
          textStyle={{
            ...FONTS.AvenirMedium_16_black,
            color: COLORS.WHITE,
          }}
        />
      </View>
    </View>
  );
};

export default SignUpSuccess;
