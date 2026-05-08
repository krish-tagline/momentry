import { NativeModules, Platform } from 'react-native';
import { Category, Event } from '../types';

export const updateWidget = (event: Event | null) => {
  try {
    const eventName = event ? event.name : 'No active countdown';
    const daysLeft = event ? calculateDaysLeft(event.date).toString() : '-';

    if (Platform.OS === 'ios') {
      console.log('Updating iOS Widget with:', {
        eventName,
        daysLeft,
      });
      if (
        NativeModules.WidgetBridge &&
        NativeModules.WidgetBridge.updateWidget
      ) {
        NativeModules.WidgetBridge.updateWidget(eventName, daysLeft);
      } else {
        console.warn(
          'WidgetBridge.updateWidget is not available. Please rebuild the app.',
        );
      }
    } else {
      console.log('Updating Android Widget with:', {
        eventName,
        daysLeft,
      });
      if (NativeModules.QuoteWidget && NativeModules.QuoteWidget.updateWidget) {
        NativeModules.QuoteWidget.updateWidget(eventName, daysLeft);
      } else {
        console.warn(
          'QuoteWidget.updateWidget is not available. Please rebuild the app.',
        );
      }
    }
  } catch (error) {
    console.error('Error updating widget:', error);
  }
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const calculateDaysLeft = (dateString: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateString);
  eventDate.setHours(0, 0, 0, 0);
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatRemainingTime = (
  daysLeft: number,
): { value: string; label: string } => {
  if (daysLeft < 0) return { value: '0', label: 'days' };

  const years = Math.floor(daysLeft / 365);
  const remainingAfterYears = daysLeft % 365;
  const months = Math.floor(remainingAfterYears / 30);
  const days = remainingAfterYears % 30;

  let value = '';
  let label = '';

  if (years > 0) {
    value = `${years}y ${months}m`;
    label = 'remains';
  } else if (months > 0) {
    value = `${months}m ${days}d`;
    label = 'remains';
  } else {
    value = days.toString();
    label = days === 1 ? 'day left' : 'days left';
  }

  return { value, label };
};

const SMART_MESSAGES: Record<string, Record<string, string>> = {
  past: {
    default: 'This event has passed.',
    yesterday: 'This happened yesterday.',
  },
  today: {
    exam: "It's exam day! Take a deep breath, you've got this.",
    birthday: 'Happy Birthday! Time to celebrate and make some memories.',
    wedding:
      'The big day is finally here. Wishing you a lifetime of happiness!',
    travel: 'Adventure awaits! Your journey starts today. Safe travels!',
    festival: "It's festival time! Let the celebrations begin.",
    personal: "Today's the day you've been working toward. Enjoy the moment.",
    general: 'The day has arrived! Make the most of every second.',
    default: "It's finally here! Enjoy your special day.",
  },
  tomorrow: {
    exam: "Tomorrow's the big test. Get some good rest tonight.",
    birthday: 'Just one more sleep! Tomorrow is going to be special.',
    wedding: 'Only 24 hours to go! Everything is coming together.',
    travel: "Time to double-check your bags! You're leaving tomorrow.",
    festival: 'The excitement is building... the festival starts tomorrow!',
    personal: "Tomorrow is the big day. You're ready for this.",
    general: 'Almost there! Just one day left to wait.',
    default: "Tomorrow's the day! Hope you're as excited as we are.",
  },
  soon: {
    // 2-3 days
    exam: 'Only {days} days left. Final push, keep focusing!',
    birthday: 'Just {days} days to go! The birthday countdown is real.',
    wedding: '{days} days until you say "I do". So close now!',
    travel: '{days} days left! Almost time to head out and explore.',
    festival: 'The festival is just {days} days away. Get ready!',
    personal: "{days} days to go. You're in the home stretch now.",
    general: 'Only {days} days left! The wait is almost over.',
    default: 'Just {days} more days! Not long now.',
  },
  week: {
    // 4-7 days
    exam: 'A week to go. Time to stay disciplined and focused.',
    birthday: 'Only one week until the birthday celebrations!',
    wedding: '7 days left! The final countdown to the wedding begins.',
    travel: 'One week until your trip! Time to start getting organized.',
    festival: 'Just a week until the festival. The fun is coming soon!',
    personal: 'One week left to hit your goal. You can do this!',
    general: 'Only a week to go! The countdown is getting exciting.',
    default: 'Just one week left! The wait is almost over.',
  },
  fortnight: {
    // 8-14 days
    exam: 'Two weeks left. A perfect time for a solid review.',
    birthday: 'Two weeks to go! Plenty of time to plan something great.',
    wedding: 'Just a fortnight until the big day. Enjoy these final moments.',
    travel:
      'Two weeks until your adventure. Start dreaming of your destination!',
    festival: 'Two weeks until the festival. Time to get your plans sorted.',
    personal: 'Two weeks left. Stay consistent and keep moving forward.',
    general: 'Two weeks to go! The anticipation is building.',
    default: 'Two weeks left! Something special is just around the corner.',
  },
  month: {
    // 15-30 days
    exam: '{days} days. Still plenty of time if you start today.',
    birthday: '{days} days until the big birthday. Mark your calendar!',
    wedding: '{days} days until the wedding. The journey is almost complete.',
    travel: '{days} days to go. Time to start looking at itineraries!',
    festival: '{days} days until the festival. The countdown has begun.',
    personal: '{days} days left. Keep that momentum going!',
    general: '{days} days until the event. Something to look forward to!',
    default: '{days} days to go. Keep counting down!',
  },
  long: {
    // 31-100 days
    exam: 'The exam is a while away. Start early to stay stress-free.',
    birthday: "Still a few months out, but it's never too early to plan!",
    wedding: 'A few months left. Enjoy the planning phase!',
    travel: 'Your trip is on the horizon. Something to keep you inspired.',
    festival: "The festival is coming. It'll be here before you know it!",
    personal: "You've got time to make real progress on this goal.",
    general: 'Still some time to go, but the countdown is officially on.',
    default: 'Still a bit of a wait, but it will be worth it!',
  },
  veryLong: {
    default:
      '{days} days to go. A long way off, but definitely worth the wait!',
  },
};

export const getSmartLine = (category: Category, daysLeft: number): string => {
  let period: keyof typeof SMART_MESSAGES;

  if (daysLeft < 0) {
    const absDays = Math.abs(daysLeft);
    if (absDays === 1) return SMART_MESSAGES.past.yesterday!;
    return `This was ${absDays} days ago. Hope it was great!`;
  }

  if (daysLeft === 0) period = 'today';
  else if (daysLeft === 1) period = 'tomorrow';
  else if (daysLeft <= 3) period = 'soon';
  else if (daysLeft <= 7) period = 'week';
  else if (daysLeft <= 14) period = 'fortnight';
  else if (daysLeft <= 30) period = 'month';
  else if (daysLeft <= 100) period = 'long';
  else period = 'veryLong';

  const messages = SMART_MESSAGES[period];
  const message = messages[category] || messages.default || '';

  return message.replace('{days}', daysLeft.toString());
};
