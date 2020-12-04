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
  </form>
</template>

<script>
import ErrorMessage from '../../elements/ErrorMessage';

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
};
</script>

<style src="./SignInForm.css" scoped />
