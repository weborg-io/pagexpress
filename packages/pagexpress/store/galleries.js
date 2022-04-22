import _omit from 'lodash/omit'
import { enrichMedia, reorderItems, showRequestResult } from '@/utils'

export const state = () => ({
  activeGallery: null,
  galleries: null,
});

export const mutations = {
  LOAD_GALLERIES(state, galleries) {
    state.galleries = galleries;
  },

  LOAD_ACTIVE_GALLERY(state, galleryData) {
    state.activeGallery = {
      ...galleryData,
      images: galleryData.images.map(enrichMedia)
    };
  },

  LOAD_SINGLE_MEDIA_INFO(state, singleMediaInfo) {
    state.singleMediaInfo = singleMediaInfo;
  },

  ADD_GALLERY(state, newGalleryData) {
    state.galleries = [newGalleryData, ...state.galleries];
  },

  UPDATE_GALLERY(state, galleryData) {
    if (!state.activeGallery) {
      return;
    }

    state.activeGallery = {
      ...state.activeGallery,
      ...galleryData,
    };
  },

  REMOVE_GALLERY(state, targetGalleryId) {
    state.galleries = state.galleries
      .filter(gallery => gallery._id !== targetGalleryId);
    state.activeGallery = null;
  },
};

export const actions = {
  async fetchGalleries({ commit, dispatch, state }) {
    const galleries = await showRequestResult({
      request: this.$axios.get('galleries/', {
        params: {
          limit: 99999,
        },
      }),
      dispatch,
    });

    commit('LOAD_GALLERIES', galleries);
  },

  async fetchGallery({ commit, dispatch, state }, galleryId) {
    const gallery = await showRequestResult({
      request: this.$axios.get(`galleries/${galleryId}`),
      dispatch,
    });

    commit('LOAD_ACTIVE_GALLERY', gallery);
  },

  async addGallery({ commit, dispatch }, name) {
    const galleryId = await showRequestResult({
      request: this.$axios.post('galleries/', { name }),
      dispatch,
    });

    commit('ADD_GALLERY', { _id: galleryId, name });
  },

  async saveGallery({ dispatch, state }) {
    await showRequestResult({
      request: this.$axios.put('galleries/', _omit(state.activeGallery, ['_id'])),
      dispatch,
    });

    dispatch('resetDirtyState', null, { root: true });
  },

  async removeGallery({ commit, dispatch }, galleryId) {
    const removedGalleryId = await showRequestResult({
      request: this.$axios.post('galleries/', galleryId),
      dispatch,
    });

    commit('REMOVE_GALLERY', removedGalleryId);
  },

  renameGallery({ commit }, newName) {
    commit('UPDATE_GALLERY', { name: newName });
  },

  addImages({ commit, state }, images) {
    commit('UPDATE_GALLERY', {
      ...state.activeGallery,
      images: [ ...state.activeGallery.images, ...images ],
    });
  },

  removeImages({ commit, state }, imageIds) {
    commit('UPDATE_GALLERY', {
      ...state.activeGallery,
      images: state.activeGallery.images
        .filter(image => !imageIds.includes(image._id))
    })
  },

  reorderImages({ commit, state }, dropResult) {
    commit('UPDATE_GALLERY', {
      ...state.activeGallery,
      images: reorderItems(state.activeGallery.images, dropResult)
    })
  },
};
