import {View, Platform, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthWrapper from './src/Routes/authWrapper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {GeneralStyles} from './src/GeneralStyles/generalStyles';
import {persistor, store} from './src/Redux/store';
import SplashScreen from 'react-native-splash-screen';
import notifee from '@notifee/react-native';
import {MFSDK, MFCountry, MFEnvironment} from 'myfatoorah-reactnative';
import {processColor} from 'react-native';
import {FATOORAH_API_KEY} from '@env';

const App = () => {
  const requestNotificationPermission = async () => {
    try {
      await notifee.requestPermission();

      console.log('Notification permission granted');
    } catch (error) {
      console.error('Notification permission error:', error);
    }
  };

  useEffect(() => {
    const configureMyFatoorah = async () => {
      await MFSDK.init(
        FATOORAH_API_KEY,
        MFCountry.SAUDIARABIA,
        MFEnvironment.TEST,
      );

      await MFSDK.setUpActionBar(
        'Company Payment',
        processColor('#FFFFFF'),
        processColor('#000000'),
        true,
      );
    };

    configureMyFatoorah();
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    requestNotificationPermission();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={GeneralStyles.container}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
              <AuthWrapper />
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
