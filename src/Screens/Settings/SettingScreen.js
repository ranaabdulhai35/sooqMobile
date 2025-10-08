import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../Components/Common/header';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS} from '../../Constants';
import {
  handleLangChange,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../Utils/helpers';
import * as SVGS from '../../Assets/svgs/index';
import * as Images from '../../Assets/Images/index';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import styles from './styles/styles';
import SwitchToggle from 'react-native-switch-toggle';
import {useTranslation} from 'react-i18next';
import LangChanger from '../../Components/Common/langChanger';
import {AuthSlice} from '../../Redux/slice';
import {useGetUserDetailsQuery} from '../../Apis/userApiCall';
import axios from '../../Requests/axios';
import FastImage from 'react-native-fast-image';
const SettingScreen = () => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const userId = state?.user?.id;
  const {
    data: userData,
    error: userError,
    isFetching: isFetchingUser,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
    isError: isUserError,
    refetch: refetchUser,
  } = useGetUserDetailsQuery({userId});

  const dispatch = useDispatch();
  const {t} = useTranslation();

  const options = [
    {
      onPress: () => {
        dispatch(AuthSlice.actions.setDarkTheme(!state.darkTheme));
      },
      text: t('darkMode'),
      rightComponent: (
        <SwitchToggle
          switchOn={state.darkTheme}
          backgroundColorOff={state.darkTheme ? COLORS.DARK_BTN_BG : '#E9E9EA'}
          backgroundColorOn={COLORS.GREEN}
          circleColorOff={COLORS.WHITE}
          containerStyle={styles.switchContainerStyle}
          circleStyle={styles.circleStyle}
          onPress={() => {
            dispatch(AuthSlice.actions.setDarkTheme(!state.darkTheme));
          }}
        />
      ),
      optionIcon: <SVGS.darkMode />,
    },
    // {
    //   onPress: () => {
    //     navigation.navigate('SelectPaymentMethod');
    //   },
    //   text: t('payments'),
    //   rightComponent: <SVGS.arrowRight />,
    //   optionIcon: <SVGS.payments />,
    // },
    // {
    //   onPress: () => {
    //     navigation.navigate('Address');
    //   },
    //   text: t('address'),
    //   rightComponent: <SVGS.arrowRight />,
    //   optionIcon: <SVGS.address />,
    // },
    // {
    //   onPress: () => {
    //     console.log('dark');
    //   },
    //   text: t('vouchers'),
    //   rightComponent: <SVGS.arrowRight />,
    //   optionIcon: <SVGS.vouchers />,
    // },
    {
      onPress: () => {
        navigation.navigate('UserGuides');
      },
      text: t('userGuide'),
      rightComponent: <SVGS.arrowRight />,
      optionIcon: <SVGS.userGuide />,
    },
    {
      onPress: () => {
        console.log('dark');
      },
      text: t('privacyPolicy'),
      rightComponent: <SVGS.arrowRight />,
      optionIcon: <SVGS.privacyPolicy />,
    },
    {
      onPress: () => {
        dispatch(AuthSlice.actions.log_out());
      },
      text: t('logout'),
      rightComponent: <SVGS.arrowRight />,
      optionIcon: <SVGS.logOut />,
    },
  ];

  const handleEditProfileOnPress = () => {
    navigation.navigate('EditProfile', userData);
  };
  // const handleUser = () => {
  //   if (userData && isSuccessUser) {
  //     console.log('user', userData);
  //   }
  //   if (isUserError) {
  //     console.error('error occured', userError);
  //   }
  // };

  // useEffect(
  //   useCallback(() => {
  //     handleUser();
  //   }, []),
  // );
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
        backgroundColor={
          state?.darkTheme
            ? {backgroundColor: COLORS.DARK}
            : {backgroundColor: COLORS.WHITE}
        }
        style={{
          paddingBottom: HEIGHT_BASE_RATIO(20),
          borderBottomWidth: 1,
          borderBottomColor: state?.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightBrown,
        }}
        rightIcon={<View style={{width: WIDTH_BASE_RATIO(25)}}></View>}
        leftIcon={state?.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
        screennName={t('profile')}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
        onPressLeftIcon={() => {
          navigation.navigate('BottomTabBar');
        }}
      />
      <ScrollView
        style={GeneralStyles.generalPaddingHomeStack}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View
          style={{alignItems: 'flex-end', marginBottom: HEIGHT_BASE_RATIO(16)}}>
          <LangChanger />
        </View>
        <View
          style={[
            styles.profileInfo,
            {
              borderColor: state.darkTheme
                ? COLORS.DARK_BTN_BG
                : COLORS.LightBrown,
            },
          ]}>
          {/* {state.pfp ? (
            <FastImage source={state.pfp} style={styles.profilePicture} />
          ) : state?.user?.profilePic ? (
            <FastImage
              source={{uri: state?.user?.profilePic}}
              style={styles.profilePicture}
            />
          ) : (
            <SVGS.userIconSettings />
          )} */}
          <FastImage source={Images.logo} style={styles.profilePicture} />

          <View style={styles.nameAndEmailContainer}>
            <Text
              style={{
                ...styles.userName,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {state?.user?.name
                ? `${handleLangChange(state?.user?.name, state?.language)}`
                : 'Your Name'}
            </Text>
            <Text
              style={{
                ...styles.userEmail,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {state?.user?.email}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              handleEditProfileOnPress();
            }}
            style={styles.editButtonContainer}>
            <SVGS.edit />
          </TouchableOpacity>
        </View>
        {options.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.settingOptionContainer,
                {
                  borderColor: state.darkTheme
                    ? COLORS.DARK_BTN_BG
                    : COLORS.LightBrown,
                },
              ]}
              onPress={item.onPress}>
              <View style={styles.iconNameContainer}>
                {item.optionIcon}
                <Text
                  style={{
                    ...FONTS.JakartaSansMedium_14,
                    color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                    marginLeft: WIDTH_BASE_RATIO(12),
                  }}>
                  {item.text}
                </Text>
              </View>
              {item.rightComponent}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SettingScreen;
