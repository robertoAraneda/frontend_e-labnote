import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import laboratory from "./modules/laboratory";
import module from "./modules/module";
import role from "./modules/role";
import permission from "./modules/permission";
import user from "./modules/user";
import menus from "./modules/menus";
import workarea from "./modules/workarea";
import analyte from "./modules/analyte";
import loinc from "./modules/loinc";
import observationServiceRequest from "./modules/observationServiceRequest";
import container from "./modules/container";
import availability from "./modules/availability";
import medicalRequestType from "./modules/medicalRequestType";
import processTime from "./modules/processTime";
import specimenCode from "./modules/specimenCode";
import responseTime from "./modules/responseTime";
import sampleQuantity from "./modules/sampleQuantity";
import samplingCondition from "./modules/samplingCondition";
import patient from "./modules/patient";
import state from "./modules/state";
import city from "./modules/city";
import administrativeGender from "./modules/administrativeGender";
import locationPhysicalType from "./modules/locationPhysicalType";
import locationStatus from "./modules/locationStatus";
import locationType from "./modules/locationType";
import serviceRequestCategory from "./modules/serviceRequestCategory";
import serviceRequestIntent from "./modules/serviceRequestIntent";
import serviceRequestPriority from "./modules/serviceRequestPriority";
import serviceRequestStatus from "./modules/serviceRequestStatus";
import location from "./modules/location";
import practitioner from "./modules/practitioner";
import serviceRequest from "./modules/serviceRequest";
import slot from "./modules/slot";
import appointment from "./modules/appointment";
import specimen from "./modules/specimen";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: true,
    isScrolling: false,
  },
  mutations: {
    SET_DRAWER: (state, payload) => {
      state.drawer = payload;
    },
    SET_IS_SCROLLING: (state, payload) => {
      state.isScrolling = payload;
    },
  },
  getters: {
    drawer: (state) => state.drawer,
    isScrolling: (state) => state.isScrolling,
  },
  actions: {
    updateDrawer({ commit, state }) {
      const drawer = state.drawer;
      commit("SET_DRAWER", !drawer);
    },

    setIsScrolling({ commit }, payload) {
      commit("SET_IS_SCROLLING", payload);
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
    workarea,
    analyte,
    loinc,
    observationServiceRequest,
    container,
    availability,
    medicalRequestType,
    processTime,
    specimenCode,
    responseTime,
    sampleQuantity,
    samplingCondition,
    patient,
    state,
    city,
    administrativeGender,
    locationPhysicalType,
    locationStatus,
    locationType,
    serviceRequestCategory,
    serviceRequestIntent,
    serviceRequestPriority,
    serviceRequestStatus,
    location,
    practitioner,
    serviceRequest,
    slot,
    appointment,
    specimen,
  },
});
