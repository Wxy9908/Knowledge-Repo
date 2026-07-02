import { useTheme } from '../../../composables/useTheme';

export const getThemeColors = () => {
  const { theme } = useTheme();
  
  if (theme.value === 'light') {
    return {
      theme: 'light',
      text: '#1e293b',
      muted: '#64748b',
      border: '#e2e8f0',
      surface: '#ffffff',
      bg: '#f8fafc',
      tooltipBg: 'rgba(255, 255, 255, 0.9)',
      tooltipBorder: '#e2e8f0',
      tooltipText: '#1e293b',
    };
  }
  
  return {
    theme: 'dark',
    text: '#e7ecf3',
    muted: '#8b9cb3',
    border: '#2d3a4f',
    surface: '#1a2332',
    bg: '#0f1419',
    tooltipBg: 'rgba(26, 35, 50, 0.9)',
    tooltipBorder: '#2d3a4f',
    tooltipText: '#e7ecf3',
  };
};
