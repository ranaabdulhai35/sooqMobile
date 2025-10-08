import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  Platform,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import * as SVGS from '../../../Assets/svgs/index';
import * as ICONS from '../../../Assets/Icons/index';
import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../../Utils/helpers';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {COLORS, FONTS} from '../../../Constants';
import OrContinueWith from '../../../Components/Common/orContinueWith';
import CustomInputTitle from '../../../Components/Common/customInputTitle';
import {Formik} from 'formik';
import {styles} from './Styles/styles';
import * as Yup from 'yup';
import CustomButton from '../../../Components/Common/customButton';
import EmailPhoneTextInput from '../../../Components/Common/emailPhoneTextInput';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import i18next from '../../../../services/i18next';
import {useTranslation} from 'react-i18next';
import LangChanger from '../../../Components/Common/langChanger';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useOAuthLoginAndRegisterMutation} from '../../../Apis/authApiCall';
import auth from '@react-native-firebase/auth';
import {AuthSlice} from '../../../Redux/slice';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
const SignIn = () => {
  const navigation = useNavigation();
  const formikRef = useRef();
  const state = useSelector(state => state.auth);
  const [login, {isLoading}] = useOAuthLoginAndRegisterMutation();
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [isEmailInputField, setIsEmailInputField] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningInWithApple, setIsSigningInWithApple] = useState(false);

  const senderValidationSchema = Yup.object().shape({
    emailNumber: Yup.string()
      .required('This field is required')
      .test('emailOrPhone', 'Invalid Email or Phone Number', function (value) {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const phoneRegex = /^(\+966|966|0)?5\d{8}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      }),
  });

  const handleButtonPress = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
  };
  const signInFunc = async () => {
    if (isSigningIn) {
      console.log('Sign-in already in progress');
      return;
    }

    setIsSigningIn(true);

    try {
      // Ensure Play Services are available
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      if (userInfo?.data?.idToken) {
        // Use Google ID Token to authenticate with Firebase
        const googleCredential = auth.GoogleAuthProvider.credential(
          userInfo?.data?.idToken,
        );

        // Sign in with Firebase and get the Firebase ID Token
        const firebaseUserCredential = await auth().signInWithCredential(
          googleCredential,
        );
        const firebaseIdToken = await firebaseUserCredential.user.getIdToken();

        const data = JSON.stringify({
          idToken: firebaseIdToken, // Send Firebase ID Token to backend
          provider: 'google',
        });

        console.log('oAuth data', data);

        // Send to backend
        const response = await login({data});

        if (response.data) {
          console.log('oAuth login response', response.data);
          dispatch(AuthSlice.actions.setUser(response.data?.user));
          dispatch(
            AuthSlice.actions.log_in(response.data?.accessToken?.accessToken),
          );
        }

        if (response.error) {
          console.error(
            'Error occurred in signing in-------------',
            response.error,
          );
          Alert.alert('Error Occurred', response?.error?.data?.message);
        }

        // Optional: Sign out from Google if needed
        await GoogleSignin.signOut();
      } else {
        console.error('Google sign-in failed: Missing ID token');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the sign-in process');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in already in progress');
      } else {
        console.error('Some other error', error);
      }
    } finally {
      setIsSigningIn(false); // Reset the flag after the process is complete
    }
  };
  const onAppleButtonPress = async () => {
    try {
      if (isSigningInWithApple) {
        console.log('Sign-in already in progress');
        return;
      }

      setIsSigningInWithApple(true);

      // Start the Sign-In request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      console.log('AppleAuthResponse:', appleAuthRequestResponse);

      // Get the user credential state
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const data = JSON.stringify({
          idToken: appleAuthRequestResponse.identityToken, // Send Firebase ID Token to backend
          provider: 'apple',
        });

        console.log('oAuth data', data);

        // Send to backend
        const response = await login({data});

        if (response.data) {
          console.log('oAuth login response', response.data);
          dispatch(AuthSlice.actions.setUser(response.data?.user));
          dispatch(
            AuthSlice.actions.log_in(response.data?.accessToken?.accessToken),
          );
          Alert.alert('Success', 'You are logged in with Apple!');
        }
        if (response.error) {
          if (response.error?.status === 500) {
            Alert.alert('Failed', response.error?.data?.message);
          }
          console.error('oAuth apple login error', response.error);
        }
      } else {
        Alert.alert('Failed', 'Apple Sign-In failed.');
      }
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      Alert.alert('Error', 'Apple Sign-In failed.');
    } finally {
      setIsSigningInWithApple(false);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        Platform.OS == 'ios'
          ? '448006986524-s70j0g5885fhoo7lh3c72o9um3bn5icv.apps.googleusercontent.com'
          : '448006986524-8fkel3tm8ljdcago43rgp6mdjdkm8hu6.apps.googleusercontent.com',

      forceCodeForRefreshToken: true,
    });
  }, []);
  return (
    <View
      style={[
        state?.darkTheme
          ? {backgroundColor: COLORS.DARK}
          : {backgroundColor: COLORS.WHITE},
        GeneralStyles?.container,
      ]}>
      <KeyboardAwareScrollView
        style={{marginTop: HEIGHT_BASE_RATIO(8)}}
        contentContainerStyle={{alignItems: 'center'}}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}>
        <View style={styles.languageSwitch}>
          <LangChanger />
        </View>
        <Image style={styles.logo} source={ICONS.logo} resizeMode="contain" />
        <Text
          style={{
            ...FONTS.AvenirBold_24_black,
            marginTop: HEIGHT_BASE_RATIO(5),
            color: state?.darkTheme ? COLORS.WHITE : COLORS.BLACK,
          }}>
          {t('signIn')}
        </Text>
        <Text
          style={{
            ...FONTS.JakartaSansLight_14_Gray,
            marginTop: HEIGHT_BASE_RATIO(12),
          }}>
          {t('signIn_text')}
        </Text>

        <View style={styles.oAuth_Container}>
          {Platform.OS == 'ios' && (
            <TouchableOpacity
              style={{
                ...styles.oAuth_Btn_Bg,
                backgroundColor: state?.darkTheme
                  ? COLORS.DARK_BTN_BG
                  : COLORS.LightBrown,
              }}
              onPress={() => {
                if (!isSigningInWithApple) onAppleButtonPress();
              }}>
              <SVGS.apple />
              <Text
                style={[
                  styles.oAuth_Btn_Txt,
                  state?.darkTheme
                    ? {color: COLORS.WHITE}
                    : {color: COLORS.Brown},
                ]}>
                {t('continue_with_apple')}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              if (!isSigningIn) signInFunc();
            }}
            style={{
              ...styles.oAuth_Btn_Bg,
              backgroundColor: state?.darkTheme
                ? COLORS.DARK_BTN_BG
                : COLORS.LightBrown,
            }}>
            <SVGS.google />
            <Text
              style={[
                styles.oAuth_Btn_Txt,
                state?.darkTheme
                  ? {color: COLORS.WHITE}
                  : {color: COLORS.Brown},
              ]}>
              {t('continue_with_google')}
            </Text>
          </TouchableOpacity>
        </View>
        <OrContinueWith marginTop={HEIGHT_BASE_RATIO(24)} />
        <Formik
          innerRef={formikRef}
          validateOnChange
          validateOnBlur
          initialValues={{emailNumber: ''}}
          validationSchema={senderValidationSchema}
          onSubmit={async (values, {setSubmitting, resetForm}) => {
            isEmailInputField
              ? navigation.navigate('EnterPassword', {
                  email: values.emailNumber,
                })
              : navigation.navigate('Verify', {
                  emailNumber: values.emailNumber,
                  screen: 'sign in',
                });
          }}>
          {({
            handleChange,
            handleBlur,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <>
              <View style={styles.inputFieldContainer}>
                <EmailPhoneTextInput
                  placeholder={t('email_or_phone_number')}
                  onChangeText={text => {
                    const isPhone =
                      text.startsWith('+9665') ||
                      text.startsWith('9665') ||
                      text.startsWith('05') ||
                      text.startsWith('5');

                    if (isPhone) {
                      setIsEmailInputField(false);

                      let formatted = text;

                      if (text.startsWith('05')) {
                        // Display 05 to user, but convert to +9665 internally
                        const rest = text.substring(2); // remove the '05'
                        formatted = `+9665${rest}`;
                      } else if (text.startsWith('5')) {
                        // User typed just 5, treat as +9665
                        const rest = text.substring(1); // remove the '5'
                        formatted = `+9665${rest}`;
                      } else if (text.startsWith('9665')) {
                        formatted = `+966${text.substring(3)}`;
                      }

                      setFieldValue('emailNumber', formatted);
                    } else {
                      // Treat as email
                      setIsEmailInputField(true);
                      setFieldValue('emailNumber', text);
                    }
                  }}
                  onBlur={handleBlur('emailNumber')}
                  value={values.emailNumber}
                  borderColor={
                    state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
                  }
                  placeholderColor={COLORS.Gray}
                  width={WIDTH_BASE_RATIO(348)}
                  height={HEIGHT_BASE_RATIO(60)}
                  borderRadius={12}
                  borderWidth={2}
                />
                {touched.emailNumber && errors.emailNumber && (
                  <View style={GeneralStyles.errorStyle}>
                    <Text
                      style={[
                        FONTS.AvenirMedium_16_black,
                        {
                          color: COLORS.RED,
                        },
                      ]}>
                      {errors.emailNumber}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
        </Formik>
        <CustomButton
          backgroundColor={COLORS.Brown}
          width={WIDTH_BASE_RATIO(358)}
          height={HEIGHT_BASE_RATIO(60)}
          borderRadius={12}
          boderColor={COLORS.Brown}
          onPress={() => {
            !isSigningIn && handleButtonPress();
          }}
          marginTop={HEIGHT_BASE_RATIO(14)}
          text={t('signIn')}
          load={isLoading}
          loading={isLoading}
          textStyle={{
            ...FONTS.AvenirMedium_16_black,
            color: COLORS.WHITE,
          }}
        />
        <View style={styles.bottomContainer}>
          <Text
            style={{
              ...FONTS.JakartaSansLight_14_Gray,
            }}>
            {t('don’t_have_an_account')}
          </Text>
          <Pressable
            onPress={() => {
              navigation.navigate('SignUp');
            }}>
            <Text
              style={{
                ...FONTS.JakartaSans_Bold_14,
                color: COLORS.Brown,
              }}>
              {t('sign_up')}
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SignIn;
