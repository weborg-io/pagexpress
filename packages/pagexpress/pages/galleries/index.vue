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
              {{ gallery.slug }}
            </option>
          </select>
        </div>
        <div class="field has-addons">
          <div class="control">
            <input
              v-model="newGallerySlug"
              type="text"
              class="input"
              placeholder="Gallery slug"
            />
          </div>
          <div class="control">
            <button
              class="button is-success"
              :disabled="!newGallerySlug.length"
              @click="addGallery(newGallerySlug)"
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
          @click="triggerRemoveGallery"
        >
          Remove gallery
        </button>
        <button
          class="button is-primary"
          :disabled="!isDirty"
          @click="saveGallery"
        >
          <span>Save Changes</span>
        </button>
      </template>
    </Toolbar>
    <div v-if="activeGallery" class="w-full">
      <div class="w-full my-4 flex justify-between items-end">
        <div class="flex items-end gap-2">
          <FieldText
            label="Gallery slug"
            custom-class="mb-0"
            :value="activeGallery.slug"
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
          <button
            class="button"
            :class="{ hidden: !markedItems.length }"
            @click="unselectAll"
          >
            <span>Clear selection</span>
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
        class="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-3"
        drag-handle-selector=".image-drag-handler"
        :drop-placeholder="dropPlaceholderOptions"
        orientation="horizontal"
        @drop="reorderImages"
      >
        <Draggable
          v-for="image in activeGallery.images"
          :key="image._id"
          class="border-gray-300 border-4"
          :class="{
            'col-span-2': image.proportions === 'landscape',
          }"
        >
          <div
            :class="{
              'outline-fuchsia-600 outline outline-4': markedItems.includes(
                image._id
              ),
            }"
            class="flex flex-col w-full h-full rounded bg-gray-300 image-item relative"
          >
            <img
              class="object-cover w-full h-full cursor-pointer"
              :style="{ 'aspect-ratio': `${image.width} / ${image.height}` }"
              :src="image.thumbnail"
              :alt="image.name"
              @click="preview(image.url)"
            />
            <span
              class="image-drag-handler absolute top-1 right-1 z-20 w-8 h-8 bg-gray-50 rounded flex items-center justify-center cursor-move"
            >
              <fa :icon="['fa', 'arrows-alt']" />
            </span>
            <button
              class="remove-image button is-small is-danger is-light absolute bottom-1 right-1 z-20"
              @click.stop="removeGalleryImage(image._id)"
            >
              <span class="icon">
                <fa :icon="['fa', 'trash-alt']" />
              </span>
            </button>
            <button
              class="mark-item button is-small is-light absolute top-1 left-1 z-20"
              :class="{ hidden: !markedItems.length }"
              @click.stop="markItem(image._id)"
            >
              <span class="icon">
                <fa
                  v-if="markedItems.includes(image._id)"
                  :icon="['fa', 'minus']"
                />
                <fa v-else :icon="['fa', 'plus']" />
              </span>
            </button>
          </div>
        </Draggable>
      </Container>
    </div>

    <Modal
      :visible="!!imagePreview"
      :toggle-visibility="closeImagePreview"
      :image-url="imagePreview"
    >
    </Modal>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd';
import { mapActions, mapState } from 'vuex';
import { Modal, Toolbar } from '@/components';
import FieldText from '@/components/FieldTypes/FieldText';

const BULK_ACTIONS = {
  REMOVE_IMAGES: 'Remove selected images',
};

export default {
  components: {
    FieldText,
    Toolbar,
    Modal,
    Container,
    Draggable,
  },

  data() {
    return {
      bulkActions: Object.values(BULK_ACTIONS),
      activeBulkAction: '',
      newGallerySlug: '',
      markedItems: [],
      imagePreview: null,
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
    };
  },

  computed: {
    ...mapState('galleries', ['galleries', 'activeGallery']),
    ...mapState(['isDirty']),
  },

  mounted() {
    this.fetchGalleries();
    this.setBreadcrumbsLinks();
  },

  methods: {
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
      this.$root.$emit('openMediaExplorer', this.addImages, {
        multiple: true,
        submitButtonLabel: 'Add to gallery',
      });
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

    unselectAll() {
      this.markedItems = [];
    },

    removeGalleryImage(imageId) {
      this.removeImages([imageId]);
      this.markedItems = this.markedItems.filter(
        markedItem => markedItem !== imageId
      );
    },

    triggerRemoveGallery() {
      this.removeGallery(() => {
        this.markedItems = [];
      });
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
        this.markedItems = [];
      } else {
        this.resetActiveGalleryState();
      }
    },

    preview(imageUrl) {
      this.imagePreview = imageUrl;
    },

    closeImagePreview() {
      this.imagePreview = null;
    },

    setBreadcrumbsLinks() {
      this.$store.commit('UPDATE_BREADCRUMBS_LINKS', [
        {
          url: '/',
          label: 'Home',
        },
        {
          url: `/galleries/`,
          label: 'Galleries',
        },
      ]);
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
    .mark-item,
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
