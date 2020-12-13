<template>
  <div class="flex align-items-center justify-content-space-between bar noselect">
    <div class="flex align-items-center">
      <div :class="[
        'flex justify-content-center align-items-center status',
        desktopConnected
          ? 'enabled'
          : '',
        ]"
      >
        <img
          alt="Desktop"
          class="client-icon"
          :src="desktopIcon"
          :title="desktopConnected ? 'Desktop connected' : 'Desktop disconnected'"
        />
      </div>
      <div :class="[
        'flex justify-content-center align-items-center status',
        mobileConnected
          ? 'enabled'
          : '',
        ]"
      >
        <img
          alt="Mobile"
          class="client-icon"
          :src="mobileIcon"
          :title="mobileConnected ? 'Mobile connected' : 'Mobile disconnected'"
        />
      </div>
    </div>
    <div class="flex align-items-center">
    <div :class="[
      'flex justify-content-center align-items-center status',
      shuffle
        ? 'enabled'
        : '',
      ]"
    >
      <img
        alt="Shuffle"
        class="status-icon"
        :src="shuffleIcon"
        :title="shuffle ? 'Shuffle enabled' : 'Shuffle disabled'"
      />
    </div>
    <div :class="[
      'flex justify-content-center align-items-center status',
      loop
        ? 'enabled'
        : '',
      ]"
    >
      <img
        alt="Loop"
        class="status-icon"
        :src="loopIcon"
        :title="loop ? 'Loop enabled' : 'Loop disabled'"
      />
    </div>
    <div :class="[
      'flex justify-content-center align-items-center status',
      playbackQueue.length > 0
        ? 'enabled'
        : '',
      ]"
    >
      <img
        alt="Queue"
        class="status-icon"
        :src="queueIcon"
        :title="playbackQueue.length > 0
          ? 'Playback follows the queue'
          : 'Playback queue is empty'"
      />
    </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'StatusBar',
  data() {
    return {
      desktopIcon: require('../../assets/desktop.svg'),
      loopIcon: require('../../assets/loop.svg'),
      mobileIcon: require('../../assets/mobile.svg'),
      queueIcon: require('../../assets/queue.svg'),
      shuffleIcon: require('../../assets/shuffle.svg'),
    };
  },
  props: {
    desktopConnected: {
      required: true,
      type: Boolean,
    },
    mobileConnected: {
      required: true,
      type: Boolean,
    },
  },
  computed: {
    ...mapState({
      loop: ({ settings }) => settings.loop,
      playbackQueue: ({ playbackQueue }) => playbackQueue.queue,
      shuffle: ({ settings }) => settings.shuffle,
      tracks: ({ playlist }) => playlist.tracks,
    }),
  },
};
</script>

<style src="./StatusBar.css" />
