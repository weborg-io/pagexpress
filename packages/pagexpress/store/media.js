import _pick from 'lodash/pick';
import { showRequestResult, enrichMedia } from '@/utils';

const stateModel = {
  singleMediaInfo: null,
  media: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 50,
  search: null,
  sort: '-updatedAt',
};

export const state = () => ({ ...stateModel });

export const mutations = {
  LOAD_MEDIA(state, { data, currentPage, totalPages }) {
    state.media = data.map(enrichMedia);
    state.currentPage = currentPage;
    state.totalPages = totalPages;
  },

  LOAD_SINGLE_MEDIA_INFO(state, singleMediaInfo) {
    state.singleMediaInfo = singleMediaInfo;
  },

  ADD_MEDIA(state, newMediaItems) {
    state.media = [...newMediaItems.map(enrichMedia), ...state.media];
  },

  UPDATE_MEDIA(state, newMediaData) {
    state.media = state.media.map(singleMedia => {
      if (singleMedia._id === newMediaData._id) {
        return enrichMedia(newMediaData);
      }

      return singleMedia;
    });
  },

  UPDATE_SEARCH(state, keyword) {
    state.search = keyword;
  },

  REMOVE_MEDIA(state, targetImageId) {
    state.media = state.media.filter(image => image._id !== targetImageId);
  },

  RESET_STATE(state) {
    state.search = stateModel.search;
    state.totalPages = stateModel.totalPages;
    state.currentPage = stateModel.currentPage;
    state.itemsPerPage = stateModel.itemsPerPage;
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

  async uploadImages({ commit, dispatch }, { images, progressCb }) {
    const formData = new FormData();

    for (const image of images) {
      formData.append('images', image);
    }

    const response = await showRequestResult({
      request: this.$axios.post('/media/image/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: progressCb,
      }),
      dispatch,
    });

    commit('ADD_MEDIA', response);
  },

  async updateMedia({ commit, dispatch }, { mediaId, mediaData }) {
    const newMediaData = await showRequestResult({
      request: this.$axios.patch(`media/${mediaId}`, {
        ..._pick(mediaData, ['name', 'description']),
      }),
      dispatch,
    });

    if (newMediaData) {
      commit('UPDATE_MEDIA', newMediaData);
    }
  },

  async removeImage({ commit, dispatch }, mediaId) {
    const removedImageId = await showRequestResult({
      request: this.$axios.delete(`media/${mediaId}`),
      dispatch,
    });

    if (removedImageId) {
      commit('REMOVE_MEDIA', removedImageId);
    }
  },

  searchImage({ commit, dispatch }, keyword) {
    commit('UPDATE_SEARCH', keyword);
    dispatch('fetchMoreMedia');
  },

  resetMediaState({ commit }) {
    commit('RESET_STATE');
  },
};
