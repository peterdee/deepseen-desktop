<template>
  <div class="flex justify-content-center align-items-center noselect error">
    <transition name="slide-fade">
      <div
        v-if="!isLoading && message"
        class="flex justify-content-center align-items-center text-center message"
      >
        {{ message }}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    isLoading: {
      required: true,
      type: Boolean,
    },
    message: {
      default() {
        return '';
      },
      required: false,
      type: String,
    },
  },
};
</script>

<style scoped>
.error {
  height: 24px;
}
.message {
  color: var(--error-text);
  font-size: 16px;
  font-weight: 200;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
