import httpRequest from "../../services/axios";

const BASE_URL = "/api/v1/auth";

export default {
  namespaced: true,
  state: {
    loginUser: null,
    access_token: null,
    roleLoggedUser: null,
    laboratoryLoggedUser: null,
    permissionsLoggedUser: [],
    modules: null,
    modulesKeys: [],
    currentMenusByModules: [],
    currentModule: null,
  },
  mutations: {
    SET_LOGIN_USER: (state, user) => {
      state.loginUser = user;
    },
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token;
    },
    SET_ROLE_USER: (state, payload) => {
      state.roleLoggedUser = payload;
    },
    SET_PERMISSION_USER: (state, payload) => {
      state.permissionsLoggedUser = payload;
    },
    SET_MODULES_USER: (state, payload) => {
      state.modules = payload;
    },
    SET_MODULES_USER_KEYS: (state, payload) => {
      state.modulesKeys = payload;
    },
    SET_CURRENT_MENUS_BY_MODULES: (state, payload) => {
      state.currentMenusByModules = payload;
    },

    SET_CURRENT_MODULE: (state, payload) => {
      state.currentModule = payload;
    },
  },
  getters: {
    authenticated: (state) => state.loginUser && state.access_token,
    token: (state) => state.access_token,
    user: (state) => state.loginUser,
    role: (state) => state.roleLoggedUser,
    permissions: (state) => state.permissionsLoggedUser,
    namedPermissions: (state) => {
      return state.permissionsLoggedUser.map((permission) => {
        return permission.name;
      });
    },
    currentModule: (state) => state.currentModule,
    currentMenusByModules: (state) => state.currentMenusByModules,
    modules: (state) => state.modules,
    modulesKeys: (state) => state.modulesKeys,
    namedPermissionsForMenu: (state) => {
      return state.permissionsLoggedUser
        .map((permission) => permission.name)
        .filter((permission) => {
          const split = permission.split(".");
          if (split[1] === "index") {
            return permission;
          }
          return false;
        });
    },
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
        const localToken = localStorage.getItem("access_token");

        if (localToken) {
          httpRequest.setToken(localToken);
          const { data } = await httpRequest.getRequest(`${BASE_URL}/user`);

          commit("SET_LOGIN_USER", data.user);
          commit("SET_ROLE_USER", data.role);
          commit("SET_PERMISSION_USER", data.permissions.collection);

          const modules = data.permissions.collection.reduce(function (
            accumulator,
            object
          ) {
            if (object.module) {
              let key = object["module"]["slug"];
              if (!accumulator[key]) {
                accumulator[key] = [];
              }
              accumulator[key].push(object);
            }
            return accumulator;
          },
          {});

          commit("SET_MODULES_USER_KEYS", Object.keys(modules));
          commit("SET_MODULES_USER", modules);

          return { success: true };
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          commit("SET_ACCESS_TOKEN", null);
          commit("SET_LOGIN_USER", null);
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        commit("SET_ACCESS_TOKEN", null);
        commit("SET_LOGIN_USER", null);
      }
    },

    setCurrentModule: ({ commit }, payload) => {
      commit("SET_CURRENT_MODULE", payload);
    },

    allModulesWithPermissions: async ({ commit }, array) => {
      const { data } = await httpRequest.postRequest(`${BASE_URL}/menus`, {
        modules: array,
      });

      commit("SET_CURRENT_MENUS_BY_MODULES", data);

      return data;
    },

    logout: async ({ commit }) => {
      try {
        const { data } = await httpRequest.getRequest(`${BASE_URL}/logout`);

        if (data.message) {
          httpRequest.setToken(null);
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          commit("SET_LOGIN_USER", null);
          commit("SET_ACCESS_TOKEN", null);

          return { success: true, message: data.message };
        }
      } catch (error) {
        console.log(error);
        return { success: false };
      }
    },
  },
};
