<template>
  <div>
    <div
      class="modal-background"
      @click="closeModal"
    />
    <div class="flex direction-column justify-content-space-between content noselect">
      <div class="fs-18 mb-8">
        Account
      </div>
      <AccountData
        v-if="!isLoading && isAuthenticated"
        :email="userEmail"
        :name="userName"
        @sign-out="signOut"
      />
      <Loader v-if="isLoading" />
      <SignInForm
        v-if="!isLoading && !isAuthenticated"
        :email="email"
        :emailError="emailError"
        :formError="formError"
        :isLoading="isLoading"
        :password="password"
        :passwordError="passwordError"
        @handle-form="handleForm"
        @input="handleInput"
      />
      <button
        class="action-button menu-button noselect"
        @click="closeModal"
        type="button"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import AccountData from './AccountData';
import Loader from '../../elements/Loader';
import SignInForm from './SignInForm';

export default {
  name: 'Account',
  components: {
    AccountData,
    Loader,
    SignInForm,
  },
  data() {
    return {
      email: '',
      emailError: false,
      password: '',
      passwordError: false,
    };
  },
  computed: {
    ...mapState({
      formError: ({ account }) => account.formError,
      isAuthenticated: ({ account }) => account.isAuthenticated,
      isLoading: ({ account }) => account.isLoading,
      token: ({ account }) => account.token,
      userEmail: ({ account }) => account.email,
      userName: ({ account }) => account.name,
    }),
  },
  methods: {
    ...mapActions({
      setFormError: 'account/setFormError',
      setLoading: 'account/setLoading',
      setVisibility: 'account/setVisibility',
      signIn: 'account/signIn',
      signOut: 'account/signOut',
    }),
    /**
     * Close the modal
     * @returns {void}
     */
    closeModal() {
      this.setFormError('');
      return this.setVisibility(false);
    },
    /**
     * Handle sign in form
     * @returns {void}
     */
    handleForm() {
      // remove the previous error
      this.setFormError('');

      // check the form
      const { email = '', password = '' } = this;
      if (!(email && email.trim() && password && password.trim())) {
        this.emailError = !email || !email.trim();
        this.passwordError = !password || !password.trim();
        return this.setFormError('Please provide your credentials!');
      }

      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      this.email = '';
      this.password = '';
      return this.signIn({
        email: trimmedEmail,
        password: trimmedPassword,
      });
    },
    /**
     * Handle inputs
     * @param {FormEvent} event - input event
     * @returns {void}
     */
    handleInput(event) {
      this[`${event.target.name}Error`] = false;
      this[event.target.name] = event.target.value;
      return this.setFormError('');
    },
  },
};
</script>

<style src="./Account.css" scoped />
