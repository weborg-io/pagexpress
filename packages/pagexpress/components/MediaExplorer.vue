<template>
  <Modal :visible="open" size="big" :toggle-visibility="closeExplorer">
    <template #head>
      <MediaExplorerToolbar
        :confirm-callback="confirmCallback"
        :upload="uploadImages"
        :confirm-button-label="submitButtonLabel || 'Confirm'"
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
    <template #default>
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
import { mapActions, mapState } from 'vuex';
import MediaExplorerToolbar from '@/components/MediaExplorer/MediaExplorerToolbar';
import Modal from '@/components/Modal';

const DEFAULT_OPTIONS = {
  multiple: false,
  submitButtonLabel: null,
};

export default {
  name: 'MediaExplorer',

  components: { MediaExplorerToolbar, Modal },

  emits: ['openMediaExplorer', 'closeMediaExplorer'],

  data() {
    return {
      markedItems: [],
      uploadPercentage: 0,
      timeout: null,
      open: false,
      submitAction: null,
      keyword: '',
      ...DEFAULT_OPTIONS,
    };
  },

  computed: {
    ...mapState('media', ['media', 'search']),
  },

  mounted() {
    this.fetchMediaIfEmpty();
    this.$root.$on(
      'openMediaExplorer',
      (onSubmit, { multiple, submitButtonLabel } = DEFAULT_OPTIONS) => {
        this.open = true;
        this.submitAction = onSubmit;
        this.multiple = multiple;
        this.submitButtonLabel = submitButtonLabel;
      }
    );
    this.$root.$on('closeMediaExplorer', onClose => {
      this.submitAction = onClose;
    });
  },

  beforeDestroy() {
    this.$root.$off('openMediaExplorer');
  },

  methods: {
    ...mapActions('media', [
      'fetchMediaIfEmpty',
      'uploadImages',
      'searchImage',
      'resetMediaState',
    ]),

    markItem(itemId) {
      if (!this.multiple) {
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
      const submitData = this.multiple ? pickedMediaItems : pickedMediaItems[0];
      this.submitAction(submitData);
      this.closeExplorer();
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

      this.timeout = setTimeout(this.search.bind(null, evt.target.value), 200);
    },

    resetExplorerState() {
      this.submitAction = null;
      this.markedItems = [];
      this.submitButtonLabel = DEFAULT_OPTIONS.submitButtonLabel;
      this.multiple = DEFAULT_OPTIONS.multiple;
      this.resetMediaState();

      if (this.keyword) {
        this.searchImage(null);
      }
    },

    closeExplorer() {
      this.open = false;
      this.resetExplorerState();
    },
  },
};
</script>
