import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/loinc";

export default {
  namespaced: true,
  state: {
    loincs: [],
    isLoincsLoading: false,
  },
  mutations: {
    SET_LOINCS: (state, payload) => {
      state.loincs = payload;
    },
    SET_LOINCS_LOADING: (state, payload) => {
      state.isLoincsLoading = payload;
    },
  },
  getters: {
    loincs: (state) => state.loincs,
    isLoincsLoading: (state) => state.isLoincsLoading,
  },
  actions: {
    findLoincByCode: async (_, code) => {
      try {
        return await httpRequest.getRequest(`${BASE_URL}/${code}`);
      } catch (e) {
        return e.response;
      }
    },

    findLoincByCodeFHIR: async (_, code) => {
      try {
        return await httpRequest.getRequest(`${BASE_URL}/search/${code}`);
      } catch (e) {
        return e.response;
      }
    },

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
        commit("SET_WORKAREAS_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_WORKAREAS", data);
      } catch (error) {
        commit("SET_WORKAREAS", []);
        console.log(error);
      } finally {
        commit("SET_WORKAREAS_LOADING", false);
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
  },
};
