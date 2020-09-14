<template>
  <div>
    <div
      class="modal-background"
      @click="setAboutVisibility(false)"
    />
    <div class="flex direction-column justify-content-start content">
      <div class="fs-18">
        About DeepSeen
      </div>
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

export default {
  name: 'About',
  methods: {
    ...mapActions({
      setAboutVisibility: 'about/setVisibility',
    }),
  },
};
</script>

<style src="./About.css" scoped />
