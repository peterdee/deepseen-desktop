<template>
  <div>
    <div
      class="modal-background"
      @click="setVisibility(false)"
    />
    <div class="flex direction-column justify-content-space-between content noselect">
      <div class="fs-18 mb-8">
        Account
      </div>
      <SignInForm
        v-if="!isLoading && !isAuthenticated"
        :email="email"
        :emailError="emailError"
        :formError="formError"
        :password="password"
        :passwordError="passwordError"
        @handle-form="handleForm"
      />
      <button
        class="action-button menu-button noselect"
        @click="setVisibility(false)"
        type="button"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import SignInForm from './SignInForm';

export default {
  name: 'Account',
  components: {
    SignInForm,
  },
  data() {
    return {
      email: '',
      emailError: false,
      formError: '',
      password: '',
      passwordError: false,
    };
  },
  computed: {
    ...mapState({
      isAuthenticated: ({ account }) => account.isAuthenticated,
      isLoading: ({ account }) => account.isLoading,
      token: ({ account }) => account.token,
    }),
  },
  methods: {
    ...mapActions({
      setLoader: 'account/setLoader',
      setVisibility: 'account/setVisibility',
    }),
    handleForm() {
      // check the form
      if (!(this.email && this.email.trim() && this.password && this.password.trim())) {
        this.emailError = !this.email;
        this.formError = 'Please provide your credentials!'
        return this.passwordError = !this.password;
      }
    },
  },
};
</script>

<style src="./Account.css" scoped />
