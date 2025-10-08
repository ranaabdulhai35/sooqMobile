import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingScreen from '../Screens/Settings/SettingScreen';
import Cart from '../Screens/Cart/cart';
import PostDetails from '../Screens/PostDetails/postDetails';
import CustomerReviews from '../Screens/CustomerReviews/customerReviews';
import SearchScreen from '../Screens/SearchScreen/searchScreen';
import SearchResultScreen from '../Screens/SearchResultScreen/searchResultScreen';
import Store from '../Screens/Store/store';
import Filters from '../Screens/Filters/filters';
import ShippingAddress from '../Screens/CheckOut/ShippingAddress/shippingAddress';
import CheckoutPayment from '../Screens/CheckOut/checkoutPayment/checkoutPayment';
import SelectPaymentMethod from '../Screens/PaymentMethod/SelectPaymentMethod/selectPaymentMethod';
import SignUpSuccess from '../Screens/Authentication/SignUpSuccess/signUpSuccess';
import AddCardDetaills from '../Screens/PaymentMethod/AddCardDetails/addCardDetaills';
import EditProfile from '../Screens/EditProfile/editProfile';
import Address from '../Screens/Address/address';
import UserGuides from '../Screens/UserGuides/userGuides';
import GiveReview from '../Screens/GiveReview/giveReview';
import MyTabs from './bottomNavigation';
import CategoriesScreen from '../Screens/Categories/CategoriesScreen';
import AuthNavigation from './authNavigation';
import {useDispatch, useSelector} from 'react-redux';
import PaymentScreen from '../Screens/CheckOut/paymentScreen/paymentScreen';
import {useGetUserDetailsQuery} from '../Apis/userApiCall';
import {AuthSlice} from '../Redux/slice';
import {useEffect} from 'react';
import i18next from 'i18next';

const Stack = createNativeStackNavigator();
const StackNavigation = () => {
  const state = useSelector(state => state.auth);
  const changeLanguageAccordingToState = () => {
    i18next.changeLanguage(state.language);
  };

  // const dispatch = useDispatch();
  // const userId = state?.user?.id;

  // const {
  //   data: userData,
  //   error: userError,
  //   isFetching: isFetchingUser,
  //   isLoading: isLoadingUser,
  //   isSuccess: isSuccessUser,
  //   isError: isUserError,
  //   refetch: refetchUser,
  // } = useGetUserDetailsQuery({userId});

  // const handleUser = async () => {
  //   if (userData && isSuccessUser) {
  //     console.log('user', userData);
  //     console.log('user id', userId);
  //     refetchUser();
  //     if (userData) {
  //       dispatch(AuthSlice.actions.setUser(userData));
  //     } else {
  //       handleUser();
  //     }
  //   }
  //   if (isUserError) {
  //     console.error('error occured fetching user', userError);
  //     console.log('user id', userId);
  //   }
  // };
  useEffect(() => {
    changeLanguageAccordingToState();
  }, []);
  return (
    <>
      <Stack.Navigator
        initialRouteName={
          state?.user?.name && state?.user.phoneNumber && state?.user?.address
            ? 'BottomTabBar'
            : 'EditProfile'
        }
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          cardOverlayEnabled: true,
          animationEnabled: true,
        }}>
        <Stack.Screen name="BottomTabBar" component={MyTabs} />
        <Stack.Screen name="Settings" component={SettingScreen} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="PostDetails" component={PostDetails} />
        <Stack.Screen name="CustomerReviews" component={CustomerReviews} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen
          name="SearchResultScreen"
          component={SearchResultScreen}
        />
        <Stack.Screen name="Store" component={Store} />
        <Stack.Screen name="Filters" component={Filters} />
        <Stack.Screen name="ShippingAddress" component={ShippingAddress} />
        <Stack.Screen name="CheckoutPayment" component={CheckoutPayment} />
        <Stack.Screen
          name="SelectPaymentMethod"
          component={SelectPaymentMethod}
        />
        <Stack.Screen name="Success" component={SignUpSuccess} />
        <Stack.Screen name="AddCardDetaills" component={AddCardDetaills} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Address" component={Address} />
        <Stack.Screen name="UserGuides" component={UserGuides} />
        <Stack.Screen name="GiveReview" component={GiveReview} />
        <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="AuthStack" component={AuthNavigation} />
      </Stack.Navigator>
    </>
  );
};

export default StackNavigation;
