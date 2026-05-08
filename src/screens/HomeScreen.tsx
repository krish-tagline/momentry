import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';
import { storage } from '../services/storage';
import { Event } from '../types';
import EventCard from '../components/EventCard';
import { ThemedView, ThemedText } from '../components/Themed';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useTheme } from '../hooks/useTheme';
import { updateWidget } from '../utils';
import { CalendarBlank, Plus, Trash } from 'phosphor-react-native';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [events, setEvents] = useState<Event[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { colors, isDark } = useTheme();

  const loadEvents = useCallback(async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    const storedEvents = await storage.getEvents();
    const sortedEvents = [...storedEvents].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    setEvents(sortedEvents);
    setIsLoading(false);
    setRefreshing(false);

    // Widget Sync Logic
    const widgetId = await storage.getWidgetEventId();
    if (sortedEvents.length > 0) {
      let widgetEvent = sortedEvents.find(e => e.id === widgetId);
      if (widgetEvent) {
        updateWidget(widgetEvent);
      } else if (!widgetId) {
        widgetEvent = sortedEvents[0];
        await storage.setWidgetEventId(widgetEvent.id);
        updateWidget(widgetEvent);
      } else {
        await storage.setWidgetEventId(null);
        updateWidget(null);
      }
    } else {
      updateWidget(null);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadEvents();
  }, [loadEvents]);

  useFocusEffect(
    useCallback(() => {
      loadEvents(events.length === 0);
      setIsSelectionMode(false);
      setSelectedEventIds([]);
    }, [loadEvents, events.length]),
  );

  const handleAddEvent = () => {
    navigation.getParent()?.navigate('AddStack', {
      screen: 'AddEvent',
      params: { eventId: undefined },
    });
  };

  const handleEventPress = (eventId: string) => {
    if (isSelectionMode) {
      toggleSelection(eventId);
    } else {
      navigation.navigate('EventDetail', { eventId });
    }
  };

  const handleLongPress = (eventId: string) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedEventIds([eventId]);
    } else {
      toggleSelection(eventId);
    }
  };

  const toggleSelection = (eventId: string) => {
    setSelectedEventIds(prev => {
      if (prev.includes(eventId)) {
        const newSelected = prev.filter(id => id !== eventId);
        if (newSelected.length === 0) {
          setIsSelectionMode(false);
        }
        return newSelected;
      } else {
        return [...prev, eventId];
      }
    });
  };

  const handleDeleteSelected = () => {
    const eventCount = selectedEventIds.length;
    Alert.alert(
      `Delete ${eventCount} Event${eventCount > 1 ? 's' : ''}?`,
      `Are you sure you want to delete ${eventCount} selected event${
        eventCount > 1 ? 's' : ''
      }? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            for (const eventId of selectedEventIds) {
              await storage.deleteEvent(eventId);
            }
            await loadEvents();
            setIsSelectionMode(false);
            setSelectedEventIds([]);
          },
        },
      ],
    );
  };

  const renderItem = ({ item, index }: { item: Event; index: number }) => (
    <EventCard
      event={item}
      isSelected={selectedEventIds.includes(item.id)}
      isSelectionMode={isSelectionMode}
      onPress={() => handleEventPress(item.id)}
      onLongPress={() => handleLongPress(item.id)}
    />
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 18) return 'Good Afternoon 🌞';
    return 'Good Evening 🌙';
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <View style={{ gap: 5 }}>
            <ThemedText variant="secondary" type="caption">
              {getGreeting()}
            </ThemedText>
            <ThemedText variant="primary" type="h1">
              Your Events
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[
              styles.headerButton,
              isSelectionMode && { backgroundColor: Colors.error },
            ]}
            onPress={isSelectionMode ? handleDeleteSelected : handleAddEvent}
          >
            {isSelectionMode ? (
              <Trash size={24} color="#FFFFFF" />
            ) : (
              <Plus size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <ThemedText
              variant="secondary"
              type="caption"
              style={{ marginTop: Spacing.md }}
            >
              Loading your countdowns...
            </ThemedText>
          </View>
        ) : events.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <CalendarBlank size={64} color={Colors.primary} />
            </View>
            <ThemedText variant="primary" type="h2" style={styles.emptyTitle}>
              No events yet
            </ThemedText>
            <ThemedText
              variant="secondary"
              type="body"
              style={styles.emptySubtitle}
            >
              Tap the + button to add your first countdown!
            </ThemedText>
            <TouchableOpacity
              style={[styles.emptyButton, Shadows.heavy]}
              onPress={handleAddEvent}
            >
              <Plus size={20} color="#FFFFFF" />
              <ThemedText
                variant="primary"
                type="bodySemi"
                style={{ color: '#FFFFFF', marginLeft: Spacing.xs }}
              >
                Add Your First Event
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          />
        )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.heavy,
  },
  listContent: {
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
  },
});
