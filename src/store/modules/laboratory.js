import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/laboratories";
httpRequest.setToken(localStorage.getItem("access_token"));

export default {
  namespaced: true,
  state: {
    laboratories: null,
    modulesByLaboratory: [],
    isLaboratoriesLoading: false,
  },
  mutations: {
    SET_LABORATORIES: (state, payload) => {
      state.laboratories = payload;
    },
    SET_MODULES_LABORATORIES: (state, payload) => {
      state.modulesByLaboratory = payload;
    },
    SET_LABORATORIES_LOADING: (state, payload) => {
      state.isLaboratoriesLoading = payload;
    },
  },
  getters: {
    laboratories: (state) => state.laboratories,
    modulesByLaboratory: (state) => state.modulesByLaboratory,
    isLaboratoriesLoading: (state) => state.isLaboratoriesLoading,
  },
  actions: {
    getModulesByLaboratory: async ({ commit }, idLaboratory) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/${idLaboratory}/modules`
        );

        commit("SET_MODULES_LABORATORIES", data);
      } catch (error) {
        return { success: false };
      }
    },

    showItem: async (_, url) => {
      try {
        return await httpRequest.getRequest(url);
      } catch (e) {
        console.log(e);
      }
    },

    getPaginatedItems: async (_, payload) => {
      return await httpRequest.getRequest(`${BASE_URL}?page=${payload.page}`);
    },

    getItems: async ({ commit }) => {
      try {
        commit("SET_LABORATORIES_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_LABORATORIES", data);
      } catch (error) {
        commit("SET_LABORATORIES", []);
        console.log(error);
      } finally {
        commit("SET_LABORATORIES_LOADING", false);
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
      } catch (error) {
        console.log(error);
      }
    },

    deleteItem: async (_, payload) => {
      try {
        return await httpRequest.deleteRequest(`${BASE_URL}/${payload.id}`);
      } catch (error) {
        console.log(error);
      }
    },

    changeStatusItem: async (_, payload) => {
      try {
        return await httpRequest.putRequest(
          `${BASE_URL}/${payload.id}/status`,
          { active: payload.active }
        );
      } catch (error) {
        console.log(error);
      }
    },
  },
};
