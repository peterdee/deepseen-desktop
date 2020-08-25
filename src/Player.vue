<template>
  <div id="app">
    <ContextMenu
      v-if="contextMenu"
      @handle-track-selection="handleTrackSelection($event)"
    />
    <PlaylistActions
      v-if="playlistActions"
      @handle-track-selection="handleTrackSelection($event)"
    />
    <div class="player">
      <div>
        {{ currentlyPlaying }}
      </div>
      <div>
        <audio
          v-if="current.url"
          preload="auto"
          ref="player"
          :src="current.url"
          :type="current.type"
          controls
        />
      </div>
      <Playlist @select-track="handleTrackSelection($event)" />
    </div>
    <TotalPlaybackTime /> 
    <PlaybackControls
      @handle-track-selection="handleTrackSelection($event)"
    />
    <button
      class="action-button"
      type="button"
      @click="setPlaylistActionsVisibility(true)"
    >
      Playlist Actions
    </button>
    <div v-if="playbackError">
      <PlaybackError
        :message="playbackError"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { promises as fs } from 'fs';

import getNextTrackId from './utilities/get-next-track';

import ContextMenu from './modals/ContextMenu/ContextMenu';
import PlaybackControls from './components/PlaybackControls/PlaybackControls';
import PlaybackError from './components/PlaybackError';
import Playlist from './components/Playlist/Playlist';
import PlaylistActions from './modals/PlaylistActions/PlaylistActions';
import TotalPlaybackTime from './components/TotalPlaybackTime/TotalPlaybackTime';

export default {
  name: 'Player',
  components: {
    ContextMenu,
    PlaybackControls,
    PlaybackError,
    Playlist,
    PlaylistActions,
    TotalPlaybackTime,
  },
  data() {
    return {
      appName: 'Audio Player',
      playbackError: '',
    };
  },
  computed: {
    ...mapGetters({
      trackIds: 'playlist/getTrackIds',
    }),
    ...mapState({
      contextMenu: ({ contextMenu }) => contextMenu.visibility,
      current: ({ track }) => track.track,
      loop: ({ settings }) => settings.loopPlaylist,
      playlistActions: ({ playlistActions }) => playlistActions.visibility,
      tracks: ({ playlist }) => playlist.tracks,
    }),
    /**
     * Currently playing track name
     */
    currentlyPlaying() {
      return this.current.name || this.appName;
    },
  },
  async mounted() {
    // load the file but do not play it
    if (this.current.id) {
      this.handleTrackSelection(this.current.id, false);
    }
  },
  methods: {
    ...mapActions({
      addTrack: 'playlist/addTrack',
      clearTrack: 'track/clearTrack',
      setPlaylistActionsVisibility: 'playlistActions/setVisibility',
      setTrack: 'track/setTrack',
    }),
    /**
     * Handle track selection
     * @param {string} id - selected track ID
     * @param {boolean} play - start playing the selected track
     * @returns {Promise<*>}
     */
    async handleTrackSelection(id = '', play = true) {
      try {
        // stop the playback if there's no ID
        if (!id) {
          return this.clearTrack();
        }

        // open a file
        const [track = {}] = this.tracks.filter((item) => item.id === id);
        const buffer = await fs.readFile(track.path);
        const url = URL.createObjectURL(new Blob([buffer], { type: track.type }));
        await this.setTrack({
          ...track,
          url,
        });

        const { player } = this.$refs;
        player.oncanplay = () => {
          // play the next track when current one ends
          player.onended = () => this.handleTrackSelection(
            getNextTrackId(this.trackIds, this.current.id, this.loop),
          );

          // play the current track
          return play && player.play();
        };
      } catch (error) {
        // handle the case with missing file (skip it)
        const { code = '' } = error;
        if (code && code === 'ENOENT') {
          const nextId = getNextTrackId(this.trackIds, id, this.loop);
          return this.handleTrackSelection(nextId);
        }

        // in any other case show an error TODO: error modal 
        return this.playbackError = 'Error!';
      }
    },
  },
};
</script>

<style src="./Player.css" />
