import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/users";

httpRequest.setToken(localStorage.getItem("access_token"));

export default {
  namespaced: true,
  state: {
    users: null,
    isUsersLoading: false,
  },
  mutations: {
    SET_USERS: (state, payload) => {
      state.users = payload;
    },
    SET_USERS_LOADING: (state, payload) => {
      state.isUsersLoading = payload;
    },
  },
  getters: {
    users: (state) => state.users,
    isUsersLoading: (state) => state.isUsersLoading,
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
        commit("SET_USERS_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_USERS", data);
      } catch (error) {
        commit("SET_USERS", []);
        console.log(error);
      } finally {
        commit("SET_USERS_LOADING", false);
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
        return await httpRequest.putRequest(payload._link.self.href, payload);
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
