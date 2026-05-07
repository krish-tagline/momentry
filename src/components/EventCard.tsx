import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Event } from '../types';
import { CATEGORY_CONFIG } from '../constants';
import { calculateDaysLeft, getSmartLine, formatRemainingTime } from '../utils';
import { BorderRadius, Spacing, Typography, Shadows, Colors } from '../theme';
import { Check } from 'phosphor-react-native';

interface EventCardProps {
  event: Event;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

export default function EventCard({
  event,
  isSelected = false,
  isSelectionMode = false,
  onPress,
  onLongPress,
}: EventCardProps) {
  const config = CATEGORY_CONFIG[event.category];
  const daysLeft = calculateDaysLeft(event.date);
  const smartLine = getSmartLine(event.category, daysLeft);
  const { value: timeValue, label: timeLabel } = formatRemainingTime(daysLeft);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && { borderWidth: 2, borderColor: config.color },
        Shadows.medium,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.backgroundGradient,
          { backgroundColor: config.lightColor },
        ]}
      >
        <View style={styles.leftSection}>
          {isSelectionMode ? (
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isSelected
                    ? config.color
                    : Colors.light.border,
                  borderWidth: 1,
                  borderColor: isSelected ? config.color : Colors.light.border,
                },
              ]}
            >
              {isSelected && <Check size={24} color="#FFFFFF" weight="bold" />}
            </View>
          ) : (
            <View
              style={[styles.iconContainer, { backgroundColor: config.color }]}
            >
              <Text style={styles.icon}>{config.icon}</Text>
            </View>
          )}
          <View style={styles.textContainer}>
            <Text
              style={[styles.eventName, { color: config.color }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {event.name}
            </Text>
            <Text style={styles.smartLine}>{smartLine}</Text>
          </View>
        </View>
        <View style={[styles.daysContainer, { backgroundColor: config.color }]}>
          <Text style={styles.daysNumber}>{timeValue}</Text>
          <Text style={styles.daysLabel}>{timeLabel}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 18,
    marginVertical: 10,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.light.borderLight,
  },
  backgroundGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  eventName: {
    fontSize: Typography.h3.fontSize,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    letterSpacing: -0.3,
  },
  smartLine: {
    fontSize: Typography.caption.fontSize,
    color: '#4B5563',
    lineHeight: 18,
    fontWeight: '500',
  },
  daysContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    minWidth: 80,
  },
  daysNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
  },
  daysLabel: {
    fontSize: 10,
    color: 'white',
    opacity: 0.9,
    fontWeight: '600',
    marginTop: 0,
  },
});
