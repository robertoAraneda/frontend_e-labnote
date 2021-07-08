import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/roles";

httpRequest.setToken(localStorage.getItem("access_token"));

export default {
  namespaced: true,
  state: {
    roles: [],
    isRolesLoading: false,
    permissionByRole: [],
    isPermissionByRoleLoading: false,
  },
  mutations: {
    SET_ROLES: (state, payload) => {
      state.roles = payload;
    },
    SET_PERMISSION_ROLE: (state, payload) => {
      state.permissionByRole = payload;
    },
    SET_ROLES_LOADING: (state, payload) => {
      state.isRolesLoading = payload;
    },
    SET_PERMISSION_ROLES_LOADING: (state, payload) => {
      state.isPermissionByRoleLoading = payload;
    },
  },
  getters: {
    roles: (state) => state.roles.filter((role) => role.name !== "super-admin"),
    isRolesLoading: (state) => state.isRolesLoading,
    permissionByRole: (state) => state.permissionByRole,
    isPermissionByRoleLoading: (state) => state.isPermissionByRoleLoading,
  },
  actions: {
    getRoles: async ({ commit }) => {
      try {
        commit("SET_ROLES_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        commit("SET_ROLES", data);
      } catch (error) {
        commit("SET_ROLES", []);
        console.log(error);
      } finally {
        commit("SET_ROLES_LOADING", false);
      }
    },
    postRoles: async (_, payload) => {
      try {
        return await httpRequest.postRequest(`${BASE_URL}`, payload);
      } catch (error) {
        console.log(error);
      }
    },

    putRoles: async (_, payload) => {
      try {
        return await httpRequest.putRequest(
          `${BASE_URL}/${payload.id}`,
          payload
        );
      } catch (error) {
        console.log(error);
      }
    },

    deleteRoles: async (_, payload) => {
      try {
        return await httpRequest.deleteRequest(`${BASE_URL}/${payload.id}`);
      } catch (error) {
        console.log(error);
      }
    },

    getPermissionByRole: async (_, { idRole, idModule }) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/${idRole}/permissions?cross=true&module_id=${idModule}`
        );
        return data;
      } catch (error) {
        console.log(error);
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
