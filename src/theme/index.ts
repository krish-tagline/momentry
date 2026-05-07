import { TextStyle } from 'react-native';

export const Colors = {
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  primaryLight: '#EDE9FE',
  accent: '#F59E0B',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',

  light: {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceElevated: '#F3F4F6',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
  },

  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceElevated: '#334155',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    border: '#334155',
    borderLight: '#1E293B',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  heavy: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
};

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySemi: {
    fontSize: 16,
    fontWeight: '600',
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  captionSemi: {
    fontSize: 14,
    fontWeight: '600',
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
  },
};
