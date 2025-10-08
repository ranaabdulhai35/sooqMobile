import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import React, {useRef, useState} from 'react';
import BackButton from '../../../Components/Common/backButton';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';
import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../../Utils/helpers';
import {useNavigation} from '@react-navigation/native';
import * as SVGS from '../../../Assets/svgs/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {COLORS, FONTS} from '../../../Constants';
import {styles} from './Styles/styles';
import CustomButton from '../../../Components/Common/customButton';
import {Formik} from 'formik';
import * as Yup from 'yup';
import * as defaultImages from '../../../Assets/PresetImages/index';
import CustomInputTitle from '../../../Components/Common/customInputTitle';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import {FontFamily} from '../../../GeneralStyles/generalFonts';
import {useTranslation} from 'react-i18next';
import HttpRequest from '../../../Requests/axios';
import {AuthSlice} from '../../../Redux/slice';
import {useSignupMutation} from '../../../Apis/authApiCall';

const images = [
  {id: '1', src: defaultImages.image1},
  {id: '2', src: defaultImages.image2},
  {id: '3', src: defaultImages.image3},
  {id: '4', src: defaultImages.image4},
  {id: '5', src: defaultImages.image5},
  {id: '6', src: defaultImages.image6},
  {id: '7', src: defaultImages.image7},
  {id: '8', src: defaultImages.image8},
];
const CompleteProfile = ({route}) => {
  const navigation = useNavigation();
  const {email} = route.params;
  const formikRef = useRef();
  const refRBSheet = useRef();
  const dispatch = useDispatch();
  const state = useSelector(state => state.auth);
  const [signup, {isLoading}] = useSignupMutation();
  const {t} = useTranslation();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [selectImage, setSelectImage] = useState(null);
  const [pfp, setPfp] = useState(null);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Password must include one uppercase, one lowercase, one number, and one special character',
      ),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const handleButtonPress = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
  };
  const launchImagePicker = () => {
    refRBSheet.current.open();
  };
  const launchImageLibrary = () => {
    let options = {storageOptions: {path: 'image'}};

    launchImageLibrary(options, response => {
      if (response && response.assets && response.assets.length > 0) {
        setSelectImage(response.assets[0]);
      } else {
        console.log('No image selected');
        setSelectImage(null);
      }
    });
  };
  const renderImage = ({item}) => (
    <Pressable
      onPress={() => {
        setSelectImage(item);
      }}
      style={styles.imageContainer}>
      <Image
        source={item.src}
        style={{
          ...styles.image,
          borderColor:
            selectImage?.id === item.id ? COLORS.Brown : 'transparent',
        }}
      />
    </Pressable>
  );
  const handleCancel = () => {
    Alert.alert(
      'Confirm cancel',
      'Are you sure you want to cancel?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            if (selectImage == pfp) {
              refRBSheet.current.close();
            } else {
              setSelectImage(null);
              refRBSheet.current.close();
            }
          },
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <View
      style={[
        GeneralStyles.container,
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
        style={{marginTop: HEIGHT_BASE_RATIO(30)}}
        contentContainerStyle={{alignItems: 'center'}}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}>
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
          validationSchema={validationSchema}
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          onSubmit={async (values, {setSubmitting, resetForm}) => {
            try {
              if (isSigningIn) {
                Alert.alert('Sign Up in progress');
                return;
              }
              setIsSigningIn(true);
              const data = JSON.stringify({
                email: email,
                password: values.password,
              });
              const response = await signup({data});
              if (response.data) {
                dispatch(AuthSlice.actions.setUser(response.data?.newUser));
                dispatch(
                  AuthSlice.actions.log_in(
                    response?.data?.accessToken?.accessToken,
                  ),
                );
              }
              if (response.error) {
                response?.error?.data?.message
                  ? Alert.alert('Error Occured', response.error.data?.message)
                  : Alert.alert('Error Occured', response.error);
              }
            } catch (e) {
              console.log('error occured in sign up', e);
            } finally {
              setIsSigningIn(false);
            }
          }}>
          {({handleChange, values, errors, touched}) => (
            <>
              <View style={styles.verticalGap}>
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
                        },
                      ]}>
                      {errors.password}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.verticalGap}>
                <CustomInputTitle
                  placeholder={t('confirm_password')}
                  onChangeText={handleChange('confirmPassword')}
                  defaultValue={values.confirmPassword}
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
                {touched.confirmPassword && errors.confirmPassword && (
                  <View style={GeneralStyles.errorStyle}>
                    <Text
                      style={[
                        FONTS.AvenirMedium_16_black,
                        {
                          color: COLORS.RED,
                        },
                      ]}>
                      {errors.confirmPassword}
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
            handleButtonPress();
          }}
          load={isLoading}
          marginTop={HEIGHT_BASE_RATIO(70)}
          text={t('proceed')}
          textStyle={{
            ...FONTS.JakartaSans_Bold_16,
            color: COLORS.WHITE,
          }}
        />
        {/* <CustomButton
          backgroundColor={state?.darkTheme ? COLORS.DARK : COLORS.WHITE}
          width={WIDTH_BASE_RATIO(358)}
          height={HEIGHT_BASE_RATIO(60)}
          borderRadius={12}
          boderColor={state?.darkTheme ? COLORS.DARK : COLORS.WHITE}
       
          marginTop={HEIGHT_BASE_RATIO(10)}
          text={t('skip')}
          textStyle={{
            ...FONTS.JakartaSansLight_16_black,
            color: state?.darkTheme ? COLORS.WHITE : COLORS.Gray,
          }}
        /> */}
      </KeyboardAwareScrollView>
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          container: {
            ...styles.rBSheetContainer,
            backgroundColor: state?.darkTheme ? COLORS.DARK : COLORS.WHITE,
          },
        }}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}>
        <View style={styles.contentPadding}>
          <Text
            style={{
              ...styles.rBHeading,
              color: state?.darkTheme ? COLORS.WHITE : COLORS.BLACK,
            }}>
            Profile Picture
          </Text>
          <FlatList
            data={images}
            renderItem={renderImage}
            keyExtractor={item => item.id}
            numColumns={4}
            contentContainerStyle={styles.flatListContainer}
          />
          <View style={styles.rBButtonContainer}>
            <CustomButton
              backgroundColor={
                state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightGray
              }
              width={WIDTH_BASE_RATIO(171)}
              height={HEIGHT_BASE_RATIO(60)}
              borderRadius={10}
              boderColor={
                state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightGray
              }
              onPress={() => {
                selectImage && handleCancel();
              }}
              text={'Cancel'}
              textStyle={{
                ...FONTS.JakartaSans_Bold_16,
                color: COLORS.Gray,
              }}
            />
            <CustomButton
              backgroundColor={COLORS.Brown}
              width={WIDTH_BASE_RATIO(171)}
              height={HEIGHT_BASE_RATIO(60)}
              borderRadius={10}
              boderColor={COLORS.Brown}
              text={'Save'}
              onPress={() => {
                setPfp(selectImage);
                refRBSheet.current.close();
              }}
              textStyle={{
                ...FONTS.JakartaSans_Bold_16,
                color: COLORS.WHITE,
              }}
            />
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

export default CompleteProfile;
