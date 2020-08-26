<template>
  <div>
    <div
      class="background"
      @click="handleClose()"
    />
    <div class="content">
      <div class="title">
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
