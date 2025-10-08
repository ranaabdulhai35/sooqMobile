import {View, Text, Pressable, Alert} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';
import BackButton from '../../../Components/Common/backButton';
import {useNavigation} from '@react-navigation/native';
import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../../Utils/helpers';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {COLORS, FONTS} from '../../../Constants';
import {styles} from './Styles/styles';
import OtpInputs from 'react-native-otp-inputs';
import CustomButton from '../../../Components/Common/customButton';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  useSigninMutation,
  useSignupMutation,
  useVerifyOtpMutation,
} from '../../../Apis/authApiCall';
import {AuthSlice} from '../../../Redux/slice';

const VerifyOTP = ({route}) => {
  const navigation = useNavigation();
  const formikRef = useRef();
  const {emailNumber, screen} = route.params;
  const state = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [signin] = useSigninMutation();
  const [signup] = useSignupMutation();
  const [verifyOtp, {isLoading}] = useVerifyOtpMutation();
  const {t} = useTranslation();
  const [userId, setUserId] = useState(null);
  const senderValidationSchema = Yup.object().shape({
    otp: Yup.string()
      .required('OTP is required')
      .matches(/^\d{4}$/, 'OTP must be exactly 4 digits'),
  });
  const formatPhoneNumber = phoneNumber => {
    phoneNumber = phoneNumber?.toString();

    // Extract the country code by finding the position of the first digit after "+"
    const plusIndex = phoneNumber?.indexOf('+');
    if (plusIndex === -1) {
      throw new Error('Phone number must include a country code with a +');
    }

    // Extract the country code
    const countryCode = phoneNumber?.substring(0, plusIndex + 2); // For example, +1

    // Get the last three digits of the phone number
    const lastThreeDigits = phoneNumber?.slice(-3);

    // Replace the middle part with asterisks
    const maskedPart = '*'.repeat(
      phoneNumber?.length - countryCode?.length - lastThreeDigits?.length,
    );

    // Return the formatted phone number
    return `${countryCode}${maskedPart}${lastThreeDigits}`;
  };
  const handleButtonPress = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
  };
  const verifyOtpFunc = async values => {
    const data = JSON.stringify({
      userId: userId,
      otp: values,
    });
    console.log('values', data);
    const response = await verifyOtp({data});
    if (response.data) {
      console.warn('data', response.data);
      dispatch(AuthSlice.actions.setUser(response.data?.user));
      dispatch(
        AuthSlice.actions.log_in(response.data?.accessToken?.accessToken),
      );
    }
    if (response.error) {
      console.log('error', response.error);
      Alert.alert('Error', response?.error?.data?.message);
    }
  };
  const sendOtpOnNumber = async () => {
    const data = JSON.stringify({phoneNumber: emailNumber});
    console.log('phone data and screen', data, screen);
    const response =
      screen == 'sign in' ? await signin({data}) : await signup({data});
    if (response.data) {
      console.log('response', response.data);
      setUserId(
        screen == 'sign in'
          ? response?.data?.userId
          : response?.data?.newUser?.id,
      );
    }
    if (response.error) {
      if (response.error.status == 400) {
        Alert.alert(response.error.data?.error, response.error.data?.message);
        navigation.goBack();
      }
      console.error('error', response.error);
    }
  };
  useEffect(() => {
    sendOtpOnNumber();
  }, []);
  return (
    <View
      style={[
        GeneralStyles.container,
        GeneralStyles.containerTopPadding,
        state?.darkTheme
          ? {backgroundColor: COLORS.DARK}
          : {backgroundColor: COLORS.WHITE},
      ]}>
      <BackButton
        onPress={() => navigation.goBack()}
        style={{
          ...GeneralStyles.backButton,
          backgroundColor: state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.WHITE,
        }}
      />
      <KeyboardAwareScrollView
        style={{marginTop: HEIGHT_BASE_RATIO(40)}}
        contentContainerStyle={{alignItems: 'center'}}
        scrollEnabled={true}>
        <Text
          style={{
            ...FONTS.JakartaSans_24_Bold,
            color: state?.darkTheme ? COLORS.WHITE : COLORS.BLACK,
            marginTop: HEIGHT_BASE_RATIO(35),
          }}>
          {t('verify_account')}
        </Text>
        <Text style={styles.formattedText}>
          {t('enter_otp')}
          {formatPhoneNumber(emailNumber)}
        </Text>
        <Formik
          innerRef={formikRef}
          validationSchema={senderValidationSchema}
          initialValues={{
            otp: '',
          }}
          onSubmit={async (values, {setSubmitting, resetForm}) => {
            verifyOtpFunc(values.otp);
            // screen == 'sign in'
            //   ? navigation.navigate('HomeStack')
            //   : navigation.navigate('CompleteProfile');
          }}>
          {({handleChange, values, errors, touched}) => (
            <>
              <View style={styles.inputFieldContainer}>
                <OtpInputs
                  numberOfInputs={4}
                  autoFocus={true}
                  cursorColor={COLORS.BLACK}
                  style={styles.OTP}
                  handleChange={handleChange('otp')}
                  keyboardType="phone-pad"
                  defaultValue={values.otp}
                  inputStyles={[
                    styles.otpInputStyle,
                    {
                      backgroundColor: 'transparent',
                      borderBottomColor: state?.darkTheme
                        ? COLORS.WHITE
                        : COLORS.BLACK,
                      color: state?.darkTheme ? COLORS.WHITE : COLORS.BLACK,
                    },
                  ]}
                  textAlign="center"
                />
                {touched.otp && errors.otp && (
                  <View
                    style={{
                      ...GeneralStyles.errorStyle,
                      alignSelf: 'center',
                      marginTop: HEIGHT_BASE_RATIO(10),
                      width: '100%',
                    }}>
                    <Text
                      style={[
                        FONTS.AvenirMedium_16_black,
                        {
                          color: COLORS.RED,
                        },
                      ]}>
                      {errors.otp}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
        </Formik>

        <Text
          style={{
            ...FONTS.JakartaSansLight_14_Gray,
            marginTop: HEIGHT_BASE_RATIO(54),
          }}>
          {t("didn't recieve")}
        </Text>
        <Pressable onPress={() => sendOtpOnNumber()}>
          <Text style={styles.resendButton}>{t('resend_code')}</Text>
        </Pressable>
        <CustomButton
          backgroundColor={COLORS.Brown}
          width={WIDTH_BASE_RATIO(358)}
          height={HEIGHT_BASE_RATIO(60)}
          borderRadius={12}
          boderColor={COLORS.Brown}
          marginTop={HEIGHT_BASE_RATIO(160)}
          load={isLoading}
          onPress={() => {
            handleButtonPress();
          }}
          text={t('proceed')}
          textStyle={{
            ...FONTS.AvenirMedium_16_black,
            color: COLORS.WHITE,
          }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default VerifyOTP;
