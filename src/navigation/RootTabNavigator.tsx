import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types';
import HomeStackNavigator from './HomeStackNavigator';
import AddStackNavigator from './AddStackNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import { House, HouseSimple, Plus, Gear, GearSix } from 'phosphor-react-native';
import {
  useColorScheme,
  View,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import { Colors, BorderRadius, Spacing } from '../theme';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootTabNavigator() {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: Spacing.sm,
          paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.md,
          height: Platform.OS === 'ios' ? 85 : 70,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
            },
            android: {
              elevation: 12,
            },
          }),
        },
        tabBarButton: props => (
          <Pressable {...props} android_ripple={{ color: 'transparent' }} />
        ),
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          marginTop: Spacing.xs,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          title: 'Home',
          tabBarButton: props => (
            <Pressable {...props} android_ripple={{ color: 'transparent' }} />
          ),
          tabBarIcon: ({ color, focused }) => {
            const IconComponent = focused ? House : HouseSimple;
            return (
              <View
                style={[
                  styles.iconContainer,
                  focused && {
                    backgroundColor: isDark
                      ? colors.surfaceElevated
                      : Colors.primaryLight,
                  },
                ]}
              >
                <IconComponent color={color} size={20} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="AddStack"
        component={AddStackNavigator}
        options={{
          title: 'Add',
          tabBarButton: props => (
            <Pressable {...props} android_ripple={{ color: 'transparent' }} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: Colors.primary },
              ]}
            >
              <Plus color={focused ? '#FFFFFF' : color} size={18} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarButton: props => (
            <Pressable {...props} android_ripple={{ color: 'transparent' }} />
          ),
          tabBarIcon: ({ color, focused }) => {
            const IconComponent = focused ? Gear : GearSix;
            return (
              <View
                style={[
                  styles.iconContainer,
                  focused && {
                    backgroundColor: isDark
                      ? colors.surfaceElevated
                      : Colors.primaryLight,
                  },
                ]}
              >
                <IconComponent color={color} size={20} />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 6,
    borderRadius: BorderRadius.full,
    marginBottom: 6,
    resizeMode: 'contain',
  },
  addIconContainer: {
    backgroundColor: Colors.primaryLight,
  },
});
