import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/menus";
httpRequest.setToken(localStorage.getItem("access_token"));

export default {
  namespaced: true,
  state: {
    menus: [],
    menusByModule: [],
    isMenuLoading: false,
  },
  mutations: {
    SET_MENUS_MODULE: (state, payload) => {
      state.menusByModule = payload;
    },
    SET_MENUS: (state, payload) => {
      state.menus = payload;
    },
    SET_MENUS_LOADING: (state, payload) => {
      state.isMenuLoading = payload;
    },
  },
  getters: {
    menusByModule: (state) => state.menusByModule,
    menus: (state) => state.menus,
    isMenuLoading: (state) => state.isMenuLoading,
  },
  actions: {
    getMenusByModule: async ({ commit }, idModule) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/${idModule}/menus`
        );

        commit("SET_MENUS_MODULE", data);
      } catch (error) {
        return { success: false };
      }
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
  },
};
