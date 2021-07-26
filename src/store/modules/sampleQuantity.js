import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/sample-quantities";

export default {
  namespaced: true,
  state: {
    sampleQuantities: [],
    isSampleQuantitiesLoading: false,
  },
  mutations: {
    SET_SAMPLE_QUANTITIES: (state, payload) => {
      state.sampleQuantities = payload;
    },
    SET_SAMPLE_QUANTITIES_LOADING: (state, payload) => {
      state.isSampleQuantitiesLoading = payload;
    },
  },
  getters: {
    sampleQuantities: (state) => state.sampleQuantities,
    isSampleQuantitiesLoading: (state) => state.isSampleQuantitiesLoading,
  },
  actions: {
    showItem: async (_, url) => {
      try {
        return await httpRequest.getRequest(url);
      } catch (e) {
        return e.response;
      }
    },

    getPaginatedItems: async (_, payload) => {
      return await httpRequest.getRequest(`${BASE_URL}?page=${payload.page}`);
    },

    getItems: async ({ commit }) => {
      try {
        commit("SET_SAMPLE_QUANTITIES_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_SAMPLE_QUANTITIES", data);
      } catch (error) {
        commit("SET_SAMPLE_QUANTITIES", []);
        console.log(error);
      } finally {
        commit("SET_SAMPLE_QUANTITIES_LOADING", false);
      }
    },

    postItem: async (_, payload) => {
      try {
        return await httpRequest.postRequest(`${BASE_URL}`, payload);
      } catch (e) {
        return e.response;
      }
    },

    putItem: async (_, payload) => {
      try {
        return await httpRequest.putRequest(
          `${BASE_URL}/${payload.id}`,
          payload
        );
      } catch (e) {
        return e.response;
      }
    },

    deleteItem: async (_, payload) => {
      try {
        return await httpRequest.deleteRequest(`${BASE_URL}/${payload.id}`);
      } catch (e) {
        return e.response;
      }
    },

    changeStatusItem: async (_, payload) => {
      try {
        return await httpRequest.putRequest(
          `${BASE_URL}/${payload.id}/status`,
          { active: payload.active }
        );
      } catch (e) {
        return e.response;
      }
    },
  },
};
