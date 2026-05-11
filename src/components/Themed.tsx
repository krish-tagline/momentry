import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../theme';
import { useTheme } from '../hooks/useTheme';

interface ThemedViewProps {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  variant?: 'default' | 'surface' | 'elevated';
}

export function ThemedView({
  style,
  children,
  variant = 'default',
}: ThemedViewProps) {
  const { colors } = useTheme();

  const backgroundColor =
    variant === 'surface'
      ? colors.surface
      : variant === 'elevated'
      ? colors.surfaceElevated
      : colors.background;

  return <View style={[{ backgroundColor }, style]}>{children}</View>;
}

export function ThemedSafeAreaView({
  style,
  children,
}: {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
    >
      {children}
    </SafeAreaView>
  );
}

interface ThemedTextProps {
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  type?: keyof typeof Typography;
}

export function ThemedText({
  style,
  children,
  variant = 'primary',
  type = 'body',
}: ThemedTextProps) {
  const { colors } = useTheme();

  const color =
    variant === 'primary'
      ? colors.textPrimary
      : variant === 'secondary'
      ? colors.textSecondary
      : colors.textTertiary;

  return <Text style={[Typography[type], { color }, style]}>{children}</Text>;
}

interface CardProps {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  shadow?: 'light' | 'medium' | 'heavy';
}

export function Card({ style, children, shadow = 'light' }: CardProps) {
  const { colors } = useTheme();
  const shadowStyle = Shadows[shadow];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface },
        shadowStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
});
