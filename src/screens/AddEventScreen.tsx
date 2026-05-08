import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ArrowLeft, Calendar, CaretRight } from 'phosphor-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Category, AddStackParamList } from '../types';
import { CATEGORY_CONFIG } from '../constants';
import { storage } from '../services/storage';
import { generateUUID } from '../utils';
import { ThemedView, ThemedText } from '../components/Themed';
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

  useFocusEffect(
    React.useCallback(() => {
      if (eventId) {
        loadEventDetails();
      } else {
        resetForm();
      }
    }, [eventId]),
  );

  const resetForm = () => {
    setName('');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow);
    setCategory('general');
    setNote('');
    setNameError('');
  };

  const loadEventDetails = async () => {
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
  };

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
    } else {
      const updatedEvent = {
        id: eventId,
        name: name.trim(),
        date: date.toISOString().split('T')[0],
        category,
        note: note.trim() || undefined,
        createdAt: new Date().toISOString().split('T')[0], // Keep original or update? Usually keep original but storage.update might handle it
      };
      await storage.updateEvent(updatedEvent);
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
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
          {/* <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.primary} />
            </TouchableOpacity>
            <ThemedText variant="primary" type="h3">
              Add Event
            </ThemedText>
            <View style={{ width: 40 }} />
          </View> */}

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
                if (text.trim()) setNameError('');
              }}
              leftIcon="PencilSimple"
              error={nameError}
              containerStyle={{ marginBottom: Spacing.xl }}
            />

            <View style={styles.inputGroup}>
              <ThemedText
                variant="primary"
                type="captionSemi"
                style={styles.label}
              >
                Event Date
              </ThemedText>
              <TouchableOpacity
                style={[styles.dateButton, Shadows.light]}
                onPress={() => setDatePickerVisible(true)}
                activeOpacity={0.7}
              >
                <View style={styles.dateContent}>
                  <Calendar
                    size={20}
                    color={Colors.primary}
                    style={styles.calendarIcon}
                  />
                  <ThemedText variant="primary" type="bodySemi">
                    {formatDate(date)}
                  </ThemedText>
                </View>
                <CaretRight size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, { marginTop: 15 }]}>
              <ThemedText
                variant="primary"
                type="captionSemi"
                style={styles.label}
              >
                Category
              </ThemedText>
              <View style={styles.categoryGrid}>
                {(Object.keys(CATEGORY_CONFIG) as Category[]).map(cat => {
                  const config = CATEGORY_CONFIG[cat];
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryCard,
                        {
                          backgroundColor: config.lightColor,
                          borderColor: isSelected
                            ? config.color
                            : colors.border,
                          borderWidth: isSelected ? 2 : 1,
                        },
                        isSelected ? Shadows.medium : null,
                      ]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.categoryIcon}>{config.icon}</Text>
                      <ThemedText
                        variant="primary"
                        type="captionSemi"
                        style={{
                          color: config.color,
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
              placeholder="Add a personal note..."
              value={note}
              onChangeText={setNote}
              multiline
              style={styles.textArea}
              containerStyle={{ marginTop: 20 }}
            />
          </ScrollView>

          {/* <View style={styles.footer}> */}
          <Button
            title={eventId ? 'Update Event' : 'Save Event'}
            onPress={handleSave}
            variant="primary"
            size="md"
            loading={isLoading}
            disabled={isLoading}
            style={[styles.saveButton, Shadows.heavy]}
          />
          {/* </View> */}

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={date}
            minimumDate={tomorrow}
            onConfirm={selectedDate => {
              setDate(selectedDate);
              setDatePickerVisible(false);
            }}
            onCancel={() => setDatePickerVisible(false)}
          />
        </KeyboardAvoidingView>
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
    height: 56,
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
});
