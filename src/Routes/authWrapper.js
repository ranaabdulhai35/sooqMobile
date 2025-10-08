import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import StackNavigation from './stackNavigation';
import AuthNavigation from './authNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../Constants';
import {useGetUserDetailsQuery} from '../Apis/userApiCall';
import {AuthSlice} from '../Redux/slice';
import {GeneralStyles} from '../GeneralStyles/generalStyles';

const AuthWrapper = ({navigation}) => {
  const state = useSelector(state => state.auth);
  const isDarkTheme = state.darkTheme;
  const token = state?.token;
  // const isProfileCompleted = state?.isProfileCompleted;
  const dispatch = useDispatch();
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

  const handleUser = async () => {
    if (userData && isSuccessUser) {
      console.log('user', userData);
      console.log('user id', userId);
      refetchUser();
      if (userData) {
        dispatch(AuthSlice.actions.setUser(userData));
      } else {
        handleUser();
      }
    }
    if (isUserError) {
      console.error('error occured fetching user', userError);
      console.log('user id', userId);
    }
  };
  useEffect(() => {
    handleUser();
  }, []);

  console.log('token-------', token);
  return (
    <TouchableWithoutFeedback style={{flex: 1}}>
      <>
        <StatusBar
          barStyle={state.darkTheme ? 'light-content' : 'dark-content'}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: state.darkTheme ? COLORS.DARK : COLORS.WHITE,
          }}>
          <SafeAreaView style={GeneralStyles.container}>
            {token ? <StackNavigation /> : <AuthNavigation />}
          </SafeAreaView>
        </View>
      </>
    </TouchableWithoutFeedback>
  );
};

export default AuthWrapper;
