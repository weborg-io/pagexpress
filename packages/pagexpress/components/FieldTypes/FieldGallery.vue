<template>
  <div class="w-full">
    <label :for="fieldId" class="label">{{ label }}</label>
    <div class="select">
      <select :id="fieldId" @change="changeGallery">
        <option value="">-- Pick gallery --</option>
        <option
          v-for="gallery in galleries"
          :key="gallery._id"
          :value="gallery._id"
          :selected="value && value.galleryId === gallery._id"
        >
          {{ gallery.name }}
        </option>
      </select>
    </div>
    <div class="flex gap-4 items-end"></div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'FieldGallery',

  props: {
    label: {
      type: String,
      required: true,
    },

    value: {
      type: Object,
      default: null,
    },
  },

  emits: ['update'],

  data() {
    return {
      fieldId: null,
    };
  },

  computed: {
    ...mapState('galleries', ['galleries', 'activeGallery']),
  },

  mounted() {
    if (!this.galleries) {
      this.fetchGalleries();
    }

    this.resetActiveGalleryState();
    this.fieldId = `field-gallery-${uuidv4()}`;
  },

  methods: {
    ...mapActions('galleries', [
      'fetchGalleries',
      'fetchGallery',
      'resetActiveGalleryState',
    ]),

    async changeGallery(evt) {
      if (!evt.target.value.length) {
        return;
      }

      await this.fetchGallery(evt.target.value);

      if (this.activeGallery) {
        this.$emit('update', this.getGalleryData(this.activeGallery));
        this.resetActiveGalleryState();
      }
    },

    getGalleryData(gallery) {
      return {
        galleryId: gallery._id,
        name: gallery.name,
        images: gallery.images,
      };
    },
  },
};
</script>
