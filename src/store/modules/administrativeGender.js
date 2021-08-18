import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/administrative-genders";

export default {
  namespaced: true,
  state: {
    administrativeGenders: [],
    isAdministrativeGendersLoading: false,
  },
  mutations: {
    SET_ADMINISTRATIVE_GENDERS: (state, payload) => {
      state.administrativeGenders = payload;
    },
    SET_ADMINISTRATIVE_GENDERS_LOADING: (state, payload) => {
      state.isAdministrativeGendersLoading = payload;
    },
  },
  getters: {
    administrativeGenders: (state) => state.administrativeGenders,
    isAdministrativeGendersLoading: (state) =>
      state.isAdministrativeGendersLoading,
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
        commit("SET_ADMINISTRATIVE_GENDERS_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_ADMINISTRATIVE_GENDERS", data);
      } catch (error) {
        commit("SET_ADMINISTRATIVE_GENDERS", []);
        console.log(error);
      } finally {
        commit("SET_ADMINISTRATIVE_GENDERS_LOADING", false);
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
