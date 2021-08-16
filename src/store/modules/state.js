import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/states";

export default {
  namespaced: true,
  state: {
    states: [],
    citiesByState: [],
    isStateLoading: false,
  },
  mutations: {
    SET_STATES: (state, payload) => {
      state.states = payload;
    },
    SET_STATES_LOADING: (state, payload) => {
      state.isStateLoading = payload;
    },
    SET_CITIES_STATE: (state, payload) => {
      state.citiesByState = payload;
    },
  },
  getters: {
    states: (state) => state.states,
    isStateLoading: (state) => state.isStateLoading,
    citiesByState: (state) => state.citiesByState,
  },
  actions: {
    getCitiesByState: async ({ commit }, codeState) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/${codeState}/cities`
        );

        commit("SET_CITIES_STATE", data);

        console.log("city", data);
      } catch (error) {
        return { success: false };
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
        commit("SET_STATES_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_STATES", data);
      } catch (error) {
        commit("SET_STATES", []);
        console.log(error);
      } finally {
        commit("SET_STATES_LOADING", false);
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
