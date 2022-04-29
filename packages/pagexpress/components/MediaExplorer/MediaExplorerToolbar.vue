<template>
  <div class="flex flex-col w-full">
    <div class="flex w-full">
      <div class="control has-icons-left has-icons-right">
        <input
          type="search"
          class="input"
          placeholder="Find image"
          :value="keyword"
          @input="searchImage"
        />
        <span class="icon is-small is-left">
          <fa :icon="['fa', 'search']" />
        </span>
      </div>
      <div class="flex items-center ml-4 flex-1">
        <slot></slot>
      </div>
      <div class="flex gap-1">
        <label class="button is-info">
          <input
            ref="input"
            type="file"
            multiple
            class="invisible w-0"
            @change="triggerUpload"
          />
          Upload
        </label>
        <button
          class="button is-primary"
          :disabled="!activeConfirmButton"
          @click="confirmCallback"
        >
          {{ confirmButtonLabel }}
        </button>
      </div>
    </div>
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

    upload: {
      type: Function,
      required: true,
    },

    uploadCallback: {
      type: Function,
      required: true,
    },

    searchImage: {
      type: Function,
      required: true,
    },

    keyword: {
      type: String,
      default: null,
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

  methods: {
    triggerUpload() {
      const images = this.$refs.input.files;

      if (images && images.length) {
        this.upload({
          images,
          progressCb: this.uploadCallback,
        });
      }
    },
  },
};
</script>
