<template>
  <div class="app">
    <Navbar />
    <Breadcrumbs />
    <div class="container">
      <nuxt />
    </div>
    <MediaExplorer />
    <NotificationToasts />
  </div>
</template>

<script>
import {
  Breadcrumbs,
  MediaExplorer,
  Navbar,
  NotificationToasts,
} from '@/components';

export default {
  components: {
    Breadcrumbs,
    MediaExplorer,
    Navbar,
    NotificationToasts,
  },
};
</script>

<style lang="postcss" scoped>
.container {
  padding-bottom: var(--spacing-2);
}
</style>
