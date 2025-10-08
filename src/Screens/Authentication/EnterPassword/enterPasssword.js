import {View, Text, Pressable, TouchableOpacity, Alert} from 'react-native';
import React, {useRef, useState} from 'react';
import CustomInputTitle from '../../../Components/Common/customInputTitle';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';
import {COLORS, FONTS} from '../../../Constants';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BackButton from '../../../Components/Common/backButton';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../../Components/Common/customButton';
import {styles} from './Styles/styles';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import HttpRequest from '../../../Requests/axios';
import {AuthSlice} from '../../../Redux/slice';
import {useSigninMutation} from '../../../Apis/authApiCall';

const EnterPasssword = ({route}) => {
  const navigation = useNavigation();
  const formikRef = useRef();
  const state = useSelector(state => state.auth);
  const {email} = route.params;
  const dispatch = useDispatch();
  const [signin, {data, isLoading}] = useSigninMutation();
  const {t} = useTranslation();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const senderValidationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, ({min}) => `"Password must be at least ${min} characters"`)
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Password must include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      ),
  });
  const handleButtonPress = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
  };

  return (
    <>
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
            backgroundColor: state?.darkTheme
              ? COLORS.DARK_BTN_BG
              : COLORS.WHITE,
          }}
        />
        <KeyboardAwareScrollView
          style={{marginTop: HEIGHT_BASE_RATIO(30)}}
          contentContainerStyle={{alignItems: 'center'}}
          scrollEnabled={true}>
          <Text
            style={{
              ...styles.heading,
              color: state?.darkTheme ? COLORS.WHITE : COLORS.BLACK,
            }}>
            {t('enter_password')}
          </Text>

          <Text
            style={{
              ...styles.email,
              color: state?.darkTheme ? COLORS.WHITE : COLORS.BLACK,
            }}>
            {email}
          </Text>

          <Formik
            innerRef={formikRef}
            validationSchema={senderValidationSchema}
            initialValues={{
              password: '',
            }}
            onSubmit={async (values, {setSubmitting, resetForm}) => {
              try {
                if (isSigningIn) {
                  Alert.alert('Already Logging In');
                  return;
                }

                setIsSigningIn(true);
                const data = JSON.stringify({
                  email: email,
                  password: values.password,
                  role: 'user',
                });
                const response = await signin({data});
                if (response.data) {
                  console.error('login response', response.data);
                  dispatch(AuthSlice.actions.setUser(response.data?.user));
                  dispatch(
                    AuthSlice.actions.log_in(
                      response.data?.accessToken?.accessToken,
                    ),
                  );
                }
                if (response.error) {
                  response.error.data.message &&
                    Alert.alert(
                      'Error Occured',
                      `${response.error.data?.message}`,
                    );

                  // response.error.message
                  //   ? Alert.alert('Error Occured', response.error.message)
                  //   : Alert.alert('Error Occured', response.error);
                }
              } catch (e) {
              } finally {
                setIsSigningIn(false);
              }
            }}>
            {({handleChange, values, errors, touched}) => (
              <View style={{marginTop: HEIGHT_BASE_RATIO(8)}}>
                <CustomInputTitle
                  placeholder={t('password')}
                  onChangeText={handleChange('password')}
                  defaultValue={values.password}
                  borderColor={
                    state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
                  }
                  placeholderColor={COLORS.Gray}
                  width={WIDTH_BASE_RATIO(348)}
                  height={HEIGHT_BASE_RATIO(60)}
                  borderRadius={12}
                  borderWidth={2}
                  isEye={true}
                  secureEntry={true}
                />
                {touched.password && errors.password && (
                  <View style={GeneralStyles.errorStyle}>
                    <Text
                      style={[
                        FONTS.AvenirMedium_16_black,
                        {
                          color: COLORS.RED,
                          padding: WIDTH_BASE_RATIO(5),
                        },
                      ]}>
                      {errors.password}
                    </Text>
                  </View>
                )}
                <Pressable style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    {t('forgot_password')}
                  </Text>
                </Pressable>
              </View>
            )}
          </Formik>
          <CustomButton
            backgroundColor={COLORS.Brown}
            width={WIDTH_BASE_RATIO(358)}
            height={HEIGHT_BASE_RATIO(60)}
            borderRadius={12}
            boderColor={COLORS.Brown}
            onPress={() => {
              handleButtonPress();
            }}
            load={isLoading}
            marginTop={HEIGHT_BASE_RATIO(344)}
            text={t('proceed')}
            textStyle={{
              ...FONTS.AvenirMedium_16_black,
              color: COLORS.WHITE,
            }}
          />
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

export default EnterPasssword;
