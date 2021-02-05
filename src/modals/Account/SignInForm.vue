<template>
  <form
    class="flex direction-column form"
    @submit.prevent="$emit('handle-form')"
  >
    <input
      name="email"
      placeholder="Email"
      type="email"
      :class="['mb-8', emailError ? 'input-error' : '']"
      :disabled="isLoading"
      :value="email"
      @input="$emit('input', $event)"
    />
    <input
      name="password"
      placeholder="Password"
      type="password"
      :class="['mb-8', passwordError ? 'input-error' : '']"
      :disabled="isLoading"
      :value="password"
      @input="$emit('input', $event)"
    />
    <div class="form-error mb-8 text-center">
      <ErrorMessage
        :isLoading="isLoading"
        :message="formError"
      />
    </div>
    <button
      class="action-button menu-button"
      type="submit"
      :disabled="isLoading"
    >
      Sign in
    </button>
    <button
      class="link-button mt-8 mb-8"
      type="button"
      :disabled="isLoading"
      @click="handleForgotPassword"
    >
      Forgot password?
    </button>
    <button
      class="link-button mb-8"
      type="button"
      :disabled="isLoading"
      @click="handleSignUp"
    >
      Don't have an account?
    </button>
  </form>
</template>

<script>
import { shell } from 'electron';

import ErrorMessage from '../../elements/ErrorMessage';
import { WEB_APP_ORIGIN } from '../../configuration';

export default {
  name: 'SignInForm',
  components: {
    ErrorMessage,
  },
  props: {
    email: {
      required: true,
      type: String,
    },
    emailError: {
      required: true,
      type: Boolean,
    },
    formError: {
      required: true,
      type: String,
    },
    isLoading: {
      required: true,
      type: Boolean,
    },
    password: {
      required: true,
      type: String,
    },
    passwordError: {
      required: true,
      type: Boolean,
    },
  },
  methods: {
    handleForgotPassword() {
      return shell.openExternal(`${WEB_APP_ORIGIN}/recovery`);
    },
    handleSignUp() {
      return shell.openExternal(`${WEB_APP_ORIGIN}/signup`);
    },
  },
};
</script>

<style src="./SignInForm.css" scoped />
