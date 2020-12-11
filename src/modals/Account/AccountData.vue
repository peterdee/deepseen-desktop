<template>
  <div class="flex direction-column">
    <div class="text-center">
      Hi there, {{ name }}!
    </div>
    <div>
      Desktop app: {{ desktopConnected ? 'connected' : 'not connected' }}
    </div>
    <div>
      Mobile app: {{ mobileConnected ? 'connected' : 'not connected' }}
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
    email: {
      required: true,
      type: String,
    },
    desktopConnected: {
      required: true,
      type: Boolean,
    },
    mobileConnected: {
      required: true,
      type: Boolean,
    },
    name: {
      required: true,
      type: String,
    },
  },
};
</script>
