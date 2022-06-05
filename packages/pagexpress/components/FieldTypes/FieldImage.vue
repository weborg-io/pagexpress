<template>
  <div class="w-full">
    <label for="" class="label">{{ label }}</label>
    <div class="flex gap-4 items-end">
      <div v-if="value" class="flex items-end gap-4 flex-1">
        <div class="w-28">
          <img
            :src="thumbnail"
            alt=""
            :style="{ 'aspect-ratio': `${value.width} / ${value.height}` }"
          />
        </div>
        <div class="field flex flex-col justify-end flex-1">
          <label :for="fieldId" class="label">Image name</label>
          <input
            :id="fieldId"
            type="text"
            class="input"
            :value="value.name"
            @input="updateImageName"
          />
        </div>
      </div>
      <button class="button is-info" @click="toggleMediaExplorerVisibility">
        <span v-if="value"> Change image </span>
        <span v-else> Choose image </span>
      </button>
      <button
        class="button is-danger"
        :class="{ hidden: !value }"
        @click="removeImage"
      >
        <span>Remove image</span>
      </button>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import _pick from 'lodash/pick';
import _debounce from 'lodash/debounce';
import { getThumbnail } from '@/utils';

export default {
  name: 'FieldImage',

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
    thumbnail() {
      return this.value ? getThumbnail(this.value.url) : null;
    },
  },

  mounted() {
    this.fieldId = `field-image-${uuidv4()}`;
  },

  methods: {
    toggleMediaExplorerVisibility() {
      this.$root.$emit('openMediaExplorer', this.changeImage, {
        submitButtonLabel: 'Use image',
      });
    },

    changeImage(newImageData) {
      this.$emit('update', this.getImageFieldData(newImageData));
    },

    updateImageName: _debounce(function (evt) {
      this.$emit('update', {
        ...this.value,
        name: evt.target.value,
      });
    }, 250),

    removeImage() {
      this.$emit('update', undefined);
    },

    getImageFieldData(imageData) {
      return _pick(imageData, ['name', 'url', 'width', 'height', 'mimetype']);
    },
  },
};
</script>
