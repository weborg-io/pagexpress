import _uniqBy from 'lodash/uniqBy';
import { enrichMedia, reorderItems, showRequestResult } from '@/utils';

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
      images: galleryData.images.map(enrichMedia),
    };
  },

  DEACTIVATE_GALLERY(state) {
    state.activeGallery = null;
  },

  LOAD_SINGLE_MEDIA_INFO(state, singleMediaInfo) {
    state.singleMediaInfo = singleMediaInfo;
  },

  ADD_GALLERY(state, newGalleryData) {
    state.galleries = [newGalleryData, ...state.galleries];
    state.activeGallery = newGalleryData;
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
    state.galleries = state.galleries.filter(
      gallery => gallery._id !== targetGalleryId
    );
    state.activeGallery = null;
  },
};

export const actions = {
  async fetchGalleries({ commit, dispatch }) {
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

  async addGallery({ commit, dispatch }, slug) {
    const galleryId = await showRequestResult({
      request: this.$axios.post('galleries/', { slug }),
      dispatch,
    });

    commit('ADD_GALLERY', { _id: galleryId, slug, images: [] });
  },

  async saveGallery({ dispatch, state }) {
    await showRequestResult({
      request: this.$axios.put(`galleries/${state.activeGallery._id}`, {
        slug: state.activeGallery.slug,
        images: state.activeGallery.images.map(g => g._id),
      }),
      successMessage: 'Saved changes',
      dispatch,
    });

    dispatch('resetDirtyState', null, { root: true });
  },

  async removeGallery({ commit, dispatch, state }, callbackFn) {
    if (
      !confirm(`Please, confirm removing "${state.activeGallery.slug}" gallery`)
    ) {
      return;
    }

    const removedGalleryId = await showRequestResult({
      request: this.$axios.post(`galleries/${state.activeGallery._id}`),
      successMessage: 'Gallery has been removed',
      dispatch,
    });

    if (callbackFn) {
      callbackFn();
    }

    commit('REMOVE_GALLERY', removedGalleryId);
  },

  resetActiveGalleryState({ commit, dispatch }) {
    dispatch('resetDirtyState', null, { root: true });
    commit('DEACTIVATE_GALLERY');
  },

  renameGallery({ commit, dispatch, state }, newSlug) {
    if (state.activeGallery && state.activeGallery.slug === newSlug) {
      return;
    }

    commit('UPDATE_GALLERY', { slug: newSlug });
    dispatch('setDirtyState', null, { root: true });
  },

  addImages({ commit, dispatch, state }, images) {
    dispatch('setDirtyState', null, { root: true });
    commit('UPDATE_GALLERY', {
      ...state.activeGallery,
      images: _uniqBy([...images, ...state.activeGallery.images], '_id'),
    });
  },

  removeImages({ commit, dispatch, state }, imageIds) {
    dispatch('setDirtyState', null, { root: true });
    commit('UPDATE_GALLERY', {
      ...state.activeGallery,
      images: state.activeGallery.images.filter(
        image => !imageIds.includes(image._id)
      ),
    });
  },

  reorderImages({ commit, dispatch, state }, dropResult) {
    dispatch('setDirtyState', null, { root: true });
    commit('UPDATE_GALLERY', {
      ...state.activeGallery,
      images: reorderItems(state.activeGallery.images, dropResult),
    });
  },
};
