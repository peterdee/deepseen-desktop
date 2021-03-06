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
        :clientTypeError="clientTypeError"
        :desktopConnected="desktopConnected"
        :email="userEmail"
        :firstName="firstName"
        :lastName="lastName"
        :mobileConnected="mobileConnected"
        @reconnect="$emit('reconnect')"
        @sign-out="handleSignOut"
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
  props: {
    clientTypeError: {
      required: true,
      type: Boolean,
    },
    desktopConnected: {
      required: true,
      type: Boolean,
    },
    mobileConnected: {
      required: true,
      type: Boolean,
    },
  },
  computed: {
    ...mapState({
      firstName: ({ account }) => account.firstName,
      formError: ({ account }) => account.formError,
      isAuthenticated: ({ account }) => account.isAuthenticated,
      isLoading: ({ account }) => account.isLoading,
      lastName: ({ account }) => account.lastName,
      token: ({ account }) => account.token,
      userEmail: ({ account }) => account.email,
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
      this.setLoading(false);
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
    /**
     * Handle signing out
     * @returns {Promise<void>}
     */
    async handleSignOut() {
      // destroy the Websockets connection
      this.$io().disconnect();

      // update the clients connection statuses
      await this.$emit('disconnect-clients');

      // update the store
      return this.signOut();
    },
  },
};
</script>

<style src="./Account.css" scoped />
