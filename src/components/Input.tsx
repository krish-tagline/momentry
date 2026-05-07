import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  useColorScheme,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../theme';
import { ThemedText } from './Themed';
import * as Phosphor from 'phosphor-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Phosphor;
  rightIcon?: keyof typeof Phosphor;
  onRightIconPress?: () => void;
  containerStyle?: any;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const LeftIconComponent = leftIcon ? (Phosphor[leftIcon] as any) : null;
  const RightIconComponent = rightIcon ? (Phosphor[rightIcon] as any) : null;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText variant="primary" type="captionSemi" style={styles.label}>
          {label}
        </ThemedText>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: error ? Colors.error : colors.border,
            borderWidth: error ? 2 : 1,
          },
        ]}
      >
        {LeftIconComponent && (
          <LeftIconComponent
            size={20}
            color={Colors.primary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            { color: colors.textPrimary },
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            style,
          ]}
          placeholderTextColor={colors.textTertiary}
          {...props}
        />
        {RightIconComponent && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <RightIconComponent size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.errorText, { color: Colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.body.fontSize,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    marginLeft: Spacing.md,
    marginRight: Spacing.xs,
  },
  rightIcon: {
    marginRight: Spacing.md,
    marginLeft: Spacing.xs,
  },
  errorText: {
    marginTop: Spacing.xs,
    fontSize: Typography.small.fontSize,
  },
});
