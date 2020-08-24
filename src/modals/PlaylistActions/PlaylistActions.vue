<template>
  <div>
    Modal
  </div>
</template>

<script>
import { remote as electron } from 'electron';
import { mapActions, mapGetters, mapState } from 'vuex';
import { promises as fs } from 'fs';

export default {
  name: 'PlaylistActions',
  computed: {
    ...mapGetters({
      trackIds: 'playlist/getTrackIds',
    }),
    ...mapState({
      current: ({ track }) => track.track,
      loop: ({ settings }) => settings.loopPlaylist,
      tracks: ({ playlist }) => playlist.tracks,
    }),
  },
  methods: {
    ...mapActions({
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

        // update the playlist
        this.playlist = JSON.parse(string);

        // play the first file if playlist is not empty
        if (this.playlist.length > 0) {
          return this.handleTrackSelection(this.playlist[0].id);
        }
      } catch (error) {
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
        if (canceled) {
          return false;
        }
        
        return fs.writeFile(`${filePath}.spl`, JSON.stringify(this.tracks));
      } catch (error) {
        // TODO: error modal via Vuex
        return console.log('-- saving error', error);
      }
    },

  },
};
</script>

<style src="./PlaylistActions.css" scoped />
