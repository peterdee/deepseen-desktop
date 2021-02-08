<template>
  <div class="flex direction-column">
    <div class="flex justify-content-center align-items-center mb-8">
      <div class="flex justify-content-center align-items-center name-tag fs-24">
        {{ initials }}
      </div>
      <div class="full-name">
        {{ firstName }} {{ lastName }}
      </div>
    </div>
    <div
      v-if="clientTypeError"
      class="mb-8"
    >
      <div class="mb-8">
        It seems that desktop application for your account is already connected
      </div>
      <div class="mb-8">
        Please close all of the other desktop applications for {{ email }} and reconnect
      </div>
      <button
        class="action-button menu-button"
        type="button"
        @click="$emit('reconnect')"
      >
        Reconnect
      </button>
    </div>
    <div
      v-else
      class="mb-8"
    >
      <div class="mb-8">
        Desktop application
        <span :class="desktopConnected ? 'connected' : 'disconnected'">
          {{ desktopConnected ? 'is connected' : 'is not connected' }}
        </span>
      </div>
      <div
        v-if="!desktopConnected"
        class="mb-8"
      >
        <button
          class="action-button menu-button"
          type="button"
          @click="$emit('reconnect')"
        >
          Reconnect
        </button>
      </div>
      <div>
        Mobile application
        <span :class="mobileConnected ? 'connected' : 'disconnected'">
          {{ mobileConnected ? 'is connected' : 'is not connected' }}
        </span>
      </div>
    </div>
    <button
      class="action-button menu-button"
      type="button"
      @click="$emit('sign-out')"
    >
      Sign out
    </button>
  </div>
</template>

<script>
export default {
  name: 'AccountData',
  computed: {
    initials() {
      return `${this.firstName[0] || ''}${this.lastName[0] || ''}`;
    },
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
    email: {
      required: true,
      type: String,
    },
    firstName: {
      required: true,
      type: String,
    },
    lastName: {
      required: true,
      type: String,
    },
    mobileConnected: {
      required: true,
      type: Boolean,
    },
  },
};
</script>

<style src="./AccountData.css" scoped />
