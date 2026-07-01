<script setup lang="ts">
import './todos-base.css';
import './todos-components.css';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user';

defineOptions({
  name: 'LoginView',
});

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = (): void => {
  errorMessage.value = ''

  const trimmedUsername = username.value.trim()
  if (!trimmedUsername) {
    errorMessage.value = '用户名不能为空'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = '密码至少需要 6 位'
    return
  }

  const success = userStore.login(username.value, password.value)
  if (!success) {
    errorMessage.value = '登录失败，请检查输入'
    return
  }

  router.push('/todos')
}
</script>

<template>
  <div class="login-page">
    <section class="login-card">
      <h1 class="login-card__title">登录</h1>
      <p class="login-card__subtitle">请输入用户名和密码</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <label class="login-form__field">
          <span class="login-form__label">用户名</span>
          <input
            v-model="username"
            type="text"
            class="input"
            placeholder="请输入用户名"
            autocomplete="username"
            aria-label="用户名"
          />
        </label>

        <label class="login-form__field">
          <span class="login-form__label">密码</span>
          <input
            v-model="password"
            type="password"
            class="input"
            placeholder="请输入密码（至少 6 位）"
            autocomplete="current-password"
            aria-label="密码"
          />
        </label>

        <p v-if="errorMessage" class="login-form__error" role="alert">
          {{ errorMessage }}
        </p>

        <button type="submit" class="btn btn--primary login-form__submit">登录</button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 4rem);
  padding: 1.5rem;
}

.login-card {
  width: 100%;
  max-width: 24rem;
  padding: 2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--input-radius);
  background-color: var(--color-background-soft);
}

.login-card__title {
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  font-size: 1.5rem;
  line-height: 1.3;
}

.login-card__subtitle {
  margin-bottom: 1.5rem;
  color: var(--color-text);
  font-size: 0.875rem;
  opacity: 0.85;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.login-form__label {
  font-size: 0.875rem;
  color: var(--color-text);
}

.login-form__error {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-danger);
}

.login-form__submit {
  width: 100%;
  margin-top: 0.25rem;
}
</style>
