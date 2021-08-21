import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/service-request-priorities";

export default {
  namespaced: true,
  state: {
    serviceRequestPriorities: [],
    isServiceRequestPriorityLoading: false,
  },
  mutations: {
    SET_SERVICE_REQUEST_PRIORITIES: (state, payload) => {
      state.serviceRequestPriorities = payload;
    },
    SET_SERVICE_REQUEST_PRIORITIES_LOADING: (state, payload) => {
      state.isServiceRequestPriorityLoading = payload;
    },
  },
  getters: {
    serviceRequestPriorities: (state) => state.serviceRequestPriorities,
    isServiceRequestPriorityLoading: (state) =>
      state.isServiceRequestPriorityLoading,
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
        commit("SET_SERVICE_REQUEST_PRIORITIES_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_SERVICE_REQUEST_PRIORITIES", data);
      } catch (error) {
        commit("SET_SERVICE_REQUEST_PRIORITIES", []);
        console.log(error);
      } finally {
        commit("SET_SERVICE_REQUEST_PRIORITIES_LOADING", false);
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
