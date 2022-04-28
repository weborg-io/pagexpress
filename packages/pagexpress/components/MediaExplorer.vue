<template>
  <Modal :visible="visible" size="big" :toggle-visibility="toggleVisibility">
    <template #head>
      <MediaExplorerToolbar
        :confirm-callback="confirmCallback"
        :confirm-button-label="confirmButtonLabel"
        :active-confirm-button="!!markedItems.length"
      >
        Picked images: {{ markedItems.length }}
      </MediaExplorerToolbar>
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
            'border-fuchsia-600': markedItems.includes(singleMedia._id),
            'border-transparent': !markedItems.includes(singleMedia._id),
            'col-span-2': singleMedia.proportions === 'landscape',
          }"
          class="flex flex-col border-2 p-0.5 rounded bg-gray-300"
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
    };
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
  },
};
</script>
