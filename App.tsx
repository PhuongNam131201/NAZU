import React, {useEffect, useState, useCallback} from 'react';
import {SplashScreen} from './src';
import AuthNavigator from './src/navigators/AuthNavigator';
import MainNavigator from './src/navigators/MainNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [accessToken, setAccessToken] = useState('');

  const {getItem} = useAsyncStorage('accessToken');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  const checkLogin = useCallback(async () => {
    const token = await getItem();
    if (token) {
      setAccessToken(token);
    }
  }, [getItem]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {isShowSplash ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          {accessToken ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      )}
    </>
  );
};

export default App;
