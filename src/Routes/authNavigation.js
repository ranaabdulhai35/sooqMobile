import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '../Screens/Authentication/SignIn/signin';
import SignUp from '../Screens/Authentication/SignUp/signUp';
import VerifyOTP from '../Screens/Authentication/VerifyOTP/verifyOTP';
import CompleteProfile from '../Screens/Authentication/CompleteProfile/completeProfile';
import SignUpSuccess from '../Screens/Authentication/SignUpSuccess/signUpSuccess';
import EnterPasssword from '../Screens/Authentication/EnterPassword/enterPasssword';
import StackNavigation from './stackNavigation';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardOverlayEnabled: true,
        animationEnabled: true,
      }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Verify" component={VerifyOTP} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
      <Stack.Screen name="Success" component={SignUpSuccess} />
      <Stack.Screen name="EnterPassword" component={EnterPasssword} />
      <Stack.Screen name="HomeStack" component={StackNavigation} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
