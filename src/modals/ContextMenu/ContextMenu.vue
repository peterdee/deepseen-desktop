<template>
  <div>
    <div
      class="background"
      @click="setContextMenuVisibility(false)"
    />
    <div class="content">
      <div class="title">
        {{ trackName }}
      </div>
      <button
        class="action-button menu-button"
        type="button"
        @click="handleDelete()"
      >
        Delete
      </button>
      <button
        class="action-button menu-button"
        type="button"
        @click="setContextMenuVisibility(false)"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

import getNextTrackId from '../../utilities/get-next-track';

export default {
  name: 'ContextMenu',
  computed: {
    ...mapGetters({
      currentId: 'track/getTrackId',
      trackIds: 'playlist/getTrackIds',
    }),
    ...mapState({
      contextTrackId: ({ contextMenu }) => contextMenu.trackId,
      current: ({ track }) => track.track,
      loop: ({ settings }) => settings.loopPlaylist,
      tracks: ({ playlist }) => playlist.tracks,
    }),
    /**
     * Get track name by the track ID
     */
    trackName() {
      const [track = {}] = this.tracks.filter((item) => item.id === this.contextTrackId);
      return track.name || '';
    },
  },
  methods: {
    ...mapActions({
      clearTrack: 'track/clearTrack',
      deleteTrackFromPlaylist: 'playlist/deleteTrack',
      setContextMenuTrackId: 'contextMenu/setTrackId',
      setContextMenuVisibility: 'contextMenu/setVisibility',
    }),
    /**
     * Handle track deleting
     * @returns {Promise<void>}
     */
    async handleDelete() {
      // check if track is playing / selected
      if (this.contextTrackId === this.current.id) {
        const nextId = getNextTrackId(this.trackIds, this.current.id, this.loop);
        await this.clearTrack();
        this.$emit('handle-track-selection', nextId);
      }

      await this.deleteTrackFromPlaylist(this.contextTrackId);
      await this.setContextMenuTrackId('');
      return await this.setContextMenuVisibility(false);
    },
  },
};
</script>

<style src="./ContextMenu.css" scoped />
