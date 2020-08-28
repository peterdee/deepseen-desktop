<template>
  <div class="controls">
    <button
      type="button"
      @click="$emit('handle-play')"
    >
      {{ this.paused ? 'Play' : 'Pause' }}
    </button>
    <input
      min="0"
      max="200"
      ref="progress"
      step="1"
      type="range"
      @change="$emit('handle-progress', $event)"
      @mousedown="$emit('handle-progress-clicked', true)"
      @mouseup="$emit('handle-progress-clicked', false)"
    />
    <input
      min="0"
      max="1"
      ref="volume"
      step="0.01"
      type="range"
      :value="volume"
      @input="$emit('handle-volume', $event)"
    />
    {{ formatTime(elapsed) }} / {{ formatTime(current.duration) }}
  </div>
</template>

<script>
import { mapState } from 'vuex';

import formatTime from '../../utilities/format-time';

export default {
  name: 'Audio',
  props: {
    elapsed: {
      default() {
        return 0;
      },
      required: false,
      type: [Number, String],
    },
    paused: {
      required: true,
      type: Boolean,
    },
    progress: {
      default() {
        return 0;
      },
      required: false,
      type: [Number, String],
    },
    volume: {
      required: true,
      type: [Number, String],
    },
  },
  computed: {
    ...mapState({
      current: ({ track }) => track.track,
    }),
    progressBar() {
      console.log
      const { progress } = this.$refs;
      progress.value = this.progress;
      return false;
    },
  },
  mounted() {
    // set the volume on mount
    this.$refs.volume.value = this.volume;
  },
  methods: {
    /**
     * Format time
     * @param {number} value - time value in seconds
     * @returns {void}
     */
    formatTime(value) {
      return formatTime(value);
    },
  },
};
</script>

<style src="./AudioControls.css" />
