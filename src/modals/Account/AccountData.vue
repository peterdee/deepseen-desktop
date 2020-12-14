<template>
  <div class="flex direction-column">
    <div class="text-center">
      Hi there, {{ firstName }} {{ lastName }}!
    </div>
    <div v-if="clientTypeError">
      <div>
        It seems that desktop application for your account is already connected.
      </div>
      <div>
        Please close all of the other desktop applications for {{ email }} and click on the "Reconnect".
      </div>
      <button
        class="action-button menu-button"
        type="button"
        @click="$emit('reconnect')"
      >
        Reconnect
      </button>
    </div>
    <div v-else>
      <div>
        Desktop app: {{ desktopConnected ? 'connected' : 'not connected' }}
      </div>
      <div v-if="!desktopConnected">
        <button
          class="action-button menu-button"
          type="button"
          @click="$emit('reconnect')"
        >
          Reconnect
        </button>
      </div>
      <div>
        Mobile app: {{ mobileConnected ? 'connected' : 'not connected' }}
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
