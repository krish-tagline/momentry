export type Category =
  | 'exam'
  | 'birthday'
  | 'wedding'
  | 'travel'
  | 'festival'
  | 'personal'
  | 'general'
  | 'other';

export interface Event {
  id: string;
  name: string;
  date: string;
  category: Category;
  note?: string;
  createdAt: string;
}

export type RootTabParamList = {
  HomeStack: undefined;
  AddStack: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  EventDetail: { eventId: string };
};

export type AddStackParamList = {
  AddEvent: { eventId?: string };
};
