<template>
  <div class="media flex flex-col">
    <Toolbar>
      <template #left>
        <div v-if="galleries" class="select">
          <select @change="switchGallery">
            <option :selected="!activeGallery" value="">
              -- Choose gallery --
            </option>
            <option
              v-for="gallery in galleries"
              :key="gallery._id"
              :value="gallery._id"
              :selected="activeGallery && activeGallery._id === gallery._id"
            >
              {{ gallery.name }}
            </option>
          </select>
        </div>
        <div class="field has-addons">
          <div class="control">
            <input
              v-model="newGalleryName"
              type="text"
              class="input"
              placeholder="Gallery name"
            />
          </div>
          <div class="control">
            <button
              class="button is-success"
              :disabled="!newGalleryName.length"
              @click="addGallery(newGalleryName)"
            >
              <span>Add New</span>
            </button>
          </div>
        </div>
      </template>
      <template #right>
        <button
          class="button is-danger"
          :disabled="!activeGallery"
          @click="removeGallery"
        >
          Remove gallery
        </button>
        <button
          class="button is-primary"
          :disabled="!isDirty"
          @click="saveGallery"
        >
          <span>Save</span>
        </button>
      </template>
    </Toolbar>
    <div v-if="activeGallery" class="w-full">
      <div class="w-full my-4 flex justify-between items-end">
        <div class="flex items-end gap-2">
          <FieldText
            label="Gallery name"
            custom-class="mb-0"
            :value="activeGallery.name"
            @update="renameGallery"
          ></FieldText>
          <div class="field mb-0">
            <label class="label" for="bulk-gallery-actions">Bulk actions</label>
            <div id="bulk-gallery-actions" class="select">
              <select v-model="activeBulkAction">
                <option value="">-- Pick action --</option>
                <option
                  v-for="(bulkAction, index) in bulkActions"
                  :key="`bulk-action-${index + 1}`"
                  :value="bulkAction"
                >
                  {{ bulkAction }}
                </option>
              </select>
            </div>
          </div>
          <button
            class="button is-primary"
            :disabled="
              !markedItems.length ||
              (markedItems.length && !activeBulkAction.length)
            "
            @click="applyBulkAction"
          >
            Apply
          </button>
        </div>
        <button
          class="button is-info"
          :disabled="!activeGallery"
          @click="toggleMediaExplorerVisibility"
        >
          <span>Add Images</span>
        </button>
      </div>
      <Container
        v-if="activeGallery"
        class="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2"
        drag-handle-selector=".image-drag-handler"
        :drop-placeholder="dropPlaceholderOptions"
        orientation="horizontal"
        @drop="reorderImages"
      >
        <Draggable
          v-for="image in activeGallery.images"
          :key="image._id"
          :class="{
            'col-span-2': image.proportions === 'landscape',
          }"
        >
          <div
            :class="{
              'border-4 border-fuchsia-600': markedItems.includes(image._id),
            }"
            class="flex flex-col w-full h-full p-0.5 rounded bg-gray-300 image-item relative"
            @click="markItem(image._id)"
          >
            <img
              class="object-cover w-full h-full"
              :style="{ 'aspect-ratio': `${image.width} / ${image.height}` }"
              :src="image.thumbnail"
              :alt="image.name"
            />
            <span
              class="image-drag-handler absolute top-1 right-1 z-20 w-8 h-8 bg-gray-50 rounded flex items-center justify-center cursor-move"
            >
              <fa :icon="['fa', 'arrows-alt']" />
            </span>
            <button
              class="remove-image button is-small is-danger is-light absolute bottom-1 right-1 z-20"
              @click="removeGalleryImage(image._id)"
            >
              <span class="icon">
                <fa :icon="['fa', 'trash-alt']" />
              </span>
            </button>
          </div>
        </Draggable>
      </Container>
    </div>
    <MediaExplorer
      confirm-button-label="Add to gallery"
      :submit-action="addImages"
      :upload="uploadImages"
      :media="media"
      :toggle-visibility="toggleMediaExplorerVisibility"
      :visible="mediaExplorerVisible"
    ></MediaExplorer>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Container, Draggable } from 'vue-smooth-dnd';
import { Toolbar, MediaExplorer } from '@/components';
import FieldText from '@/components/FieldTypes/FieldText';

const BULK_ACTIONS = {
  REMOVE_IMAGES: 'Remove selected images',
};

export default {
  components: { FieldText, Toolbar, MediaExplorer, Container, Draggable },

  data() {
    return {
      bulkActions: Object.values(BULK_ACTIONS),
      activeBulkAction: '',
      mediaExplorerVisible: false,
      newGalleryName: '',
      markedItems: [],
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
    };
  },

  computed: {
    ...mapState('galleries', ['galleries', 'activeGallery']),
    ...mapState('media', ['media']),
    ...mapState(['isDirty']),
  },

  mounted() {
    this.fetchGalleries();
    this.fetchMoreMedia();
  },

  methods: {
    ...mapActions('media', ['fetchMoreMedia', 'uploadImages', 'removeImage']),
    ...mapActions('galleries', [
      'addGallery',
      'addImages',
      'fetchGalleries',
      'fetchGallery',
      'saveGallery',
      'resetActiveGalleryState',
      'renameGallery',
      'removeGallery',
      'reorderImages',
      'removeImages',
    ]),

    toggleMediaExplorerVisibility() {
      this.mediaExplorerVisible = !this.mediaExplorerVisible;
    },

    markItem(itemId) {
      if (this.markedItems.includes(itemId)) {
        this.markedItems = this.markedItems.filter(
          markedItemId => markedItemId !== itemId
        );

        return;
      }

      this.markedItems = [...this.markedItems, itemId];
    },

    removeGalleryImage(imageId) {
      this.removeImages([imageId]);
    },

    applyBulkAction() {
      switch (this.activeBulkAction) {
        case BULK_ACTIONS.REMOVE_IMAGES:
          this.removeImages(this.markedItems);
          this.markedItems = [];
          this.activeBulkAction = '';
      }
    },

    async switchGallery(evt) {
      if (
        this.isDirty &&
        !confirm(
          'Please confirm that you want to switch gallery without saving changes'
        )
      ) {
        return;
      }

      if (evt.currentTarget.value) {
        await this.fetchGallery(evt.currentTarget.value);
      } else {
        this.resetActiveGalleryState();
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.image-item {
  .remove-image,
  .image-drag-handler {
    display: none;
  }

  &:hover {
    .remove-image,
    .image-drag-handler {
      display: flex;
    }
  }
}

.smooth-dnd-container.horizontal {
  @apply grid;

  .smooth-dnd-draggable-wrapper {
    height: inherit;
    vertical-align: inherit;
    @apply flex;
  }
}

.drop-preview {
  @apply mx-4;
}
</style>
