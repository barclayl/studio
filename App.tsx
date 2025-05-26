import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootNavigator } from './src/navigation/RootNavigator';
import { theme } from './src/theme';
import { RootStoreProvider } from './src/stores/RootStore';

export default function App() {
  return (
    <RootStoreProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </RootStoreProvider>
  );
}