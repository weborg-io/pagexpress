<template>
  <div class="flex w-full">
    <div class="control has-icons-left has-icons-right">
      <input type="search" class="input" placeholder="Find image" />
      <span class="icon is-small is-left">
        <fa :icon="['fa', 'search']" />
      </span>
    </div>
    <div class="flex items-center ml-4 flex-1">
      <slot></slot>
    </div>
    <button
      class="button is-primary"
      :disabled="!activeConfirmButton"
      @click="confirmCallback"
    >
      {{ confirmButtonLabel }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'MediaExplorerToolbar',

  props: {
    confirmCallback: {
      type: Function,
      required: true,
    },

    confirmButtonLabel: {
      type: String,
      required: true,
    },

    activeConfirmButton: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
