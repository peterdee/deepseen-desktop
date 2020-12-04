<template>
  <div class="flex direction-column">
    <div class="text-center">
      Hi there, {{ name }}!
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
    name: {
      required: true,
      type: String,
    },
  },
};
</script>
