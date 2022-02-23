<template>
  <div class="media flex flex-col">
    <ImageUpload></ImageUpload>
    <div
      v-if="media"
      class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10 gap-4"
    >
      <div
        v-for="singleMedia in media"
        :key="singleMedia._id"
        :class="singleMedia.proportions === 'landscape' ? 'col-span-2' : ''"
        class="border-gray-800 p-1 bg-gray-200"
      >
        <img
          class="object-cover w-full h-full"
          :src="singleMedia.thumbnail"
          :alt="singleMedia.name"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ImageUpload from '@/components/ImageUpload';

export default {
  components: { ImageUpload },
  computed: {
    ...mapState('media', ['media']),
  },

  mounted() {
    this.fetchMoreMedia();
  },

  methods: {
    ...mapActions('media', ['fetchMoreMedia']),
  },
};
</script>
