import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { User } from '@/types/user';

let nextUserId = 1;

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);

  const isLoggedIn = computed(() => currentUser.value !== null);

  const login = (username: string, password: string): boolean => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || password.length < 6) {
      return false;
    }

    currentUser.value = {
      userId: nextUserId++,
      username: trimmedUsername,
    };
    return true;
  };

  const logout = (): void => {
    currentUser.value = null;
  };

  return {
    currentUser,
    isLoggedIn,
    login,
    logout,
  };
});
