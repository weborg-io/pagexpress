<template>
  <div class="toolbar">
    <div class="container toolbar__inner">
      <div v-if="isLeft" class="toolbar__left-side">
        <slot name="left"></slot>
      </div>
      <div v-if="isMiddle" class="toolbar__middle">
        <slot name="middle"></slot>
      </div>
      <div v-if="isRight" class="toolbar__right-side">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',

  computed: {
    isLeft() {
      return !!this.$slots.left;
    },

    isMiddle() {
      return !!this.$slots.middle;
    },

    isRight() {
      return !!this.$slots.right;
    },
  },
};
</script>

<style lang="postcss" scoped>
.toolbar {
  position: sticky;
  top: 0;
  width: 100%;
  margin-top: var(--spacing-05);
  margin-bottom: var(--spacing);
  padding: var(--spacing);
  background-color: var(--black);
  z-index: 999;

  &__inner {
    display: flex;
    justify-content: space-between;
  }

  &__right-side,
  &__middle,
  &__left-side {
    display: flex;
    flex: 1;

    & > * {
      margin-right: var(--spacing-05);

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__right-side {
    justify-content: flex-end;
  }

  &__middle {
    padding: 0 var(--spacing-2);
    justify-content: center;
  }
}
</style>
