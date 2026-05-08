import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '../types';

const EVENTS_KEY = 'events';
const IS_PRO_KEY = 'isPro';
const WIDGET_EVENT_ID_KEY = 'widgetEventId';

export const storage = {
  async getEvents(): Promise<Event[]> {
    try {
      const data = await AsyncStorage.getItem(EVENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  },

  async saveEvents(events: Event[]): Promise<void> {
    try {
      await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  },

  async addEvent(event: Event): Promise<void> {
    const events = await this.getEvents();
    events.push(event);
    await this.saveEvents(events);
  },

  async updateEvent(updatedEvent: Event): Promise<void> {
    const events = await this.getEvents();
    const index = events.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      events[index] = updatedEvent;
      await this.saveEvents(events);
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    const events = await this.getEvents();
    const filteredEvents = events.filter(e => e.id !== eventId);
    await this.saveEvents(filteredEvents);

    // Clear widget selection if deleted
    const widgetId = await this.getWidgetEventId();
    if (widgetId === eventId) {
      await this.setWidgetEventId(null);
    }
  },

  async clearAllEvents(): Promise<void> {
    await this.saveEvents([]);
    await this.setWidgetEventId(null);
  },

  async getIsPro(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(IS_PRO_KEY);
      return data === 'true';
    } catch (error) {
      console.error('Error getting isPro:', error);
      return false;
    }
  },

  async setIsPro(isPro: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(IS_PRO_KEY, isPro.toString());
    } catch (error) {
      console.error('Error setting isPro:', error);
    }
  },

  async getWidgetEventId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(WIDGET_EVENT_ID_KEY);
    } catch (error) {
      console.error('Error getting widgetEventId:', error);
      return null;
    }
  },

  async setWidgetEventId(eventId: string | null): Promise<void> {
    try {
      if (eventId) {
        await AsyncStorage.setItem(WIDGET_EVENT_ID_KEY, eventId);
      } else {
        await AsyncStorage.removeItem(WIDGET_EVENT_ID_KEY);
      }
    } catch (error) {
      console.error('Error setting widgetEventId:', error);
    }
  },
};
