import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/patients";

export default {
  namespaced: true,
  state: {
    patient: null,
    patients: [],
    addressPatient: [],
  },
  mutations: {
    SET_PATIENTS: (state, payload) => {
      state.patients = payload;
    },
    SET_PATIENT: (state, payload) => {
      state.patient = payload;
    },
  },
  getters: {
    patient: (state) => state.patient,
    patients: (state) => state.patients,
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
        commit("SET_MENUS_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_MENUS", data);
      } catch (error) {
        commit("SET_MENUS", []);
        console.log(error);
      } finally {
        commit("SET_MENUS_LOADING", false);
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

    getStates: async () => {
      return await httpRequest.getRequest("/api/v1/states");
    },

    getCities: async () => {
      return await httpRequest.getRequest("/api/v1/cities");
    },
  },
};
