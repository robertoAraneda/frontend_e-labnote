import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/cities";

export default {
  namespaced: true,
  state: {
    cities: [],
    isCityLoading: false,
  },
  mutations: {
    SET_CITIES: (state, payload) => {
      state.cities = payload;
    },
    SET_CITIES_LOADING: (state, payload) => {
      state.isCityLoading = payload;
    },
  },
  getters: {
    cities: (state) => state.cities,
    isCityLoading: (state) => state.isCityLoading,
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
        commit("SET_CITIES_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_CITIES", data);
      } catch (error) {
        commit("SET_CITIES", []);
        console.log(error);
      } finally {
        commit("SET_CITIES_LOADING", false);
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
          `${BASE_URL}/${payload.code}`,
          payload
        );
      } catch (e) {
        return e.response;
      }
    },

    deleteItem: async (_, payload) => {
      try {
        return await httpRequest.deleteRequest(`${BASE_URL}/${payload.code}`);
      } catch (e) {
        return e.response;
      }
    },

    changeStatusItem: async (_, payload) => {
      try {
        return await httpRequest.putRequest(
          `${BASE_URL}/${payload.code}/status`,
          { active: payload.active }
        );
      } catch (e) {
        return e.response;
      }
    },
  },
};
