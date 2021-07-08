import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/menus";
httpRequest.setToken(localStorage.getItem("access_token"));

export default {
  namespaced: true,
  state: {
    menus: [],
    menusByModule: [],
  },
  mutations: {
    SET_MENUS_MODULE: (state, payload) => {
      state.menusByModule = payload;
    },
  },
  getters: {
    menusByModule: (state) => state.menusByModule,
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

  },
};
