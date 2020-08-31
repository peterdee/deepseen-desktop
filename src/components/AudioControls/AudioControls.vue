<template>
  <div class="controls">
    <button
      type="button"
      @click="handleStop"
    >
      Stop
    </button>
    <button
      type="button"
      @click="$emit('handle-play')"
    >
      {{ paused ? 'Play' : 'Pause' }}
    </button>
    <button
      class="control-button"
      :disabled="trackIds.length === 0"
      type="button"
      @click="playPrevious()"
    >
      ◄
    </button>
    <button
      class="control-button"
      :disabled="trackIds.length === 0"
      type="button"
      @click="playNext()"
    >
      ►
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
import { mapGetters, mapState } from 'vuex';

import formatTime from '../../utilities/format-time';
import getNextTrackId from '../../utilities/get-next-track';
import getPreviousTrackId from '../../utilities/get-previous-track';

export default {
  name: 'Audio',
  data() {
    return {
      elapsed: 0,
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
    ...mapGetters({ trackIds: 'playlist/getTrackIds' }),
    ...mapState({
      current: ({ track }) => track.track,
      loop: ({ settings }) => settings.loop,
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
    /**
     * Handle Stop button
     * @returns {void}
     */
    async handleStop() {
      const { player } = this.$parent.$refs;

      if (!(player && player.src && player.src[player.src.length - 1] !== '/')) {
        return false;
      }

      player.pause();
      player.currentTime = 0;
      player.src = null;

      this.$refs.progress.value = 0;
      this.elapsed = 0;
      return this.$emit('handle-stop');
    },
    /**
     * Play the next track
     * @returns {*}
     */
    playNext() {
      const nextId = getNextTrackId(this.trackIds, this.current.id, this.loop);
      if (!nextId) {
        return false;
      }

      return this.$emit('handle-track-selection', nextId);
    },
    /**
     * Play the previous track
     * @returns {*}
     */
    playPrevious() {
      const previousId = getPreviousTrackId(this.trackIds, this.current.id, this.loop);
      if (!previousId) {
        return false;
      }

      return this.$emit('handle-track-selection', previousId);
    },
  },
};
</script>

<style src="./AudioControls.css" scoped />
