<template>
  <div class="app-view">
    <nav class="level">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item list-toolbar">
          <div class="list-toolbar__item">
            <input
              v-model="searchKeyword"
              class="input"
              type="search"
              placeholder="Search"
              @input="search"
            />
          </div>

          <div class="list-toolbar__item select">
            <select
              v-model="sortBy"
              name="sortBy"
              :value="sortBy"
              @change="sort"
            >
              <option value="-updatedAt">Last updated</option>
              <option value="-createdAt">Newest first</option>
              <option value="name">Page name</option>
              <option value="type">Page type</option>
              <option value="url">URL</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Right side -->
      <div class="level-right">
        <p class="level-item">
          <nuxt-link to="/pages/add" class="button is-success">
            Add new +
          </nuxt-link>
        </p>
      </div>
    </nav>
    <div v-if="Object.keys(pagesList).length" class="pages-list__wrapper">
      <Table :headers="headers" :data="pagesList" :actions="pageActions" />
      <Pagination
        :change-page="changePage"
        :current-page="currentPage"
        :total-pages="totalPages"
      />
    </div>
    <article
      v-if="!Object.keys(pagesList).length && searchKeyword.length"
      class="message"
    >
      <div class="message-header">
        <p>Searching results</p>
      </div>
      <div class="message-body">
        <p>There is no page for searching phrase</p>
      </div>
    </article>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Table, Pagination } from '@/components';
import { formatDate } from '~/utils';

export default {
  components: {
    Pagination,
    Table,
  },

  asyncData({ store }) {
    store.dispatch('pages/loadPages');
  },

  data() {
    return {
      errorMessage: [],
      headers: ['Name', 'Url', 'Type', 'Last update', 'Created'],
      timeout: null,
      searchKeyword: '',
      sortBy: '',
    };
  },

  computed: {
    ...mapState({
      pagesList: state => {
        const pagesListData = {};
        state.pages.pagesList.forEach(
          ({ _id, name, url, type, updatedAt, createdAt }) => {
            pagesListData[_id] = [
              name,
              url,
              type.name,
              formatDate(new Date(updatedAt)),
              formatDate(new Date(createdAt)),
            ];
          }
        );

        return pagesListData;
      },
      currentPage: state => state.pages.currentPage,
      totalPages: state => state.pages.totalPages,
    }),

    pageActions() {
      return {
        edit: {
          type: 'link',
          styleClass: 'info',
          label: 'Edit',
          action: pageId => `pages/${pageId}/edit`,
        },
        delete: {
          type: 'button',
          styleClass: 'danger',
          label: 'Delete',
          action: pageId => this.removePage(pageId),
        },
      };
    },
  },

  mounted() {
    this.initViewData();
    this.setBreadcrumbsLinks();
  },

  methods: {
    ...mapActions({
      loadPages: 'pages/loadPages',
      removePage: 'pages/removePage',
      changePage: 'pages/changePage',
    }),

    initViewData() {
      this.loadPages();
      this.sortBy = this.$store.state.pages.sort;
    },

    setBreadcrumbsLinks() {
      this.$store.commit('UPDATE_BREADCRUMBS_LINKS', [
        {
          url: '/',
          label: 'Home',
        },
      ]);
    },

    search(evt) {
      if (this.timeout) clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.$store.dispatch('pages/searchPage', evt.target.value);
      }, 200);
    },

    sort() {
      this.$store.dispatch('pages/sortBy', this.sortBy);
    },
  },
};
</script>

<style scoped lang="postcss">
.list-toolbar {
  &__item {
    &:not(:last-of-type) {
      margin-right: var(--spacing-05);
    }
  }
}

.pagination {
  .is-disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
