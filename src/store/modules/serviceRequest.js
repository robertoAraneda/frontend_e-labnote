import httpRequest from "../../services/axios";
import { ServiceRequestStatusEnum } from "../../enums/service-request-status.enum";

const BASE_URL = "/api/v1/service-requests";

export default {
  namespaced: true,
  state: {
    editedServiceRequest: null,
    patient: null,
    serviceRequestPriorities: [],
    isLoadingServiceRequestPriorities: [],
    isServiceRequestCreatedByAppointment: false,
    selectedAppointment: null,
  },
  mutations: {
    SET_EDITED_SERVICE_REQUEST: (state, payload) => {
      state.editedServiceRequest = payload;
    },

    SET_SELECTED_APPOINTMENT: (state, payload) => {
      state.selectedAppointment = payload;
    },

    SET_IS_SERVICE_REQUEST_CREATED_BY_APPOINTMENT: (state, payload) => {
      state.isServiceRequestCreatedByAppointment = payload;
    },

    SET_SERVICE_REQUEST_PRIORITIES: (state, payload) => {
      state.serviceRequestPriorities = payload;
    },

    SET_SERVICE_REQUEST_PRIORITIES_LOADING: (state, payload) => {
      state.isLoadingServiceRequestPriorities = payload;
    },

    SET_PATIENT: (state, payload) => {
      state.patient = payload;
    },
  },
  getters: {
    editedServiceRequest: (state) => state.editedServiceRequest,
    serviceRequestPriorities: (state) => state.serviceRequestPriorities,
    patient: (state) => state.patient,
    isServiceRequestCreatedByAppointment: (state) =>
      state.isServiceRequestCreatedByAppointment,
    selectedAppointment: (state) => state.selectedAppointment,
  },
  actions: {
    setSelectedAppointment: ({ commit }, payload) => {
      commit("SET_SELECTED_APPOINTMENT", payload);
    },

    handleEditServiceRequest: ({ commit }, payload) => {
      commit("SET_EDITED_SERVICE_REQUEST", payload);
    },

    setIsServiceRequestCreatedByAppointment: ({ commit }, payload) => {
      commit("SET_IS_SERVICE_REQUEST_CREATED_BY_APPOINTMENT", payload);
    },

    updateSamplingRoomServiceRequest: async (_, payload) => {
      try {
        return await httpRequest.postRequest(
          `${BASE_URL}/is-sampling-room/update`,
          payload
        );
      } catch (e) {
        return e.response;
      }
    },

    viewPdf: async (_, payload) => {
      const config = {
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
          "Content-Type": "application/json",
        },
      };

      return await httpRequest.getRequest(
        `${BASE_URL}/view-pdf/${payload.id}`,
        config,
        true
      );
    },

    generateCodbar: async (_, payload) => {
      const config = {
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
          "Content-Type": "application/json",
        },
      };

      return await httpRequest.getRequest(
        `${BASE_URL}/generate-codbar/${payload.id}`,
        config,
        true
      );
    },

    generateConfidentialCodbar: async (_, payload) => {
      const config = {
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
          "Content-Type": "application/json",
        },
      };

      return await httpRequest.getRequest(
        `${BASE_URL}/generate-codbar-confidential/${payload.id}`,
        config,
        true
      );
    },

    generateSingleBarcode: async (_, payload) => {
      const config = {
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
          "Content-Type": "application/json",
        },
      };

      return await httpRequest.getRequest(
        `${BASE_URL}/generate-codbar/${payload.id}?accession_identifier=${payload.accession_identifier}`,
        config,
        true
      );
    },

    generateSingleConfidentialBarcode: async (_, payload) => {
      const config = {
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
          "Content-Type": "application/json",
        },
      };

      return await httpRequest.getRequest(
        `${BASE_URL}/generate-codbar-confidential/${payload.id}?accession_identifier=${payload.accession_identifier}`,
        config,
        true
      );
    },

    setPatient: ({ commit }, patient) => {
      commit("SET_PATIENT", patient);
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
        commit("SET_SAMPLING_CONDITIONS_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_SAMPLING_CONDITIONS", data);
      } catch (error) {
        commit("SET_SAMPLING_CONDITIONS", []);
        console.log(error);
      } finally {
        commit("SET_SAMPLING_CONDITIONS_LOADING", false);
      }
    },

    getServiceRequestByDate: async (_, payload) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}?date=${payload.date}`
        );
        return data;
      } catch (error) {
        console.log(error);
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

    getServiceRequestPriorities: async ({ commit }) => {
      try {
        commit("SET_SERVICE_REQUEST_PRIORITIES_LOADING", true);
        const { data } = await httpRequest.getRequest(
          "/api/v1/service-request-priorities"
        );
        commit("SET_SERVICE_REQUEST_PRIORITIES", data);
      } catch (error) {
        commit("SET_SERVICE_REQUEST_PRIORITIES", []);
        console.log(error);
      } finally {
        commit("SET_SERVICE_REQUEST_PRIORITIES_LOADING", false);
      }
    },

    setActiveStatusServiceRequest: async (_, payload) => {
      try {
        return await httpRequest.getRequest(
          `${BASE_URL}/${payload.id}/tracking?status_code=${ServiceRequestStatusEnum.ACTIVE}`
        );
      } catch (e) {
        return e.response;
      }
    },

    setDraftStatusServiceRequest: async (_, payload) => {
      try {
        return await httpRequest.getRequest(
          `${BASE_URL}/${payload.id}/tracking/draft`
        );
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

    getServiceRequestByIdentifier: async (_, payload) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/search?identifier=${payload}`
        );

        return data;
      } catch (e) {
        return e.response;
      }
    },

    getServiceRequestByPatient: async (_, payload) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/search?patient=${payload.patient}&type=${payload.type}`
        );

        return data;
      } catch (e) {
        return e.response;
      }
    },

    getDataDayLineChart: async (_, payload) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/chart/day/${payload}`
        );

        return data;
      } catch (e) {
        console.log(e);
      }
    },

    getDataMonthLineChart: async (_, payload) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/chart/month/${payload}`
        );

        return data;
      } catch (e) {
        console.log(e);
      }
    },

    getObservationLCountByDay: async (_, payload) => {
      try {
        const { data } = await httpRequest.getRequest(
          `/api/v1/service-requests-observations/chart/day/${payload}`
        );

        return data;
      } catch (e) {
        console.log(e);
      }
    },

    getObservationCountByMonth: async (_, payload) => {
      try {
        const { data } = await httpRequest.getRequest(
          `/api/v1/service-requests-observations/chart/month/${payload}`
        );

        return data;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
