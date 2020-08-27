<template>
  <div class="controls">
    <audio
      v-if="current.url"
      preload="auto"
      ref="audio"
      :src="current.url"
      :type="current.type"
    />
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
      @input="handleVolume($event)"
    />
  </div>
  <div class="controls">
    <div>
      {{ formatTime(audioTime) }} / {{ formatTime(current.duration) }}
    </div>
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
  computed: {
    ...mapState({
      current: ({ track }) => track.track,
      volume: ({ track }) => track.volume,
    }),
  },
  mounted() {
    const { audio } = this.$refs;

    // update the audio playback time
    audio.ontimeupdate = () => {
      this.audioTime = audio.currentTime;
      if (!this.progressClicked) {
        this.$refs.progress.value = Math.round(
          this.audioTime / (this.current.duration / 200),
        );
      }
    }

    // set audio volume from the Vuex
    audio.volume = this.volume;
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
      const { audio } = this.$refs;
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
      const { audio } = this.$refs;
      return audio.currentTime = (this.current.duration / 200) * event.target.value;
    },
    /**
     * Handle player volume
     * @returns {void}
     */
    handleVolume(event) {
      const { audio } = this.$refs;
      const { value = 0 } = event.target;
      audio.volume = value;
      return this.setVolume(value);
    },
  },
};
</script>

<style src="./Audio.css" />
