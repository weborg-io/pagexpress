<template>
  <div>Media pages</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
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
