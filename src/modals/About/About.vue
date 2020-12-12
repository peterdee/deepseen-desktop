<template>
  <div>
    <div
      class="modal-background"
      @click="setAboutVisibility(false)"
    />
    <div class="flex direction-column justify-content-space-between content noselect">
      <div class="fs-18 mb-8">
        About Deepseen
      </div>
      <div class="flex direction-column mb-8">
        <div class="mb-4">
          Deepseen
        </div>
        <div class="mb-4">
          Electron, Vue, Vuex
        </div>
        <div>
          By Peter Dyumin, 2020
        </div>
      </div>
      <button
        class="action-button menu-button noselect"
        @click="handleAuthor"
        type="button"
      >
        Author's Github
      </button>
      <button
        class="action-button menu-button noselect"
        @click="handleSource"
        type="button"
      >
        Source code
      </button>
      <button
        class="action-button menu-button noselect"
        @click="setAboutVisibility(false)"
        type="button"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { shell } from 'electron';

export default {
  name: 'About',
  methods: {
    ...mapActions({
      setAboutVisibility: 'about/setVisibility',
    }),
    /**
     * Handle author's button
     * @returns {void}
     */
    handleAuthor() {
      return shell.openExternal('https://github.com/peterdee');
    },
    /**
     * Handle source button
     * @returns {void}
     */
    handleSource() {
      return shell.openExternal('https://github.com/peterdee/deepseen-desktop');
    },
  },
};
</script>

<style src="./About.css" scoped />
