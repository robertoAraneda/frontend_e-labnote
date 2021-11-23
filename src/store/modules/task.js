import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/tasks";

export default {
  namespaced: true,
  state: {
    tasks: [],
    task: false,
  },
  mutations: {
    SET_TASKS: (state, payload) => {
      state.tasks = payload;
    },
    SET_TASK: (state, payload) => {
      state.task = payload;
    },
  },
  getters: {
    tasks: (state) => state.tasks,
    task: (state) => state.task,
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
        console.log(data);
        commit("SET_TASKS", data);
      } catch (error) {
        commit("SET_TASKS", []);
        console.log(error);
      }
    },

    postItem: async (_, payload) => {
      return await httpRequest.postRequest(`${BASE_URL}`, payload);
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
