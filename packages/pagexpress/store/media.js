import { showRequestResult } from '@/utils';
import responsive from 'tailwindcss/lib/util/responsive';

export const state = () => ({
  singleMediaInfo: null,
  media: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 50,
  search: null,
  sort: '-updatedAt',
});

const enrichMediaData = media => ({
  ...media,
  thumbnail: `${media.url}?width=300`,
  proportions: media.width > media.height ? 'landscape' : 'portrait',
});

export const mutations = {
  LOAD_MEDIA(state, { data, currentPage, totalPages }) {
    state.media = data.map(enrichMediaData);
    state.currentPage = currentPage;
    state.totalPages = totalPages;
  },

  LOAD_SINGLE_MEDIA_INFO(state, singleMediaInfo) {
    state.singleMediaInfo = singleMediaInfo;
  },

  ADD_MEDIA(state, newMediaItems) {
    state.media = [...state.media, newMediaItems.map(enrichMediaData)];
  },
};

export const actions = {
  async fetchMoreMedia({ commit, dispatch, state }) {
    const mediaData = await showRequestResult({
      request: this.$axios.get('media/', {
        params: {
          page: state.currentPage,
          limit: state.itemsPerPage,
          search: state.search,
          sort: state.sort,
        },
      }),
      dispatch,
    });

    commit('LOAD_MEDIA', mediaData);
  },

  async fetchSingleMedia({ commit, dispatch, state }, mediaId) {
    const singleMediaInfo = await showRequestResult({
      request: this.$axios.get(`media/${mediaId}`),
      dispatch,
    });

    commit('LOAD_SINGLE_MEDIA_INFO', singleMediaInfo);
  },

  async uploadImages({ commit, dispatch }, images) {
    const response = await showRequestResult({
      request: this.$axios.get('/media/image/upload', {
        params: {
          images,
        },
      }),
      dispatch,
    });

    commit('ADD_MEDIA', response);
  },
};
