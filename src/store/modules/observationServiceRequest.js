import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/service-request-observation-codes";

export default {
  namespaced: true,
  state: {
    observationServiceRequests: [],
    isObservationServiceRequestLoading: false,
    editObservationServiceRequest: null,
  },
  mutations: {
    SET_OBSERVATION_SERVICE_REQUESTS: (state, payload) => {
      state.observationServiceRequests = payload;
    },
    SET_OBSERVATION_SERVICE_REQUESTS_LOADING: (state, payload) => {
      state.isObservationServiceRequestLoading = payload;
    },
    SET_EDIT_OBSERVATION_SERVICE_REQUEST: (state, payload) => {
      state.editObservationServiceRequest = payload;
    },
  },
  getters: {
    observationServiceRequests: (state) => state.observationServiceRequests,
    isObservationServiceRequestLoading: (state) =>
      state.isObservationServiceRequestLoading,
    editObservationServiceRequest: (state) =>
      state.editObservationServiceRequest,
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

    getPaginatedItemsByLetter: async (_, payload) => {
      return await httpRequest.getRequest(
        `/api/v1/public/service-request-observation-codes/search?letter=${payload.letter}`
      );
    },

    getItems: async ({ commit }) => {
      try {
        commit("SET_OBSERVATION_SERVICE_REQUESTS_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_OBSERVATION_SERVICE_REQUESTS", data);
      } catch (error) {
        commit("SET_OBSERVATION_SERVICE_REQUESTS", []);
        console.log(error);
      } finally {
        commit("SET_OBSERVATION_SERVICE_REQUESTS_LOADING", false);
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

    setEdit: async ({ commit }, payload) => {
      commit("SET_EDIT_OBSERVATION_SERVICE_REQUEST", payload);
    },

    getItemBySlug: async (_, payload) => {
      try {
        return await httpRequest.getRequest(
          `${BASE_URL}/search?slug=${payload}`
        );
      } catch (e) {
        return e.response;
      }
    },

    getItemBySlugPublicAuth: async (_, payload) => {
      try {
        return await httpRequest.getRequest(
          `/api/v1/public/service-request-observation-codes/search?slug=${payload}`
        );
      } catch (e) {
        return e.response;
      }
    },

    getNobilisAnalytes: async () => {
      try {
        const { data } = await httpRequest.getRequest(
          `/api/v1/nobilis-analytes`
        );
        return data.collection;
      } catch (e) {
        return e.response;
      }
    },

    storeNobilisAnalyteIntegration: async (
      _,
      { observation_service_request_id, model_id }
    ) => {
      try {
        const { data } = await httpRequest.postRequest(
          `${BASE_URL}/${observation_service_request_id}/nobilis-analytes`,
          { model_id }
        );
        return data;
      } catch (e) {
        return e.response;
      }
    },
  },
};
