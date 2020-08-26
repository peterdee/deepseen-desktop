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
      <Switch
        label="Loop playlist"
        :value="loop"
        @handle-switch="handleLoopSwitch"
      />
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

import Switch from '../../elements/Switch';

export default {
  name: 'PlaylistActions',
  components: {
    Switch,
  },
  computed: {
    ...mapState({
      current: ({ track }) => track.track,
      loop: ({ settings }) => settings.loop,
      tracks: ({ playlist }) => playlist.tracks,
    }),
  },
  methods: {
    ...mapActions({
      addMultipleTracks: 'playlist/addMultipleTracks',
      clearTrack: 'track/clearTrack',
      emptyPlaylist: 'playlist/clearPlaylist',
      setLoopPlaylist: 'settings/setLoopPlaylist',
      setPlaybackError: 'playbackError/setError',
      setPlaylistActionsVisibility: 'playlistActions/setVisibility',
    }),
    handleLoopSwitch(event) {
      console.log('checkbox', event.target.checked, 'loop', this.loop);
      return this.setLoopPlaylist(event.target.checked);
    },
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
          return this.setPlaybackError('Playlist has invalid format!');
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
        await this.setPlaylistActionsVisibility(false);

        if (error.code && error.code === 'ENOENT') {
          return this.setPlaybackError('Playlist not found!');
        }

        return this.setPlaybackError('Could not open the playlist!');
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
        await this.setPlaylistActionsVisibility(false);
        return this.setPlaybackError('Could not save the playlist!');
      }
    },
  },
};
</script>

<style src="./PlaylistActions.css" scoped />