import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddStackParamList } from '../types';
import AddEventScreen from '../screens/AddEventScreen';

const Stack = createNativeStackNavigator<AddStackParamList>();

export default function AddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="AddEvent" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddEvent" component={AddEventScreen} />
    </Stack.Navigator>
  );
}
