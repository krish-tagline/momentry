import { useColorScheme } from 'react-native';
import { Colors } from '../theme';

export function useTheme() {
  const isDark = useColorScheme() === 'dark';
  
  return {
    isDark,
    colors: isDark ? Colors.dark : Colors.light,
    themeColors: Colors,
  };
}
