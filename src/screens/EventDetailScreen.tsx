import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList, Event } from '../types';
import { storage } from '../services/storage';
import { CATEGORY_CONFIG } from '../constants';
import { calculateDaysLeft, getSmartLine, updateWidget } from '../utils';
import { ThemedView, ThemedText, Card } from '../components/Themed';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '../theme';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/Button';
import {
  ArrowLeft,
  Trash,
  Pencil,
  Calendar,
  Tag,
  FileText,
  Monitor,
} from 'phosphor-react-native';

type EventDetailScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'EventDetail'
>;
type EventDetailScreenRouteProp = RouteProp<HomeStackParamList, 'EventDetail'>;

export default function EventDetailScreen() {
  const navigation = useNavigation<EventDetailScreenNavigationProp>();
  const route = useRoute<EventDetailScreenRouteProp>();
  const { eventId } = route.params;
  const { colors } = useTheme();
  const [event, setEvent] = useState<Event | null>(null);
  const [isWidgetEvent, setIsWidgetEvent] = useState(false);

  const loadEvent = useCallback(async () => {
    const events = await storage.getEvents();
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const foundEvent = sortedEvents.find(e => e.id === eventId);
    setEvent(foundEvent || null);

    const widgetId = await storage.getWidgetEventId();
    if (widgetId) {
      setIsWidgetEvent(widgetId === eventId);
    } else if (sortedEvents.length > 0) {
      setIsWidgetEvent(sortedEvents[0].id === eventId);
    } else {
      setIsWidgetEvent(false);
    }
  }, [eventId]);

  useFocusEffect(
    useCallback(() => {
      loadEvent();
    }, [loadEvent]),
  );

  const handleSetWidget = async () => {
    if (!event) return;
    await storage.setWidgetEventId(event.id);
    updateWidget(event);
    setIsWidgetEvent(true);
    Alert.alert(
      'Widget Updated',
      'This event will now be shown on your home screen widget.',
    );
  };

  const handleEdit = () => {
    if (!event) return;
    // We can use the root navigation to jump to the Add tab and pass the eventId
    navigation.getParent()?.navigate('AddStack', {
      screen: 'AddEvent',
      params: { eventId: event.id },
    });
  };

  const handleDelete = () => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await storage.deleteEvent(eventId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.primary} />
            </TouchableOpacity>
            <View style={{ width: 40 }} />
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const config = CATEGORY_CONFIG[event.category];
  const daysLeft = calculateDaysLeft(event.date);
  const smartLine = getSmartLine(event.category, daysLeft);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.light.surface }]}
    >
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.primary} />
          </TouchableOpacity>
          <ThemedText variant="primary" type="h3">
            Event Details
          </ThemedText>
          <View style={styles.headerRight}>
            {/* <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                <Pencil size={24} color={Colors.primary} />
              </TouchableOpacity> */}
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteButton}
            >
              <Trash size={24} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.eventHeader,
              { backgroundColor: config.lightColor, ...Shadows.light },
            ]}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: config.color }]}
            >
              <Text style={styles.icon}>{config.icon}</Text>
            </View>
            <View style={styles.eventInfo}>
              <Text
                style={[styles.eventName, { color: config.color }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {event.name}
              </Text>
              <ThemedText variant="secondary" type="body">
                {smartLine}
              </ThemedText>
            </View>
          </View>

          <Card style={styles.daysCard}>
            <View style={styles.daysContainer}>
              <ThemedText variant="primary" type="caption">
                {daysLeft === 1 ? 'Day Left' : 'Days Left'}
              </ThemedText>
              <Text style={[styles.daysNumber, { color: config.color }]}>
                {daysLeft}
              </Text>
            </View>
          </Card>

          <Card style={styles.detailCard}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Calendar size={20} color={Colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <ThemedText variant="secondary" type="caption">
                  Date
                </ThemedText>
                <ThemedText variant="primary" type="bodySemi">
                  {new Date(event.date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </ThemedText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Tag size={20} color={Colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <ThemedText variant="secondary" type="caption">
                  Category
                </ThemedText>
                <ThemedText variant="primary" type="bodySemi">
                  {config.name}
                </ThemedText>
              </View>
            </View>

            {event.note && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <FileText size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <ThemedText variant="secondary" type="caption">
                      Note
                    </ThemedText>
                    <ThemedText variant="primary" type="body">
                      {event.note}
                    </ThemedText>
                  </View>
                </View>
              </>
            )}

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.detailItem}
              onPress={handleSetWidget}
              disabled={isWidgetEvent}
            >
              <View
                style={[
                  styles.detailIcon,
                  isWidgetEvent && { backgroundColor: Colors.success + '20' },
                ]}
              >
                <Monitor
                  size={20}
                  color={isWidgetEvent ? Colors.success : Colors.primary}
                />
              </View>
              <View style={styles.detailContent}>
                <ThemedText variant="secondary" type="caption">
                  Home Screen Widget
                </ThemedText>
                <ThemedText
                  variant="primary"
                  type="bodySemi"
                  style={isWidgetEvent ? { color: Colors.success } : undefined}
                >
                  {isWidgetEvent
                    ? 'Currently Active on Widget'
                    : 'Set as Active Widget'}
                </ThemedText>
              </View>
            </TouchableOpacity>
          </Card>
        </ScrollView>
        <Button
          title="Edit Event"
          onPress={handleEdit}
          variant="primary"
          size="md"
          style={[styles.saveButton, Shadows.heavy]}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  scrollContent: {
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingHorizontal: 18,
    marginTop: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventHeader: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  icon: {
    fontSize: 36,
  },
  eventInfo: {
    flex: 1,
  },
  daysCard: {
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  daysContainer: {
    alignItems: 'center',
  },
  daysNumber: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
    marginTop: Spacing.xs,
  },
  detailCard: {
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 100,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.lg,
  },
  saveButton: {
    borderRadius: BorderRadius.lg,
    height: 56,
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  eventName: {
    fontSize: Typography.h3.fontSize,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    letterSpacing: -0.3,
  },
});
