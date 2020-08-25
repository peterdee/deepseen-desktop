<template>
  <div>
    <div
      class="background"
      @click="setPlaylistActionsVisibility(false)"
    />
    <div class="content">
      <div class="title">
        Playlist Actions
      </div>
      <button
        class="action-button menu-button"
        type="button"
        @click="openPlaylist()"
      >
        Open playlist
      </button>
      <button
        class="action-button menu-button"
        :disabled="this.tracks.length === 0"
        type="button"
        @click="savePlaylist()"
      >
        Save playlist
      </button>
      <button
        class="action-button menu-button"
        type="button"
        @click="clearPlaylist()"
      >
        Clear playlist
      </button>
      <button
        class="action-button menu-button"
        type="button"
        @click="setPlaylistActionsVisibility(false)"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { remote as electron } from 'electron';
import { mapActions, mapState } from 'vuex';
import { promises as fs } from 'fs';

export default {
  name: 'PlaylistActions',
  computed: {
    ...mapState({
      current: ({ track }) => track.track,
      loop: ({ settings }) => settings.loopPlaylist,
      tracks: ({ playlist }) => playlist.tracks,
    }),
  },
  methods: {
    ...mapActions({
      addMultipleTracks: 'playlist/addMultipleTracks',
      clearTrack: 'track/clearTrack',
      emptyPlaylist: 'playlist/clearPlaylist',
      setPlaylistActionsVisibility: 'playlistActions/setVisibility',
    }),
    /**
     * Clear playlist
     * @returns {Promise<void>}
     */
    async clearPlaylist() {
      // clear the current track
      await this.clearTrack();

      // clear the playlist
      await this.emptyPlaylist();

      // close the modal
      return this.setPlaylistActionsVisibility(false);
    },
    /**
     * Open an existing playlist
     * @returns {Promise<*>}
     */
    async openPlaylist() {
      try {
        const {
          canceled = false,
          filePaths = [],
        } = await electron.dialog.showOpenDialog(null, ['openFile']);
        if (canceled) {
          return false;
        }

        // open the file and convert it
        const buffer = await fs.readFile(filePaths[0]);
        const string = await buffer.toString('utf8');

        // validate the string
        let tracks = [];
        try {
          tracks = JSON.parse(string);
        } catch (error) {
          // TODO: show an error
          return console.log('-- saving error', error);
        }

        // close the modal
        await this.setPlaylistActionsVisibility(false);

        if (tracks.length > 0) {
          // update the playlist
          await this.addMultipleTracks(tracks);
          
          // play the first track
          return this.$emit('handle-track-selection', tracks[0].id);
        }
      } catch (error) {
        // close the modal
        await this.setPlaylistActionsVisibility(false);

        // TODO: error modal via Vuex
        if (error.code && error.code === 'ENOENT') {
          return console.log('-- opening error: ENOENT', error);
        }

        return console.log('-- saving error', error);
      }
    },
    /**
     * Save current playlist to the disk
     * @returns {Promise<*>}
     */
    async savePlaylist() {
      try {
        const { canceled = false, filePath = '' } = await electron.dialog.showSaveDialog(
          null,
          {
            title: 'Save playlist',
            buttonLabel: 'Save',
            message: 'Please provide the playlist name',
          },
        );

        // close the modal
        await this.setPlaylistActionsVisibility(false);

        if (canceled) {
          return false;
        }

        return fs.writeFile(`${filePath}.spl`, JSON.stringify(this.tracks));
      } catch (error) {
        // close the modal
        await this.setPlaylistActionsVisibility(false);

        // TODO: error modal via Vuex
        return console.log('-- saving error', error);
      }
    },
  },
};
</script>

<style src="./PlaylistActions.css" scoped />
