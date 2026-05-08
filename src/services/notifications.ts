import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import { Event } from '../types';
import { calculateDaysLeft, getSmartLine } from '../utils';

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const settings = await notifee.requestPermission();
    return (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const createNotificationChannel = async (): Promise<string> => {
  if (Platform.OS === 'android') {
    const channelId = await notifee.createChannel({
      id: 'event-reminders',
      name: 'Event Reminders',
      importance: AndroidImportance.HIGH,
    });
    return channelId;
  }
  return 'event-reminders';
};

export const getNotificationId = (
  eventId: string,
  daysLeft: number,
): string => {
  return `event-${eventId}-${daysLeft}`;
};

export const scheduleEventNotifications = async (
  event: Event,
): Promise<void> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return;
    }

    const channelId = await createNotificationChannel();
    const daysLeft = calculateDaysLeft(event.date);

    const triggerPoints: number[] = [];
    if (daysLeft > 15) {
      triggerPoints.push(15);
    }
    if (daysLeft > 5) {
      triggerPoints.push(5);
    }
    if (daysLeft > 1) {
      triggerPoints.push(1);
    }
    triggerPoints.push(0);

    for (const triggerDaysLeft of triggerPoints) {
      const notificationId = getNotificationId(event.id, triggerDaysLeft);
      const message = getSmartLine(event.category, triggerDaysLeft);
      const eventDate = new Date(event.date);
      const triggerDate = new Date(eventDate);
      triggerDate.setDate(eventDate.getDate() - (daysLeft - triggerDaysLeft));
      triggerDate.setHours(9, 0, 0, 0);

      const now = new Date();
      if (triggerDate > now) {
        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: triggerDate.getTime(),
        };

        await notifee.createTriggerNotification(
          {
            id: notificationId,
            title: event.name,
            body: message,
            android: {
              channelId,
              importance: AndroidImportance.HIGH,
              pressAction: {
                id: 'default',
              },
            },
            ios: {
              sound: 'default',
            },
          },
          trigger,
        );

        console.log('Scheduled notification:', {
          notificationId,
          triggerDate,
          message,
        });
      }
    }
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};

export const cancelEventNotifications = async (
  eventId: string,
): Promise<void> => {
  try {
    const triggerDaysList = [0, 1, 5, 15, 30, 60, 90, 120, 150, 180, 365];
    for (const daysLeft of triggerDaysList) {
      const notificationId = getNotificationId(eventId, daysLeft);
      await notifee.cancelNotification(notificationId);
    }
    console.log('Cancelled all notifications for event:', eventId);
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};
