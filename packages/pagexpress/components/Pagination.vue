<template>
  <nav
    class="flex justify-between w-full"
    role="navigation"
    aria-label="pagination"
  >
    <ul class="pagination-list">
      <li>Page {{ currentPage }} of {{ totalPages }}</li>
    </ul>
    <div class="order-2">
      <button
        class="button"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Prev
      </button>
      <button
        :disabled="currentPage === totalPages"
        class="button"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Pagination',

  props: {
    currentPage: {
      type: Number,
      default: 1,
    },

    totalPages: {
      type: Number,
      default: 1,
    },

    changePage: {
      type: Function,
      required: true,
    },
  },
};
</script>
