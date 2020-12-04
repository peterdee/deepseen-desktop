<template>
  <form
    class="flex direction-column form"
    @submit.prevent="$emit('handle-form')"
  >
    <input
      :class="['mb-8', emailError ? 'input-error' : '']"
      name="email"
      placeholder="Email"
      type="email"
    />
    <input
      :class="['mb-8', passwordError ? 'input-error' : '']"
      name="password"
      placeholder="Password"
      type="password"
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
