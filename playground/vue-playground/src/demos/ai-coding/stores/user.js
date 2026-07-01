import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

let nextUserId = 1

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)

  const isLoggedIn = computed(() => currentUser.value !== null)

  const login = (username, password) => {
    const trimmedUsername = username.trim()
    if (!trimmedUsername || password.length < 6) {
      return false
    }

    currentUser.value = {
      userId: nextUserId++,
      username: trimmedUsername,
    }
    return true
  }

  const logout = () => {
    currentUser.value = null
  }

  return {
    currentUser,
    isLoggedIn,
    login,
    logout,
  }
})
