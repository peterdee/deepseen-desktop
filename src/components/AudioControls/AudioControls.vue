<template>
  <div class="controls">
    <button
      type="button"
      @click="$emit('handle-play')"
    >
      {{ paused ? 'Play' : 'Pause' }}
    </button>
    <input
      min="0"
      max="200"
      ref="progress"
      step="1"
      type="range"
      @change="handleProgress"
      @mousedown="progressClicked = true"
      @mouseup="progressClicked = false"
    />
    <input
      min="0"
      max="1"
      ref="volume"
      step="0.01"
      type="range"
      :value="muted ? 0 : volume"
      @input="$emit('handle-volume', $event)"
    />
    {{ formatTime(elapsed) }} / {{ formatTime(current.duration) }}
    <button
      type="button"
      @click="$emit('handle-mute')"
    >
      {{ muted ? 'Unmute' : 'Mute' }}
    </button>
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
    muted: {
      required: true,
      type: Boolean,
    },
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
  },
  mounted() {
    // set the volume on mount
    this.$refs.volume.value = this.muted ? 0 : this.volume;

    // update elapsed time and progress bar
    const { player } = this.$parent.$refs;
    player.ontimeupdate = () => {
      this.elapsed = player.currentTime;
      if (!this.progressClicked) {
        this.$refs.progress.value = Math.round(
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
    /**
     * Handle track progress click
     * @param {*} event - click event
     * @returns {void}
     */
    handleProgress(event) {
      const { player } = this.$parent.$refs;
      return player.currentTime = (this.current.duration / 200) * event.target.value;
    },
  },
};
</script>

<style src="./AudioControls.css" />
