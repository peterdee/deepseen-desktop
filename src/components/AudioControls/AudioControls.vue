<template>
  <div class="controls noselect">
    <button
      class="button pointer"
      @click="handleStop"
      type="button"
    >
      <img
        alt="Stop"
        class="icon pointer"
        :src="stopIcon"
      />
    </button>
    <button
      class="button pointer"
      @click="$emit('handle-play')"
      type="button"
    >
      <img
        :alt="paused ? 'Play' : 'Pause'"
        class="icon pointer"
        :src="paused ? playIcon : pauseIcon"
      />
    </button>
    <button
      class="button pointer"
      @click="playPrevious()"
      :disabled="trackIds.length === 0 || shuffle"
      type="button"
    >
      <img
        alt="Previous"
        class="icon pointer"
        :src="previousIcon"
      />
    </button>
    <button
      class="button pointer"
      @click="playNext()"
      :disabled="trackIds.length === 0"
      type="button"
    >
      <img
        alt="Next"
        class="icon pointer"
        :src="nextIcon"
      />
    </button>
    <input
      class="progress"
      :disabled="trackIds.length === 0"
      min="0"
      max="200"
      ref="progress"
      step="1"
      type="range"
      @change="handleProgress"
      @mousedown="progressClicked = true"
      @mouseup="progressClicked = false"
    />
    {{ formatTime(elapsed) }} / {{ formatTime(current.duration) }}
    <input
      class="volume"
      min="0"
      max="1"
      ref="volume"
      step="0.01"
      type="range"
      :value="muted ? 0 : volume"
      @input="$emit('handle-volume', $event)"
    />
    <button
      class="button pointer"
      @click="$emit('handle-mute')"
      :disabled="volume === 0"
      type="button"
    >
      <img
        :alt="muted ? 'Unmute' : 'Mute'"
        class="icon pointer"
        :src="muted ? mutedIcon : volumeIcon"
      />
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

import formatTime from '../../utilities/format-time';
import getNextTrackId from '../../utilities/get-next-track';
import getPreviousTrackId from '../../utilities/get-previous-track';

export default {
  name: 'Audio',
  data() {
    return {
      elapsed: 0,
      mutedIcon: require('../../assets/muted.svg'),
      nextIcon: require('../../assets/next.svg'),
      pauseIcon: require('../../assets/pause.svg'),
      playIcon: require('../../assets/play.svg'),
      previousIcon: require('../../assets/previous.svg'),
      progressClicked: false,
      stopIcon: require('../../assets/stop.svg'),
      volumeIcon: require('../../assets/volume.svg'),
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
      playbackQueue: ({ playbackQueue }) => playbackQueue.queue,
      shuffle: ({ settings }) => settings.shuffle,
      shuffled: ({ playlist }) => playlist.shuffled,
    }),
  },
  mounted() {
    // set values on mount
    const { progress, volume } = this.$refs;
    progress.value = 0;
    volume.value = this.muted ? 0 : this.volume;

    // update elapsed time and progress bar
    const { player } = this.$parent.$refs;
    player.ontimeupdate = () => {
      this.elapsed = player.currentTime;
      if (!this.progressClicked) {
        progress.value = this.elapsed === 0
          ? 0
          : Math.round(this.elapsed / (this.current.duration / 200));
      }
    };
  },
  methods: {
    ...mapActions({
      removeFromQueue: 'playbackQueue/deleteTrack',
      reshuffle: 'playlist/reshuffle',
      setShuffledTrackAsPlayed: 'playlist/setShuffledTrackAsPlayed',
    }),
    /**
     * Format time
     * @param {number} value - time value in seconds
     * @returns {void}
     */
    formatTime(value) {
      return formatTime(value);
    },
    /**
     * Handle track stop
     * @returns {void}
     */
    handleStop() {
      this.elapsed = 0;
      this.$refs.progress.value = 0;
      return this.$emit('handle-stop');
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
     * Play the next track
     * @returns {*}
     */
    async playNext() {
      // check the playback queue first
      if (this.playbackQueue.length > 0) {
        const [nextId = ''] = this.playbackQueue;
        await this.removeFromQueue(nextId);
        return this.$emit('handle-track-selection', nextId);
      }

      // get the next track ID
      const nextId = getNextTrackId(
        this.trackIds,
        this.current.id,
        this.loop,
        this.shuffle,
        this.shuffled,
      );

      if (!nextId) {
        return false;
      }

      // handle the reshuffle
      if (nextId === 'reshuffle') {
        await this.reshuffle(this.trackIds);
        return this.playNext();
      }

      // update an item in the shuffled array
      if (this.shuffle) {
        await this.setShuffledTrackAsPlayed(nextId);
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
