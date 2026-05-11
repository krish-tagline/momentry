import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, useColorScheme } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      ...(size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : styles.md),
    };
    
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.border : Colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.border : isDark ? colors.surfaceElevated : Colors.primaryLight,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled ? colors.border : Colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };
  
  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      ...styles.textBase,
      ...(size === 'sm' ? styles.textSm : size === 'lg' ? styles.textLg : styles.textMd),
    };
    
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          color: disabled ? colors.textTertiary : '#FFFFFF',
        };
      case 'secondary':
      case 'outline':
      case 'ghost':
        return {
          ...baseStyle,
          color: disabled ? colors.textTertiary : Colors.primary,
        };
      default:
        return baseStyle;
    }
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#FFFFFF' : Colors.primary} 
        />
      ) : (
        <>
          {leftIcon}
          <Text style={[getTextStyle(), leftIcon ? styles.textWithLeftIcon : null, rightIcon ? styles.textWithRightIcon : null, textStyle]}>
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  md: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  lg: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  textBase: {
    fontWeight: '600',
  },
  textMd: {
    fontSize: Typography.body.fontSize,
  },
  textSm: {
    fontSize: Typography.caption.fontSize,
  },
  textLg: {
    fontSize: Typography.h3.fontSize,
  },
  textWithLeftIcon: {
    marginLeft: Spacing.sm,
  },
  textWithRightIcon: {
    marginRight: Spacing.sm,
  },
});
