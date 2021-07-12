import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import laboratory from "./modules/laboratory";
import module from "./modules/module";
import role from "./modules/role";
import permission from "./modules/permission";
import user from "./modules/user";
import menus from "./modules/menus";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: true,
  },
  mutations: {
    SET_DRAWER: (state, payload) => {
      state.drawer = payload;
    },
  },
  getters: {
    drawer: (state) => state.drawer,
  },
  actions: {
    updateDrawer({ commit, state }) {
      const drawer = state.drawer;
      commit("SET_DRAWER", !drawer);
    },
  },
  modules: {
    auth,
    laboratory,
    module,
    role,
    permission,
    user,
    menus,
  },
});
