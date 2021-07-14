import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/permissions";

export default {
  namespaced: true,
  state: {
    permissions: [],
    menusByModule: [],
    isPermissionsLoading: false,
    currentModule: null,
  },
  mutations: {
    SET_PERMISSIONS: (state, payload) => {
      state.permissions = payload;
    },
    SET_CURRENT_MODULE: (state, payload) => {
      state.currentModule = payload;
    },
    SET_MENUS_MODULE: (state, payload) => {
      state.menusByModule = payload;
    },
    SET_PERMISSIONS_LOADING: (state, payload) => {
      state.isPermissionsLoading = payload;
    },
  },
  getters: {
    isPermissionsLoading: (state) => state.isPermissionsLoading,
    menusByModule: (state) => state.menusByModule,
    currentModule: (state) => state.currentModule,
    permissions: (state) => state.permissions,
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

    getPermissionsByModule: async (_, url) => {
      return await httpRequest.getRequest(url);
    },

    getModuleByName: async ({ commit }, name) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/search?name=${name}`
        );
        console.log(data);

        commit("SET_CURRENT_MODULE", data);
      } catch (error) {
        return { success: false };
      }
    },
    getModuleBySlug: async ({ commit }, slug) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/search?slug=${slug}`
        );
        console.log(data);

        commit("SET_CURRENT_MODULE", data);
      } catch (error) {
        return { success: false };
      }
    },
    getItems: async ({ commit }) => {
      try {
        commit("SET_PERMISSIONS_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_PERMISSIONS", data);
      } catch (error) {
        commit("SET_PERMISSIONS", []);
        console.log(error);
      } finally {
        commit("SET_PERMISSIONS_LOADING", false);
      }
    },
  },
};
