import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/auth";

export default {
  namespaced: true,
  state: {
    loginUser: null,
    access_token: null,
    roleLoggedUser: null,
    laboratoryLoggedUser: null,
  },
  mutations: {
    SET_LOGIN_USER: (state, user) => {
      state.loginUser = user;
    },
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token;
    },
  },
  getters: {
    authenticated: (state) => state.loginUser && state.access_token,
    token: (state) => state.access_token,
    user: (state) => state.loginUser,
  },
  actions: {
    login: async (_, credentials) => {
      try {
        const { data } = await httpRequest.postRequest(
          `${BASE_URL}/login`,
          credentials
        );

        console.log(data);

        return { success: true, token: data.access_token };
      } catch (error) {
        return { success: false };
      }
    },
    attempt: async ({ commit, state }, token) => {
      if (token) {
        localStorage.setItem("access_token", token);
        commit("SET_ACCESS_TOKEN", token);
      }

      if (!state.access_token) {
        return;
      }

      try {
        httpRequest.setToken(localStorage.getItem("access_token"));
        const { data } = await httpRequest.getRequest(`${BASE_URL}/user`);

        commit("SET_LOGIN_USER", data.user);

        return { success: true };
      } catch (error) {
        console.log(error.response);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        commit("SET_ACCESS_TOKEN", null);
        commit("SET_LOGIN_USER", null);
      }
    },
    logout: async ({ commit }) => {
      try {
        httpRequest.setToken(localStorage.getItem("access_token"));
        const { data } = await httpRequest.getRequest(`${BASE_URL}/logout`);

        httpRequest.setToken(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        commit("SET_LOGIN_USER", null);
        commit("SET_ACCESS_TOKEN", null);

        return { success: true, message: data.message };
      } catch (error) {
        console.log(error);
        return { success: false };
      }
    },
  },
};
