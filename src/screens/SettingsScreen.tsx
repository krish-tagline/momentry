import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  ThemedView,
  ThemedText,
  Card,
  ThemedSafeAreaView,
} from '../components/Themed';
import { Colors, Spacing, BorderRadius } from '../theme';
import * as Phosphor from 'phosphor-react-native';
import { storage } from '../services/storage';
import { useTheme } from '../hooks/useTheme';

interface SettingsItemProps {
  icon: keyof typeof Phosphor;
  iconColor: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}

function SettingsItem({
  icon,
  iconColor,
  title,
  subtitle,
  onPress,
  rightComponent,
}: SettingsItemProps) {
  const IconComponent = Phosphor[icon] as any;
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingsItemLeft}>
        <View
          style={[styles.settingsIcon, { backgroundColor: `${iconColor}20` }]}
        >
          <IconComponent size={20} color={iconColor} />
        </View>
        <View style={styles.settingsItemText}>
          <ThemedText variant="primary" type="bodySemi">
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText variant="secondary" type="caption">
              {subtitle}
            </ThemedText>
          )}
        </View>
      </View>
      {rightComponent ||
        (onPress && (
          <Phosphor.CaretRight size={20} color={colors.textTertiary} />
        ))}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [isPro, setIsPro] = useState(false);
  const { colors } = useTheme();

  const loadProStatus = useCallback(async () => {
    const proStatus = await storage.getIsPro();
    setIsPro(proStatus);
  }, []);

  React.useEffect(() => {
    loadProStatus();
  }, [loadProStatus]);

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your events? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAllEvents();
            Alert.alert('Success', 'All events have been deleted.');
          },
        },
      ],
    );
  };

  const handleRateApp = () => {
    Alert.alert('Rate App', 'Thank you for your support!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy content would go here.');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Terms of service content would go here.');
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <ThemedText variant="primary" type="h1">
              Settings
            </ThemedText>
          </View>

          <Card
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.proBanner}>
              <View style={styles.proIcon}>
                <Phosphor.Star size={28} color="#ffc400ff" />
              </View>
              <View style={styles.proText}>
                <ThemedText variant="primary" type="h3">
                  {isPro ? 'Pro Active' : 'Go Pro'}
                </ThemedText>
                <ThemedText variant="secondary" type="caption">
                  {isPro
                    ? 'Enjoy unlimited events!'
                    : 'Unlock unlimited events and more features'}
                </ThemedText>
              </View>
              {!isPro && (
                <View style={styles.proBadge}>
                  <ThemedText
                    variant="primary"
                    type="captionSemi"
                    style={{ color: '#FFFFFF' }}
                  >
                    Upgrade
                  </ThemedText>
                </View>
              )}
            </View>
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.sectionHeader}>
              <ThemedText variant="secondary" type="captionSemi">
                General
              </ThemedText>
            </View>
            <SettingsItem
              icon="Bell"
              iconColor={Colors.primary}
              title="Notifications"
              subtitle="Stay updated with your countdowns"
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingsItem
              icon="Palette"
              iconColor={Colors.primary}
              title="Appearance"
              subtitle="Light, dark, or system theme"
            />
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.sectionHeader}>
              <ThemedText variant="secondary" type="captionSemi">
                Support
              </ThemedText>
            </View>
            <SettingsItem
              icon="Star"
              iconColor={Colors.accent}
              title="Rate App"
              onPress={handleRateApp}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingsItem
              icon="Question"
              iconColor={Colors.primary}
              title="Help & Feedback"
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingsItem
              icon="EnvelopeSimple"
              iconColor={Colors.primary}
              title="Contact Us"
            />
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.sectionHeader}>
              <ThemedText variant="secondary" type="captionSemi">
                Legal
              </ThemedText>
            </View>
            <SettingsItem
              icon="ShieldCheck"
              iconColor={Colors.primary}
              title="Privacy Policy"
              onPress={handlePrivacyPolicy}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingsItem
              icon="FileText"
              iconColor={Colors.primary}
              title="Terms of Service"
              onPress={handleTermsOfService}
            />
          </Card>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearAllData}
          >
            <ThemedText style={{ color: Colors.error }} type="bodySemi">
              Clear All Data
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.versionContainer}>
            <ThemedText variant="secondary" type="small">
              Version 1.0.0
            </ThemedText>
            <ThemedText variant="secondary" type="small">
              Made with ❤️
            </ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
    marginTop: 8,
  },
  card: {
    marginBottom: Spacing.lg,
    padding: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 5,
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  proIcon: {
    width: 56,
    height: 56,
    resizeMode: 'cover',
    borderRadius: 100,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  proText: {
    flex: 1,
    gap: 5,
  },
  proBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingsItemText: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginLeft: Spacing.lg + Spacing.md + 40,
  },
  dangerButton: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    gap: 4,
    paddingBottom: Spacing.xl,
  },
});
