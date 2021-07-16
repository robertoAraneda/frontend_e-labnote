import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/analytes";

export default {
  namespaced: true,
  state: {
    analytes: [],
    isAnalytesLoading: false,
    editAnalyte: null,
  },
  mutations: {
    SET_ANALYTES: (state, payload) => {
      state.analytes = payload;
    },
    SET_ANALYTES_LOADING: (state, payload) => {
      state.isAnalytesLoading = payload;
    },
    SET_EDIT_ANALYTE: (state, payload) => {
      state.editAnalyte = payload;
    },
  },
  getters: {
    analytes: (state) => state.analytes,
    isAnalytesLoading: (state) => state.isAnalytesLoading,
    editAnalyte: (state) => state.editAnalyte,
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
        commit("SET_ANALYTES_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_ANALYTES", data);
      } catch (error) {
        commit("SET_ANALYTES", []);
        console.log(error);
      } finally {
        commit("SET_ANALYTES_LOADING", false);
      }
    },

    postItem: async (_, payload) => {
      try {
        return await httpRequest.postRequest(`${BASE_URL}`, payload);
      } catch (error) {
        console.log(error);
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

    setEditAnalyte: async ({ commit }, payload) => {
      commit("SET_EDIT_ANALYTE", payload);
    },
  },
};
