<template>
  <div class="media flex flex-col">
    <Toolbar>
      <template #left>
        <div class="select">
          <select>
            <option>-- Choose gallery --</option>
            <option>Some gallery name</option>
          </select>
        </div>
        <div class="field has-addons">
          <div class="control">
            <input type="text" class="input" placeholder="Gallery name"/>
          </div>
          <div class="control">
            <button class="button is-success">
              <span>Add New</span>
            </button>
          </div>
        </div>
      </template>
      <template #right>
        <button class="button is-info">
          <span>Add Images</span>
        </button>
      </template>
    </Toolbar>
    <div
      v-if="media"
      class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
    >
      <div
        v-for="singleMedia in media"
        :key="singleMedia._id"
        :class="singleMedia.proportions === 'landscape' ? 'col-span-2' : ''"
        class="flex flex-col border-gray-800 p-1 bg-gray-600 rounded"
      >
        <img
          class="object-cover w-full h-full"
          :src="singleMedia.thumbnail"
          :alt="singleMedia.name"
        />
        <div class="flex justify-end p-1">
          <button
            class="button is-small is-danger is-light m-1"
            @click="removeImage(singleMedia._id)"
          >
            <fa :icon="['fa', 'trash-alt']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {
  Toolbar,
} from '@/components';

export default {
  components: { Toolbar },
  computed: {
    ...mapState('media', ['media']),
  },

  mounted() {
    this.fetchMoreMedia();
  },

  methods: {
    ...mapActions('media', [
      'fetchMoreMedia',
      'uploadImages',
      'removeImage',
    ]),
  },
};
</script>
