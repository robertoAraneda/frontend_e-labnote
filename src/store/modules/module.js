import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/modules";

export default {
  namespaced: true,
  state: {
    modules: [],
    menusByModule: [],
    isModulesLoading: false,
    currentModule: null,
  },
  mutations: {
    SET_MODULES: (state, payload) => {
      state.modules = payload;
    },
    SET_CURRENT_MODULE: (state, payload) => {
      state.currentModule = payload;
    },
    SET_MENUS_MODULE: (state, payload) => {
      state.menusByModule = payload;
    },
    SET_MODULES_LOADING: (state, payload) => {
      state.isModulesLoading = payload;
    },
  },
  getters: {
    modules: (state) => state.modules,
    isModulesLoading: (state) => state.isModulesLoading,
    menusByModule: (state) => state.menusByModule,
    currentModule: (state) => state.currentModule,
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
    getPermissionsByModule: async (_, { idRol, idModule }) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/${idModule}/permissions?cross=true&role_id=${idRol}`
        );

        return data;
      } catch (error) {
        return { success: false };
      }
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
  },
};
