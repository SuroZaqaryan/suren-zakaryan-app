<script>
import Input from '@/components/input/Input.vue';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: false,
    }
  },

  components: {
    Input,
  },

  methods: {
    async handleLogin() {
      const credentials = {
        username: this.username,
        password: this.password,
      }

      const success = await this.$store.dispatch('login', credentials)

      success ? this.$router.push('/') : this.error = true;
    }
  }
}
</script>

<template>
  <div class="login">
    <div class="login__form">
      <div class="login__banner"><p>Авторизация</p></div>

      <form @submit.prevent="handleLogin">
        <Input
            v-model="username"
            type="text"
            placeholder="+7"
            label="Логин или Телефон"
            :icon="require('@/assets/icons/call.svg')"
            class="static-placeholder"
            required
        />

        <Input
            v-model="password"
            placeholder="Пароль"
            type="password"
            :icon="require('@/assets/icons/lock.svg')"
            class="static-placeholder"
            required
        />

        <p v-if="error" class="error">Неправильные данные</p>

        <button type="submit" class="login__submit">
          Войти
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
 @import "Login.scss";
</style>
