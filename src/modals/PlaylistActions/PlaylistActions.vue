<template>
  <div>
    <div
      class="modal-background"
      @click="setPlaylistActionsVisibility(false)"
    />
    <div class="flex direction-column justify-content-space-between content noselect">
      <div class="fs-18">
        Playlist Actions
      </div>
      <div class="flex justify-content-start menu-button">
        <Switch
          @handle-switch="handleLoopSwitch"
          label="Loop playlist"
          :value="loop"
        />
      </div>
      <div class="flex justify-content-start menu-button">
        <Switch
          @handle-switch="handleShuffleSwitch"
          label="Shuffle playlist"
          :value="shuffle"
        />
      </div>
      <button
        class="action-button menu-button"
        @click="handleSortByDate"
        :disabled="tracks.length === 0"
        type="button"
      >
        Sort by date
      </button>
      <button
        class="action-button menu-button"
        @click="handleSortByName"
        :disabled="tracks.length === 0"
        type="button"
      >
        Sort by name
      </button>
      <button
        class="action-button menu-button"
        @click="randomizeTracks"
        :disabled="tracks.length === 0"
        type="button"
      >
        Randomize tracks
      </button>
      <button
        class="action-button menu-button"
        @click="openPlaylist"
        type="button"
      >
        Open playlist
      </button>
      <button
        class="action-button menu-button"
        @click="savePlaylist"
        :disabled="tracks.length === 0"
        type="button"
      >
        Save playlist
      </button>
      <button
        class="action-button menu-button"
        @click="clearPlaylist"
        type="button"
      >
        Clear playlist
      </button>
      <button
        class="action-button menu-button"
        @click="setPlaylistActionsVisibility(false)"
        type="button"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { remote as electron } from 'electron';
import { mapActions, mapGetters, mapState } from 'vuex';
import { promises as fs } from 'fs';

import { PLAYLIST_EXTENSION } from '../../configuration';
import Switch from '../../elements/Switch';

export default {
  name: 'PlaylistActions',
  components: {
    Switch,
  },
  computed: {
    ...mapGetters({
      trackIds: 'playlist/getTrackIds',
    }),
    ...mapState({
      current: ({ track }) => track.track,
      loop: ({ settings }) => settings.loop,
      shuffle: ({ settings }) => settings.shuffle,
      tracks: ({ playlist }) => playlist.tracks,
    }),
  },
  methods: {
    ...mapActions({
      addMultipleTracks: 'playlist/addMultipleTracks',
      clearTrack: 'track/clearTrack',
      clearPlaybackQueue: 'playbackQueue/clearQueue',
      emptyPlaylist: 'playlist/clearPlaylist',
      reshuffle: 'playlist/reshuffle',
      randomizePlaylist: 'playlist/randomizeTracks',
      setLoopPlaylist: 'settings/setLoopPlaylist',
      setPlaybackError: 'playbackError/setError',
      setPlaylistActionsVisibility: 'playlistActions/setVisibility',
      setPlaylistShuffling: 'settings/setPlaylistShuffling',
      sortByDate: 'playlist/sortByDate',
      sortByName: 'playlist/sortByName',
    }),
    /**
     * Handle playlist sorting by date
     * @returns {Promise<void>}
     */
    async handleSortByDate() {
      await this.sortByDate();
      return this.setPlaylistActionsVisibility(false);
    },
    /**
     * Handle playlist sorting by name
     * @returns {Promise<void>}
     */
    async handleSortByName() {
      await this.sortByName();
      return this.setPlaylistActionsVisibility(false);
    },
    /**
     * Handle loop switch click
     * @param {*} event - click event
     * @returns {void}
     */
    handleLoopSwitch(event) {
      return this.setLoopPlaylist(event.target.checked);
    },
    /**
     * Handle shuffle switch click
     * @param {*} event - click event
     * @returns {Promise<void>}
     */
    async handleShuffleSwitch(event) {
      await this.reshuffle(this.trackIds);
      return this.setPlaylistShuffling(event.target.checked);
    },
    /**
     * Clear playlist
     * @returns {Promise<void>}
     */
    async clearPlaylist() {
      // clear the playback queue
      await this.clearPlaybackQueue();

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
        } = await electron.dialog.showOpenDialog(
          null,
          {
            buttonLabel: 'Open',
            filters: [{
              extensions: [PLAYLIST_EXTENSION],
              name: 'Deepseen playlist',
            }],
            properties: ['openFile'],
            title: 'Open a playlist',
          },
        );
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
     * Randomize track order
     * @returns {Promise<void>}
     */
    async randomizeTracks() {
      // clear the playlist
      await this.randomizePlaylist();

      // close the modal
      return this.setPlaylistActionsVisibility(false);
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

        return fs.writeFile(`${filePath}.${PLAYLIST_EXTENSION}`, JSON.stringify(this.tracks));
      } catch (error) {
        await this.setPlaylistActionsVisibility(false);
        return this.setPlaybackError('Could not save the playlist!');
      }
    },
  },
};
</script>

<style src="./PlaylistActions.css" scoped />
