<template>
  <div>
    <ContextMenu
      v-if="contextMenu"
      @handle-track-selection="handleTrackSelection"
    />
    <PlaylistActions
      v-if="playlistActions"
      @handle-track-selection="handleTrackSelection"
    />
    <PlaybackError v-if="playbackError" />
    <div class="player">
      <div>
        {{ currentlyPlaying }}
      </div>
      <audio
        preload="auto"
        ref="player"
        :src="current.url"
        :type="current.type"
      />
      <AudioControls
        :muted="muted"
        :paused="paused"
        :volume="volume"
        @handle-mute="handleMute"
        @handle-play="handlePlay"
        @handle-stop="handleStop"
        @handle-track-selection="handleTrackSelection"
        @handle-volume="handleVolume"
      />
      <Playlist @handle-track-selection="handleTrackSelection" />
    </div>
    <TotalPlaybackTime /> 
    <button
      class="action-button"
      type="button"
      @click="setPlaylistActionsVisibility(true)"
    >
      Playlist Actions
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { promises as fs } from 'fs';

import getNextTrackId from './utilities/get-next-track';

import AudioControls from './components/AudioControls/AudioControls';
import ContextMenu from './modals/ContextMenu/ContextMenu';
import PlaybackError from './modals/PlaybackError/PlaybackError';
import Playlist from './components/Playlist/Playlist';
import PlaylistActions from './modals/PlaylistActions/PlaylistActions';
import TotalPlaybackTime from './components/TotalPlaybackTime/TotalPlaybackTime';

export default {
  name: 'Player',
  components: {
    AudioControls,
    ContextMenu,
    PlaybackError,
    Playlist,
    PlaylistActions,
    TotalPlaybackTime,
  },
  data() {
    return {
      appName: 'DeepSeen',
      paused: true,
    };
  },
  computed: {
    ...mapGetters({
      trackIds: 'playlist/getTrackIds',
    }),
    ...mapState({
      contextMenu: ({ contextMenu }) => contextMenu.visibility,
      current: ({ track }) => track.track,
      loop: ({ settings }) => settings.loop,
      muted: ({ track }) => track.muted,
      playbackError: ({ playbackError }) => playbackError.message,
      playlistActions: ({ playlistActions }) => playlistActions.visibility,
      shuffle: ({ settings }) => settings.shuffle,
      shuffled: ({ playlist }) => playlist.shuffled,
      tracks: ({ playlist }) => playlist.tracks,
      volume: ({ track }) => track.volume,
    }),
    /**
     * Currently playing track name
     */
    currentlyPlaying() {
      return this.current.name || this.appName;
    },
  },
  async mounted() {
    const { player } = this.$refs;

    // load the file but do not play it
    if (this.current.id) {
      this.handleTrackSelection(this.current.id, true);
    }

    // reshuffle the tracks
    if (this.shuffle) {
      await this.reshuffle(this.trackIds);
      console.log(this.shuffled)
    }

    // play the next track when current one ends
    player.onended = () => this.handleTrackSelection(
      getNextTrackId(this.trackIds, this.current.id, this.loop),
    );

    // handle the 'can play' event
    player.oncanplay = () => {
      // make sure that the volume is correct
      player.volume = this.muted ? 0 : this.volume;

      // play the current track if playback is not paused
      if (!this.paused) {
        return player.play();
      }
    };
  },
  methods: {
    ...mapActions({
      addTrack: 'playlist/addTrack',
      clearTrack: 'track/clearTrack',
      reshuffle: 'playlist/reshuffle',
      setMuted: 'track/setMuted',
      setPlaybackError: 'playbackError/setError',
      setPlaylistActionsVisibility: 'playlistActions/setVisibility',
      setTrack: 'track/setTrack',
      setVolume: 'track/setVolume',
    }),
    /**
     * Handle Mute button
     * @returns {void}
     */
    handleMute() {
      const { player } = this.$refs;
      if (!this.muted) {
        player.volume = 0;
      } else {
        player.volume = this.volume;
      }
      return this.setMuted(!this.muted);
    },
    /**
     * Handle Play button
     * @returns {void}
     */
    handlePlay() {
      const { player } = this.$refs;

      if (!(player && player.src && player.src[player.src.length - 1] !== '/')) {
        return false;
      }

      if (player.paused) {
        this.paused = false;
        return player.play();
      }

      this.paused = true;
      return player.pause();
    },
    /**
     * Handle track stop
     * @returns {void}
     */
    handleStop() {
      const { player } = this.$refs;
      player.currentTime = 0;
      player.pause();
      return this.paused = true;
    },
    /**
     * Handle track selection
     * @param {string} id - selected track ID
     * @param {boolean} paused - paused value determines if the playback should be paused
     * @returns {Promise<*>}
     */
    async handleTrackSelection(id = '', paused = false) {
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

        // keep the playback paused if necessary
        if (paused) {
          return this.paused = true;
        }

        return this.paused = false;
      } catch (error) {
        // handle the case with missing file (skip it)
        const { code = '' } = error;
        if (code && code === 'ENOENT') {
          const nextId = getNextTrackId(this.trackIds, id, this.loop);
          return this.handleTrackSelection(nextId);
        }

        // in any other case show an error
        return this.setPlaybackError('Error playing a file!');
      }
    },
    /**
     * Handle player volume
     * @param {*} event - input event
     * @returns {void}
     */
    async handleVolume(event) {
      const { player } = this.$refs;
      const { value } = event.target;

      // update the player volume only if player has a source
      if (player && (player.volume || player.volume === 0)) {
        player.volume = value;
      }

      // unmute if it was muted
      if (this.muted) {
        await this.setMuted(false);
      }

      return this.setVolume(value);
    },
  },
};
</script>

<style src="./Player.css" />
