<template>
  <div class="player">
    <About v-if="aboutVisibility" />
    <Account
      v-if="accountVisibility"
      :clientTypeError="clientTypeError"
      :desktopConnected="desktopConnected"
      :mobileConnected="mobileConnected"
      @disconnect-clients="disconnectClients"
      @reconnect="connectSockets"
    />
    <ContextMenu
      v-if="contextMenu"
      @handle-track-selection="handleTrackSelection"
    />
    <PlaybackError v-if="playbackError" />
    <PlaylistActions
      v-if="playlistActions"
      @handle-track-selection="handleTrackSelection"
    />
    <button
      class="title noselect fs-24"
      @contextmenu="openContextMenuForCurrent"
      @dblclick="openContextMenuForCurrent"
      type="button"
    >
      {{ currentlyPlaying || appName }}
    </button>
    <audio
      preload="auto"
      ref="player"
      :src="current.url"
      :type="current.type"
    />
    <AudioControls
      :mobileConnected="mobileConnected"
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
    <div class="flex justify-content-space-between align-items-center status-bar">
      <TotalPlaybackTime />
      <StatusBar
        :desktopConnected="desktopConnected"
        :mobileConnected="mobileConnected"
      />
    </div> 
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import { mapActions, mapGetters, mapState } from 'vuex';
import { promises as fs } from 'fs';

import checkToken from './utilities/check-token';
import { CLIENTS, CLIENT_TYPE, EVENTS } from './configuration';
import formatTrackName from './utilities/format-track-name';
import getNextTrackId from './utilities/get-next-track';

import About from './modals/About/About';
import Account from './modals/Account/Account';
import AudioControls from './components/AudioControls/AudioControls';
import ContextMenu from './modals/ContextMenu/ContextMenu';
import PlaybackError from './modals/PlaybackError/PlaybackError';
import Playlist from './components/Playlist/Playlist';
import PlaylistActions from './modals/PlaylistActions/PlaylistActions';
import StatusBar from './components/StatusBar/StatusBar';
import TotalPlaybackTime from './components/TotalPlaybackTime/TotalPlaybackTime';

export default {
  name: 'Player',
  components: {
    About,
    Account,
    AudioControls,
    ContextMenu,
    PlaybackError,
    Playlist,
    PlaylistActions,
    StatusBar,
    TotalPlaybackTime,
  },
  data() {
    return {
      appName: 'Deepseen',
      clientTypeError: false,
      desktopConnected: false,
      mobileConnected: false,
      paused: true,
    };
  },
  computed: {
    ...mapGetters({
      trackIds: 'playlist/getTrackIds',
    }),
    ...mapState({
      aboutVisibility: ({ about }) => about.visibility,
      accountVisibility: ({ account }) => account.visibility,
      contextMenu: ({ contextMenu }) => contextMenu.visibility,
      current: ({ track }) => track.track,
      isAuthenticated: ({ account }) => account.isAuthenticated,
      loop: ({ settings }) => settings.loop,
      muted: ({ track }) => track.muted,
      playbackError: ({ playbackError }) => playbackError.message,
      playbackQueue: ({ playbackQueue }) => playbackQueue.queue,
      playlistActions: ({ playlistActions }) => playlistActions.visibility,
      shuffle: ({ settings }) => settings.shuffle,
      shuffled: ({ playlist }) => playlist.shuffled,
      token: ({ account }) => account.token,
      tracks: ({ playlist }) => playlist.tracks,
      volume: ({ track }) => track.volume,
    }),
    /**
     * Currently playing track name
     */
    currentlyPlaying() {
      if (this.current.name) {
        return formatTrackName(this.current.name);
      }
      return '';
    },
  },
  watch: {
    // restore Websockets connection if user signs in
    isAuthenticated(newState) {
      if (newState) {
        return this.connectSockets();
      }
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
    }

    // play the next track when current one ends
    player.onended = () => this.handleTrackSwitchOnEnd();

    // handle the 'can play' event
    player.oncanplay = () => {
      // make sure that the volume is correct
      player.volume = this.muted ? 0 : this.volume;

      // play the current track if playback is not paused
      if (!this.paused) {
        return player.play();
      }
    };

    // handle app menu: show About modal
    ipcRenderer.on('show-about', () => this.setAboutVisibility(true));

    // Websockets connection
    await this.connectSockets();

    // Websockets handlers
    this.$io().on(
      EVENTS.CLIENT_DISCONNECTED,
      (data) => {
        const { client = '' } = data;
        if (client === CLIENTS.mobile) {
          this.mobileConnected = false;
        }
      },
    );
    this.$io().on(
      EVENTS.CLIENT_TYPE_IS_ALREADY_ONLINE,
      async (data) => {
        const { client = '' } = data;
        if (client !== CLIENT_TYPE) {
          return false;
        }

        this.disconnectClients();
        this.clientTypeError = true;
      },
    );
    this.$io().on(
      EVENTS.CONNECT_ERROR,
      () => {
        this.disconnectClients();
        this.setPlaybackError('Error connecting to the backend!')
        return this.signOut();
      },
    );
    this.$io().on(
      EVENTS.DISCONNECT,
      () => this.disconnectClients(),
    );
    this.$io().on(
      EVENTS.NEW_CLIENT_CONNECTED,
      (data) => {
        const { client = '' } = data;
        if (client === CLIENTS.mobile) {
          this.mobileConnected = true;
        }
      },
    );
    this.$io().on(
      EVENTS.ROOM_STATUS,
      (data) => {
        const { room = [], target = '' } = data;
        if (target !== CLIENT_TYPE) {
          return false;
        }

        const socketId = this.$io().id;
        const { desktop = null, mobile = null } = room.reduce((obj, item) => {
          if (item.socketId === socketId) {
            return {
              ...obj,
              [CLIENTS.desktop]: { ...item },
            };
          }
          if (item.client === CLIENTS.mobile) {
            return {
              ...obj,
              [CLIENTS.mobile]: { ...item },
            };
          }
        }, {});

        if (desktop) {
          this.desktopConnected = true;
        }
        if (mobile) {
          this.mobileConnected = true;
        }
      },
    );
    this.$io().on(
      EVENTS.UPDATE_MUTE,
      (data) => {
        const { target = '' } = data;
        if (target !== CLIENT_TYPE) {
          return false;
        }

        return this.handleMute();
      },
    );
    this.$io().on(
      EVENTS.UPDATE_VOLUME,
      (data) => {
        const { target = '', volume = 0 } = data;
        if (target !== CLIENT_TYPE) {
          return false;
        }

        const adjusted = Number(volume) / 100;
        return this.handleVolume(
          {
            target: {
              value: adjusted,
            },
          },
          false,
        );
      },
    );
  },
  methods: {
    ...mapActions({
      addTrack: 'playlist/addTrack',
      clearTrack: 'track/clearTrack',
      removeFromQueue: 'playbackQueue/deleteTrack',
      reshuffle: 'playlist/reshuffle',
      setAboutVisibility: 'about/setVisibility',
      setAvailability: 'playlist/setAvailability',
      setContextMenuTrackId: 'contextMenu/setTrackId',
      setContextMenuVisibility: 'contextMenu/setVisibility',
      setMuted: 'track/setMuted',
      setPlaybackError: 'playbackError/setError',
      setPlaylistActionsVisibility: 'playlistActions/setVisibility',
      setShuffledTrackAsPlayed: 'playlist/setShuffledTrackAsPlayed',
      setTrack: 'track/setTrack',
      setVolume: 'track/setVolume',
      signOut: 'account/signOut',
    }),
    /**
     * Connect Websockets
     * @returns {Promise<void|boolean>}
     */
    async connectSockets() {
      if (!(this.isAuthenticated && this.token)) {
        return false;
      }

      const isValid = await checkToken(this.token);
      if (!isValid) {
        return this.signOut();
      }

      this.clientTypeError = false;
      this.$io().io.opts.query = { token: this.token };
      this.$io().open();
    },
    /**
     * Mark clients as disconnected
     * @returns {void}
     */
    disconnectClients() {
      this.desktopConnected = false;
      return this.mobileConnected = false;
    },
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

      // Websockets
      if (this.$io().connected) {
        this.$io().emit(
          EVENTS.UPDATE_MUTE,
          {
            isMuted: !this.muted
          },
        );
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

      // Websockets
      if (this.$io().connected) {
        this.$io().emit(
          EVENTS.UPDATE_PLAYBACK_STATE,
          {
            isPlaying: player.paused,
          },
        );
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

      // Websockets
      if (this.$io().connected) {
        this.$io().emit(EVENTS.STOP_PLAYBACK);
      }

      return this.paused = true;
    },
    /**
     * Handle track switch on track end
     * @param {string} previousId - previous Track ID (optional)
     * @returns {void}
     */
    async handleTrackSwitchOnEnd(previousId = '') {
      // check the playback queue first
      if (this.playbackQueue.length > 0) {
        const [nextId = ''] = this.playbackQueue;
        await this.removeFromQueue(nextId);
        return this.handleTrackSelection(nextId);
      }

      // get the next track ID
      const nextId = getNextTrackId(
        this.trackIds,
        previousId || this.current.id,
        this.loop,
        this.shuffle,
        this.shuffled,
      );

      // handle the reshuffle
      if (nextId && nextId === 'reshuffle') {
        await this.reshuffle(this.trackIds);
        return this.handleTrackSwitchOnEnd();
      }

      // update an item in the shuffled array
      if (nextId && this.shuffle) {
        await this.setShuffledTrackAsPlayed(nextId);
      }

      return this.handleTrackSelection(nextId);
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
          this.paused = true;
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

        // fix track availability
        if (!track.available) {
          await this.setAvailability({ available: true, id });
        }

        // keep the playback paused if necessary
        if (paused) {
          return this.paused = true;
        }

        // Websockets
        if (this.$io().connected) {
          this.$io().emit(
            EVENTS.UPDATE_CURRENT_TRACK,
            {
              track,
            },
          );
        }

        return this.paused = false;
      } catch (error) {
        // handle the case with missing file (skip it)
        const { code = '' } = error;
        if (code && code === 'ENOENT') {
          await this.setAvailability({ available: false, id });
          return this.handleTrackSwitchOnEnd(id);
        }

        // in any other case show an error
        return this.setPlaybackError('Error playing a file!');
      }
    },
    /**
     * Handle player volume
     * @param {*} event - input event
     * @param {boolean} emit - if the value should be emitted
     * @returns {void}
     */
    async handleVolume(event, emit = true) {
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

      // Websockets
      if (this.$io().connected) {
        if (this.muted) {
          // update muted state
          this.$io().emit(
            EVENTS.UPDATE_MUTE,
            {
              isMuted: false,
            },
          );
        }

        // update volume
        if (emit) {
          this.$io().emit(
            EVENTS.UPDATE_VOLUME,
            {
              volume: value,
            },
          );
        }
      }

      return this.setVolume(value);
    },
    /**
     * Open a context menu for the currently playing track
     * @returns {Promise<void>}
     */
    async openContextMenuForCurrent() {
      if (!this.currentlyPlaying) {
        return false;
      }

      await this.setContextMenuTrackId(this.current.id);
      return this.setContextMenuVisibility(true);
    },
  },
};
</script>

<style src="./Player.css" />
