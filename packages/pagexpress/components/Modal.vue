<template>
  <div v-if="visible" class="modal is-active" :class="`modal--${size}`">
    <div class="modal-background" @click="toggleVisibility"></div>

    <div v-if="!isImageType" class="modal-card">
      <header v-if="isHead" class="modal-card-head">
        <slot name="head"></slot>
      </header>
      <slot name="underHead"></slot>
      <section class="modal-card-body">
        <slot></slot>
      </section>
    </div>

    <div v-else class="image">
      <img :src="imageUrl" alt="" />
    </div>

    <button
      class="modal-close is-large"
      aria-label="close"
      @click="toggleVisibility"
    ></button>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    toggleVisibility: {
      type: Function,
      required: true,
    },

    size: {
      type: String,
      default: 'default',
    },

    imageUrl: {
      type: String,
      default: null,
    },
  },

  computed: {
    isHead() {
      return !!this.$slots.head;
    },

    isImageType() {
      return !!this.imageUrl;
    },
  },

  watch: {
    /**
     * @param {bool} value
     */
    visible(value) {
      if (value === true) {
        window.addEventListener('keyup', this.closeOnEscapePress);
      } else {
        window.removeEventListener('keyup', this.closeOnEscapePress);
      }
    },
  },

  methods: {
    /**
     * @param {MouseEvent} evt
     */
    closeOnEscapePress(evt) {
      if (evt.key === 'Escape') {
        this.toggleVisibility();
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.modal {
  z-index: 999;

  &--big {
    .modal-card {
      @screen lg {
        width: calc(100vw - 40px);
      }
    }
  }
}
</style>
