import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/process-times";

export default {
  namespaced: true,
  state: {
    processTimes: [],
    isProcessTimesLoading: false,
  },
  mutations: {
    SET_PROCESS_TIMES: (state, payload) => {
      state.processTimes = payload;
    },
    SET_PROCESS_TIMES_LOADING: (state, payload) => {
      state.isProcessTimesLoading = payload;
    },
  },
  getters: {
    processTimes: (state) => state.processTimes,
    isProcessTimesLoading: (state) => state.isProcessTimesLoading,
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
        commit("SET_PROCESS_TIMES_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_PROCESS_TIMES", data);
      } catch (error) {
        commit("SET_PROCESS_TIMES", []);
        console.log(error);
      } finally {
        commit("SET_PROCESS_TIMES_LOADING", false);
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
