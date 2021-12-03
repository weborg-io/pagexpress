import { showRequestResult } from '@/utils';

export const state = () => ({
  componentsUsage: {},
});

export const mutations = {
  FETCH_COMPONENT_USAGE(state, { componentId, pages }) {
    state.componentsUsage = {
      [componentId]: pages,
    };
  },
};

export const actions = {
  async fetchComponentUsage({ commit, dispatch }, componentId) {
    const usage = await showRequestResult({
      request: this.$axios.get(`stats/component-usage/${componentId}`),
      dispatch,
    });

    if (usage) {
      commit('FETCH_COMPONENT_USAGE', {
        componentId,
        pages: usage,
      });
    }
  },
};
