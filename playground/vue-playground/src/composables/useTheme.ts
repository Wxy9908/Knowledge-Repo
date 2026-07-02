import { ref, watch, onMounted } from 'vue';

export type Theme = 'dark' | 'light';

const theme = ref<Theme>('dark');

export const useTheme = () => {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme.value);
    updateBodyClass();
  };

  const updateBodyClass = () => {
    if (theme.value === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      theme.value = savedTheme;
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      theme.value = 'light';
    }
    updateBodyClass();
  });

  return {
    theme,
    toggleTheme,
  };
};
