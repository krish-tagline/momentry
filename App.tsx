import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootTabNavigator from './src/navigation/RootTabNavigator';
import { storage } from './src/services/storage';
import { scheduleEventNotifications } from './src/services/notifications';

function App() {
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
