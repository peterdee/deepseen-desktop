<template>
  <div class="controls">
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
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import getNextTrackId from '../../utilities/get-next-track';
import getPreviousTrackId from '../../utilities/get-previous-track';

export default {
  name: 'PlaybackControls',
  computed: {
    ...mapGetters({ trackIds: 'playlist/getTrackIds' }),
    ...mapState({
      current: ({ track }) => track.track,
      loop: ({ settings }) => settings.loopPlaylist,
    }),
  },
  methods: {
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

<style src="./PlaybackControls.css" />
