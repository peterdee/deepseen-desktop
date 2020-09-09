<template>
  <div>
    <div
      class="background"
      @click="handleClose()"
    />
    <div class="flex direction-column justify-content-space-between content">
      <div class="title fs-18">
        Error!
      </div>
      <div class="message">
        {{ message }}
      </div>
      <button
        class="action-button menu-button"
        type="button"
        @click="handleClose()"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'PlaybackError',
  computed: {
    ...mapState({
      message: ({ playbackError }) => playbackError.message,
    }),
  },
  methods: {
    ...mapActions({
      setError: 'playbackError/setError',
    }),
    /**
     * Close modal
     * @returns {Promise<*>}
     */
    handleClose() {
      return this.setError('');
    },
  },
};
</script>

<style src="./PlaybackError.css" scoped />
