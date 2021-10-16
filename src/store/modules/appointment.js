import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/appointments";

export default {
  namespaced: true,
  state: {
    appointments: [],
  },
  mutations: {
    SET_APPOINTMENTS: (state, payload) => {
      state.appointments = payload;
    },
  },
  getters: {
    appointments: (state) => state.appointments,
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

    getAppointmentsByDate: async (_, payload) => {
      return await httpRequest.getRequest(
        `${BASE_URL}?type=${payload.type}&dateStart=${payload.dateStart}&dateEnd=${payload.dateEnd}`
      );
    },

    getItems: async ({ commit }) => {
      try {
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_APPOINTMENTS", data);
      } catch (error) {
        commit("SET_APPOINTMENTS", []);
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
