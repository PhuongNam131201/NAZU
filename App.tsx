import React, {useEffect, useState, useCallback} from 'react';
import {SplashScreen} from './src';
import AuthNavigator from './src/navigators/AuthNavigator';
import MainNavigator from './src/navigators/MainNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import AppRouters from './src/navigators/AppRouters';
const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  // const [accessToken, setAccessToken] = useState('');

  // const {getItem} = useAsyncStorage('accessToken');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  // const checkLogin = useCallback(async () => {
  //   const token = await getItem();
  //   if (token) {
  //     setAccessToken(token);
  //   }
  // }, [getItem]);

  // useEffect(() => {
  //   checkLogin();
  // }, [checkLogin]);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Provider store={store}>
        {isShowSplash ? (
          <SplashScreen />
        ) : (
          <NavigationContainer>
            <AppRouters />
            {/* {accessToken ? <MainNavigator /> : <AuthNavigator />} */}
          </NavigationContainer>
        )}
      </Provider>
    </>
  );
};

export default App;
