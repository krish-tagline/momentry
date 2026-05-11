import { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import RootTabNavigator from './src/navigation/RootTabNavigator';
import { storage } from './src/services/storage';
import { scheduleEventNotifications } from './src/services/notifications';
import { Colors } from './src/theme';

function App() {
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const events = await storage.getEvents();
        for (const event of events) {
          await scheduleEventNotifications(event);
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  const theme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: Colors.primary,
      background: isDark ? Colors.dark.background : Colors.light.background,
      card: isDark ? Colors.dark.surface : Colors.light.surface,
      text: isDark ? Colors.dark.textPrimary : Colors.light.textPrimary,
      border: isDark ? Colors.dark.border : Colors.light.border,
      notification: Colors.primary,
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={'transparent'}
        translucent
      />
      <NavigationContainer theme={theme}>
        <RootTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
