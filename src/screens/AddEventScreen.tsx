import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  Text,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar, CaretRight } from 'phosphor-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Category, AddStackParamList } from '../types';
import { CATEGORY_CONFIG } from '../constants';
import { storage } from '../services/storage';
import { generateUUID } from '../utils';
import {
  cancelEventNotifications,
  scheduleEventNotifications,
} from '../services/notifications';
import {
  ThemedView,
  ThemedText,
  ThemedSafeAreaView,
} from '../components/Themed';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useTheme } from '../hooks/useTheme';

export default function AddEventScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AddStackParamList, 'AddEvent'>>();
  const route = useRoute<RouteProp<AddStackParamList, 'AddEvent'>>();
  const { eventId } = route.params || {};
  const { colors, isDark } = useTheme();

  const [name, setName] = useState('');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [date, setDate] = useState(tomorrow);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [category, setCategory] = useState<Category>('general');
  const [note, setNote] = useState('');
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadEventDetails = useCallback(async () => {
    setIsLoading(true);
    const events = await storage.getEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
      setName(event.name);
      setDate(new Date(event.date));
      setCategory(event.category);
      setNote(event.note || '');
      setNameError('');
    }
    setIsLoading(false);
  }, [eventId]);

  const resetForm = useCallback(() => {
    setName('');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow);
    setCategory('general');
    setNote('');
    setNameError('');
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (eventId) {
        loadEventDetails();
      } else {
        resetForm();
      }
    }, [eventId, loadEventDetails, resetForm]),
  );

  const validateForm = () => {
    if (!name.trim()) {
      setNameError('Please enter an event name');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const events = await storage.getEvents();
    let savedEvent: any = null;

    if (!eventId) {
      const isPro = await storage.getIsPro();
      if (!isPro && events.length >= 5) {
        Alert.alert(
          'Go Pro',
          'You can only add 5 events in the free version. Upgrade to Pro for unlimited events!',
          [{ text: 'OK' }],
        );
        return;
      }

      const newEvent = {
        id: generateUUID(),
        name: name.trim(),
        date: date.toISOString().split('T')[0],
        category,
        note: note.trim() || undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };

      await storage.addEvent(newEvent);
      if (events.length === 0) {
        await storage.setWidgetEventId(newEvent.id);
      }
      savedEvent = newEvent;
    } else {
      await cancelEventNotifications(eventId);
      const updatedEvent = {
        id: eventId,
        name: name.trim(),
        date: date.toISOString().split('T')[0],
        category,
        note: note.trim() || undefined,
        createdAt: new Date().toISOString().split('T')[0], // Keep original or update? Usually keep original but storage.update might handle it
      };
      await storage.updateEvent(updatedEvent);
      savedEvent = updatedEvent;
    }

    if (savedEvent) {
      await scheduleEventNotifications(savedEvent);
    }

    navigation.setParams({ eventId: undefined });
    navigation.getParent()?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'HomeStack' }],
      }),
    );
  };

  const formatDate = (dateObj: Date) => {
    return dateObj.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <ThemedText variant="primary" type="h1">
              {eventId ? 'Edit Event' : 'Add Event'}
            </ThemedText>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Input
              label="Event Name"
              placeholder="What event are you planning?"
              value={name}
              onChangeText={text => {
                setName(text);
                if (nameError) setNameError('');
              }}
              error={nameError}
              leftIcon="PencilSimple"
            />

            <View style={styles.inputGroup}>
              <ThemedText
                variant="secondary"
                type="captionSemi"
                style={styles.label}
              >
                Event Date
              </ThemedText>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  Shadows.light,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setDatePickerVisible(true)}
              >
                <View style={styles.dateContent}>
                  <Calendar size={20} color={Colors.primary} />
                  <ThemedText style={{ marginLeft: Spacing.sm }}>
                    {formatDate(date)}
                  </ThemedText>
                </View>
                <CaretRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText
                variant="secondary"
                type="captionSemi"
                style={styles.label}
              >
                Category
              </ThemedText>
              <View style={styles.categoryGrid}>
                {(Object.keys(CATEGORY_CONFIG) as Category[]).map(cat => {
                  const config = CATEGORY_CONFIG[cat];
                  const isSelected = category === cat;
                  const cardStyle = {
                    backgroundColor: isDark
                      ? isSelected
                        ? Colors.primaryLight
                        : colors.surface
                      : config.lightColor,

                    borderColor: isDark
                      ? isSelected
                        ? Colors.primary
                        : colors.border
                      : isSelected
                      ? config.color
                      : colors.border,

                    borderWidth: isSelected ? 2 : 1,
                  };
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryCard,
                        cardStyle,
                        !isDark && isSelected ? Shadows.medium : null,
                      ]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.categoryIcon}>{config.icon}</Text>
                      <ThemedText
                        variant={isSelected ? 'primary' : 'secondary'}
                        type="captionSemi"
                        style={{
                          color: isSelected
                            ? Colors.primary
                            : colors.textSecondary,
                        }}
                      >
                        {config.name}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Input
              label="Note (Optional)"
              placeholder="Add some details..."
              value={note}
              onChangeText={setNote}
              multiline
              leftIcon="Note"
              style={{ marginLeft: Spacing.sm }}
              containerStyle={{}}
            />

            <View style={{ height: Spacing.sm }} />
          </ScrollView>
          <Button
            title={eventId ? 'Update Event' : 'Save Event'}
            onPress={handleSave}
            loading={isLoading}
            style={[styles.saveButton, Shadows.heavy]}
          />
          {/* <View style={{ height: Spacing.sm }} /> */}
        </KeyboardAvoidingView>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={selectedDate => {
            setDate(selectedDate);
            setDatePickerVisible(false);
          }}
          onCancel={() => setDatePickerVisible(false)}
          date={date}
          minimumDate={new Date()}
        />
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
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  dateButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: Spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  categoryCard: {
    width: '48%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: 'transparent',
  },
  saveButton: {
    borderRadius: BorderRadius.lg,
    // height: 56,
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
});
