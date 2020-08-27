<template>
  <div class="controls">
    <button
      type="button"
      @click="handlePlay()"
    >
      {{ this.paused ? 'Play' : 'Pause' }}
    </button>
    <input
      min="0"
      max="200"
      ref="progress"
      step="1"
      type="range"
      @change="handleProgress($event)"
      @mousedown="progressClicked = true"
      @mouseup="progressClicked = false"
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
    {{ formatTime(audioTime) }} / {{ formatTime(current.duration) }}
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import formatTime from '../../utilities/format-time';

export default {
  name: 'Audio',
  data() {
    return {
      audioTime: 0,
      paused: true,
      progressClicked: false,
    };
  },
  props: {
    volume: {
      required: true,
      type: [Number, String],
    },
  },
  computed: {
    ...mapState({
      current: ({ track }) => track.track,
      volume: ({ track }) => track.volume,
    }),
  },
  mounted() {
    this.$refs.volume.value = this.volume;
  },
  methods: {
    ...mapActions({
      setProgress: 'track/setProgress',
      setVolume: 'track/setVolume',
    }),
    /**
     * Format time
     */
    formatTime(value) {
      return formatTime(value);
    },
    /**
     * Handle the Play button
     * @returns {void}
     */
    handlePlay() {
      const { player: audio } = this;
      // TODO: fix an issue with paused / unpaused state
      if (audio.paused) {
        this.paused = false;
        return audio.play();
      }

      this.paused = true;
      return audio.pause();
    },
    /**
     * Handle track progress
     * @returns {void}
     */
    handleProgress(event) {
      const { player: audio } = this;
      return audio.currentTime = (this.current.duration / 200) * event.target.value;
    },
  },
};
</script>

<style src="./Audio.css" />
