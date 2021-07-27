import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/sampling-conditions";

export default {
  namespaced: true,
  state: {
    samplingConditions: [],
    isSamplingConditionsLoading: false,
  },
  mutations: {
    SET_SAMPLING_CONDITIONS: (state, payload) => {
      state.samplingConditions = payload;
    },
    SET_SAMPLING_CONDITIONS_LOADING: (state, payload) => {
      state.isSamplingConditionsLoading = payload;
    },
  },
  getters: {
    samplingConditions: (state) => state.samplingConditions,
    isSamplingConditionsLoading: (state) => state.isSamplingConditionsLoading,
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
        commit("SET_SAMPLING_CONDITIONS_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_SAMPLING_CONDITIONS", data);
      } catch (error) {
        commit("SET_SAMPLING_CONDITIONS", []);
        console.log(error);
      } finally {
        commit("SET_SAMPLING_CONDITIONS_LOADING", false);
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
