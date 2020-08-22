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
import { mapActions, mapState } from 'vuex';

export default {
  name: 'ContextMenu',
  computed: {
    ...mapState({
      contextTrackId: ({ contextMenu }) => contextMenu.trackId,
      track: ({ track }) => track.track,
      tracks: ({ playlist }) => playlist.tracks,
    }),
    /**
     * Get track name by the track ID
     */
    trackName() {
      const [track = {}] = this.tracks.filter((item) => item.id === this.contextTrackId);
      return track.name;
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
      try {
        await this.clearTrack();
        await this.deleteTrackFromPlaylist(this.contextTrackId);
        await this.setContextMenuTrackId('');
        return this.setContextMenuVisibility(false);
      } catch (error) {
        // TODO: show an error modal
        return console.log(error);
      }
    },
  },
};
</script>

<style src="./ContextMenu.css" scoped />
