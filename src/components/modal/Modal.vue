<template>
  <div v-if="isVisible" class="modal modal--overlay" @click="closeModal">
    <div class="modal__content" @click.stop>
      <div class="modal__header">
        <b class="modal__title">{{title}}</b>
        <p class="modal__status">Новая</p>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    openModal() {
      this.isVisible = true;
      window.addEventListener('keydown', this.handleEscape);
    },
    closeModal() {
      this.isVisible = false;
      this.$emit('close');
      window.removeEventListener('keydown', this.handleEscape);
    },
    handleEscape(event) {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "Modal.scss";
</style>
