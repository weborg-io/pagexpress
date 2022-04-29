<template>
  <Modal :visible="visible" size="big" :toggle-visibility="toggleVisibility">
    <template #head>
      <MediaExplorerToolbar
        :confirm-callback="confirmCallback"
        :upload="upload"
        :confirm-button-label="confirmButtonLabel"
        :active-confirm-button="!!markedItems.length"
        :upload-callback="updateUploadsProgress"
        :keyword="keyword"
        :search-image="triggerSearch"
      >
        Picked images: {{ markedItems.length }}
      </MediaExplorerToolbar>
    </template>
    <template #underHead>
      <progress
        v-if="uploadPercentage > 0"
        class="w-full progress is-small is-success rounded-none m-0 transition-all"
        max="100"
        :value.prop="uploadPercentage"
      ></progress>
    </template>
    <template>
      <div
        v-if="media"
        class="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-4"
      >
        <div
          v-for="singleMedia in media"
          :key="singleMedia._id"
          :class="{
            'border-4 border-fuchsia-600': markedItems.includes(
              singleMedia._id
            ),
            'col-span-2': singleMedia.proportions === 'landscape',
          }"
          class="flex flex-col p-0.5 rounded bg-gray-300"
          @click="markItem(singleMedia._id)"
        >
          <img
            class="object-cover w-full h-full"
            :style="{
              'aspect-ratio': `${singleMedia.width} / ${singleMedia.height}`,
            }"
            :src="singleMedia.thumbnail"
            :alt="singleMedia.name"
          />
        </div>
      </div>
      <div v-else>No media</div>
    </template>
  </Modal>
</template>

<script>
import MediaExplorerToolbar from '@/components/MediaExplorer/MediaExplorerToolbar';
import Modal from '@/components/Modal';

export default {
  name: 'MediaExplorer',

  components: { MediaExplorerToolbar, Modal },

  props: {
    media: {
      type: Array,
      default: () => [],
    },

    visible: {
      type: Boolean,
      default: false,
    },

    multipleChoose: {
      type: Boolean,
      default: true,
    },

    toggleVisibility: {
      type: Function,
      required: true,
    },

    upload: {
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

    submitAction: {
      type: Function,
      required: true,
    },

    confirmButtonLabel: {
      type: String,
      default: 'Confirm',
    },
  },

  data() {
    return {
      markedItems: [],
      uploadPercentage: 0,
      timeout: null,
    };
  },

  watch: {
    visible(value) {
      if (value === false) {
        return;
      }

      this.markedItems = [];

      if (this.keyword) {
        this.searchImage(null);
      }
    },
  },

  methods: {
    markItem(itemId) {
      if (!this.multipleChoose) {
        this.markedItems = [];
      } else if (this.markedItems.includes(itemId)) {
        this.markedItems = this.markedItems.filter(
          markedItemId => markedItemId !== itemId
        );

        return;
      }

      this.markedItems = [...this.markedItems, itemId];
    },

    confirmCallback() {
      const pickedMediaItems = this.media.filter(mediaItem =>
        this.markedItems.includes(mediaItem._id)
      );
      this.submitAction(pickedMediaItems);
      this.toggleVisibility();
    },

    updateUploadsProgress(event) {
      this.uploadPercentage = parseInt(
        Math.round((event.loaded / event.total) * 100)
      );

      if (Number(this.uploadPercentage) === 100) {
        setTimeout(() => {
          this.uploadPercentage = 0;
        }, 3000);
      }
    },

    triggerSearch(evt) {
      if (this.timeout) clearTimeout(this.timeout);

      this.timeout = setTimeout(
        this.searchImage.bind(null, evt.target.value),
        200
      );
    },
  },
};
</script>
