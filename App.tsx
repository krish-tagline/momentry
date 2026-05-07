import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootTabNavigator from './src/navigation/RootTabNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} />
      <NavigationContainer>
        <RootTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
