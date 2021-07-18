import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/medical-request-types";

export default {
  namespaced: true,
  state: {
    medicalRequestTypes: [],
    isMedicalRequestTypesLoading: false,
  },
  mutations: {
    SET_MEDICAL_REQUEST_TYPES: (state, payload) => {
      state.medicalRequestTypes = payload;
    },
    SET_MEDICAL_REQUEST_TYPES_LOADING: (state, payload) => {
      state.isMedicalRequestTypesLoading = payload;
    },
  },
  getters: {
    medicalRequestTypes: (state) => state.medicalRequestTypes,
    isMedicalRequestTypesLoading: (state) => state.isMedicalRequestTypesLoading,
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
        commit("SET_MEDICAL_REQUEST_TYPES_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_MEDICAL_REQUEST_TYPES", data);
      } catch (error) {
        commit("SET_MEDICAL_REQUEST_TYPES", []);
        console.log(error);
      } finally {
        commit("SET_MEDICAL_REQUEST_TYPES_LOADING", false);
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
