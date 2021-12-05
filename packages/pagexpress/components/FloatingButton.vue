<template>
  <button
    class="floating-button"
    :class="`floating-button--${color} floating-button--${styleType}`"
    :title="title"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'FloatingButton',

  props: {
    styleType: {
      type: String,
      default: 'icon',
    },

    color: {
      type: String,
      default: 'default',
    },

    title: {
      type: String,
      default: '',
    },

    onClick: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style lang="postcss">
.floating-button {
  position: fixed;
  right: var(--spacing-2);
  bottom: var(--spacing-2);
  line-height: 1;
  border: none;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    transform: translate3d(0, 0.2rem, 0);
  }

  &--icon {
    width: var(--spacing-3);
    height: var(--spacing-3);
    font-size: 1.5rem;
    border-radius: 50%;
  }

  &--text {
    padding: var(--spacing);
    font-size: var(--font-md);
    border-radius: 1.2rem;
  }

  &--default {
    background-color: var(--gray);
  }

  &--warning {
    background-color: var(--orange);
  }

  &--danger {
    color: var(--white);
    background-color: var(--red);
  }
}
</style>
