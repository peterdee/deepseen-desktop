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
  data() {
    return {
      elapsed: 0,
      progress: 0,
      progressClicked: false,
    };
  },
  props: {
    paused: {
      required: true,
      type: Boolean,
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

    // update elapsed time and progress bar
    const { player } = this.$parent.$refs;
    player.ontimeupdate = () => {
      this.elapsed = player.currentTime;
      if (!this.progressClicked) {
        console.log('hit')
        this.progress = Math.round(
          this.elapsed / (this.current.duration / 200),
        );
      }
    };
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
