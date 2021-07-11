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

        console.log("menu", data);
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

        commit("SET_CURRENT_MODULE", data);

        console.log(data);
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
        commit("SET_MODULES_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_MODULES", data);
      } catch (error) {
        commit("SET_MODULES", []);
        console.log(error);
      } finally {
        commit("SET_MODULES_LOADING", false);
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
