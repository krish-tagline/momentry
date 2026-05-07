import { Category } from '../types';

export const CATEGORY_CONFIG: Record<
  Category,
  {
    color: string;
    lightColor: string;
    icon: string;
    name: string;
  }
> = {
  general: {
    color: '#6366F1', // Indigo 500
    lightColor: '#F5F3FF', // Indigo 50
    icon: '✨',
    name: 'General',
  },
  exam: {
    color: '#3B82F6', // Blue 500
    lightColor: '#EFF6FF', // Blue 50
    icon: '📚',
    name: 'Exam',
  },
  birthday: {
    color: '#EC4899', // Pink 500
    lightColor: '#FDF2F8', // Pink 50
    icon: '🎂',
    name: 'Birthday',
  },
  wedding: {
    color: '#F43F5E', // Rose 500
    lightColor: '#FFF1F2', // Rose 50
    icon: '💒',
    name: 'Wedding',
  },
  travel: {
    color: '#10B981', // Emerald 500
    lightColor: '#ECFDF5', // Emerald 50
    icon: '✈️',
    name: 'Travel',
  },
  festival: {
    color: '#F59E0B', // Amber 500
    lightColor: '#FFFBEB', // Amber 50
    icon: '🎉',
    name: 'Festival',
  },
  personal: {
    color: '#8B5CF6', // Violet 500
    lightColor: '#F5F3FF', // Violet 50
    icon: '🎯',
    name: 'Personal',
  },
  other: {
    color: '#64748B', // Slate 500
    lightColor: '#F8FAFC', // Slate 50
    icon: '📅',
    name: 'Other',
  },
};
