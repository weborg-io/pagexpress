<template>
  <div class="media flex flex-col">
    <ImageUpload :upload="uploadImages"></ImageUpload>
    <table
      v-if="media"
      class="table-auto w-full border-collapse border border-gray-100"
    >
      <thead>
        <tr>
          <th class="px-2 py-4">
            <input class="block mx-auto" type="checkbox"/>
          </th>
          <th class="border border-gray-200 w-16 p-2">Thumb</th>
          <th class="border border-gray-200 p-2">Name</th>
          <th class="border border-gray-200 p-2">Dimensions</th>
          <th class="border border-gray-200 p-2">Size</th>
          <th class="border border-gray-200 p-2">Type</th>
          <th class="border border-gray-200 p-2">Last update</th>
          <th class="border border-gray-200 p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="image in media"
          :key="image._id"
        >
          <td class="border border-gray-200 py-1 px-2">
            <div class="flex items-center justify-center w-full h-16">
              <input type="checkbox"/>
            </div>
          </td>
          <td class="border border-gray-200 w-16 p-1">
              <div class="w-16 h-16 relative overflow-hidden">
                <img
                  class="object-center object-cover absolute min-w-full min-h-full"
                  :src="image.thumbnail"
                  :alt="image.name"
                />
              </div>
          </td>
          <td class="border border-gray-200 p-2">{{ image.name }}</td>
          <td class="border border-gray-200 p-2">{{ image.width }}x{{ image.height }}</td>
          <td class="border border-gray-200 p-2">{{ bytesToKb(image.size) }} KB</td>
          <td class="border border-gray-200 p-2">{{ image.mimetype }}</td>
          <td class="border border-gray-200 p-2">{{ formatDate(image.updatedAt) }}</td>
          <td class="border border-gray-200 px-2 py-1">
            <div class="flex items-center h-16">
              <button
                class="button is-small is-info is-light m-1"
                @click="editImage(image._id)"
              >
                <fa :icon="['fa', 'edit']" />
              </button>
              <button
                class="button is-small is-danger is-light m-1"
                @click="removeImage(image._id)"
              >
                <fa :icon="['fa', 'trash-alt']" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <Modal
      :visible="!!editImageId"
      :toggle-visibility="cancelEditImage"
    >
      <form v-if="!!editImageId" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="image-name">
            Name
          </label>
          <input
            id="image-name"
            v-model="newImageData.name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Name"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="image-desc">
            Description
          </label>
          <input
            id="image-desc"
            v-model="newImageData.description"
            class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Description"
          />
        </div>
        <div class="flex items-center justify-end gap-1.5">
          <button class="button" @click="cancelEditImage">
            Cancel
          </button>
          <button class="button is-info" @click="updateImageData">
            Save
          </button>
        </div>
      </form>
    </Modal>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { ImageUpload, Modal } from '@/components';

export default {

  components: { ImageUpload, Modal },
  data() {
    return {
      editImageId: false,
      newImageData: {},
    };
  },

  computed: {
    ...mapState('media', ['media']),

    editedImageData() {
      return this.editImageId
        ? this.media.find(m => m._id === this.editImageId)
        : null;
    }
  },

  mounted() {
    this.fetchMoreMedia();
  },

  methods: {
    ...mapActions('media', [
      'fetchMoreMedia',
      'uploadImages',
      'updateMedia',
      'removeImage',
    ]),

    /**
     * @param {string} dateToFormat
     */
    formatDate(dateToFormat) {
      const date = new Date(dateToFormat);

      return date.toISOString().split('T')[0]
    },

    bytesToKb(bytes) {
      return Math.round(bytes/1000);
    },

    editImage(imageId) {
      this.editImageId = imageId;
      this.newImageData = { ...this.editedImageData };
    },

    cancelEditImage() {
      this.editImageId = null;
    },

    updateImageData() {
      this.updateMedia({
        mediaId: this.editImageId,
        mediaData: this.newImageData,
      });
      this.editImageId = null;
    },
  },
};
</script>
