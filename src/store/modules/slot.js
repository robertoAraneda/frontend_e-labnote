import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/slots";

export default {
  namespaced: true,
  state: {
    slots: [],
  },
  mutations: {
    SET_SLOTS: (state, payload) => {
      state.responseTimes = payload;
    },
  },
  getters: {
    responseTimes: (state) => state.responseTimes,
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
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);

        commit("SET_SLOTS", data);
      } catch (error) {
        commit("SET_SLOTS", []);
        console.log(error);
      }
    },

    getItemsByDate: async ({ commit }, payload) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}?date=${payload}`
        );

        return data;
      } catch (error) {
        commit("SET_SLOTS", []);
        console.log(error);
      }
    },

    getItemsBySimpleDate: async (_, payload) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}?simple-date=${payload}`
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

    deleteItemInBatch: async (_, payload) => {
      try {
        return await httpRequest.deleteRequest(
          `${BASE_URL}/batch/${payload.ids}`
        );
      } catch (e) {
        return e.response;
      }
    },

    updateItemInBatch: async (_, payload) => {
      try {
        const { data } = await httpRequest.putRequest(
          `${BASE_URL}/batch/${payload.ids}`,
          payload
        );

        return data;
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

    postWithDatesRange: async (_, payload) => {
      try {
        return await httpRequest.postRequest(
          `${BASE_URL}/range-dates`,
          payload
        );
      } catch (e) {
        return e.response;
      }
    },
  },
};
