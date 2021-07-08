import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/laboratories";
httpRequest.setToken(localStorage.getItem("access_token"));

export default {
  namespaced: true,
  state: {
    laboratories: [],
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
  },
};
