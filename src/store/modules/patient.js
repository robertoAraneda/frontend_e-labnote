import httpRequest from "../../services/axios";
import Patient from "../../models/Patient";

const BASE_URL = "/api/v1/patients";

export default {
  namespaced: true,
  state: {
    patient: new Patient(),
    patients: [],
    editedPatient: new Patient(),
    states: [],
    cities: [],
    administrativeGenders: [],
    identifierTypes: [],
    identifierUses: [],
  },
  mutations: {
    SET_PATIENTS: (state, payload) => {
      state.patients = payload;
    },
    SET_PATIENT: (state, payload) => {
      state.patient = payload;
    },

    SET_EDITED_PATIENT: (state, payload) => {
      state.editedPatient = payload;
    },

    SET_STATES: (state, payload) => {
      state.states = payload;
    },
    SET_CITIES: (state, payload) => {
      state.cities = payload;
    },

    SET_IDENTIFIER_TYPES: (state, payload) => {
      state.identifierTypes = payload;
    },

    SET_IDENTIFIER_USES: (state, payload) => {
      state.identifierUses = payload;
    },

    SET_ADMINISTRATIVE_GENDERS: (state, payload) => {
      state.administrativeGenders = payload;
    },

    SET_NAME: (state, payload) => {
      state.editedPatient.name = payload;
    },

    SET_IDENTIFIER: (state, payload) => {
      state.editedPatient.identifier[payload.index] = payload.value;
    },
    SET_BIRTHDATE: (state, payload) => {
      state.editedPatient.birthdate = payload;
    },
    SET_GENDER: (state, payload) => {
      state.editedPatient.administrative_gender_id = payload;
    },
    SET_ACTIVE: (state, payload) => {
      state.editedPatient.active = payload;
    },

    SET_ADDRESS: (state, payload) => {
      state.editedPatient.address[payload.index] = payload.value;
    },

    SET_NEW_ADDRESS: (state, payload) => {
      state.editedPatient.address.push(payload);
    },

    SET_DESTROY_ADDRESS_ITEM: (state, payload) => {
      state.editedPatient.address.splice(payload, 1);
    },

    SET_TELECOM: (state, payload) => {
      state.editedPatient.telecom[payload.index] = payload.value;
    },

    SET_NEW_TELECOM: (state, payload) => {
      state.editedPatient.telecom.push(payload);
    },

    SET_DESTROY_TELECOM_ITEM: (state, payload) => {
      state.editedPatient.telecom.splice(payload, 1);
    },

    SET_CONTACT: (state, payload) => {
      state.editedPatient.contact[payload.index] = payload.value;
    },

    SET_NEW_CONTACT: (state, payload) => {
      state.editedPatient.contact.push(payload);
    },

    SET_DESTROY_CONTACT_ITEM: (state, payload) => {
      state.editedPatient.contact.splice(payload, 1);
    },
  },
  getters: {
    patient: (state) => state.patient,
    patients: (state) => state.patients,
    editedPatient: (state) => state.editedPatient,
    states: (state) => state.states,
    cities: (state) => state.cities,
    address: (state) => state.editedPatient.address,
    name: (state) => state.editedPatient.name[0],
    identifier: (state) => state.editedPatient.identifier,
    telecom: (state) => state.editedPatient.telecom,
    contact: (state) => state.editedPatient.contact,
    birthdate: (state) => state.editedPatient.birthdate,
    gender: (state) => state.editedPatient.administrative_gender_id,
    active: (state) => state.editedPatient.active,
    administrativeGenders: (state) => state.administrativeGenders,
    identifierTypes: (state) => state.identifierTypes,
    identifierUses: (state) => state.identifierUses,
  },
  actions: {
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
        commit("SET_MENUS_LOADING", true);
        const { data } = await httpRequest.getRequest(`${BASE_URL}`);
        console.log(data);
        commit("SET_MENUS", data);
      } catch (error) {
        commit("SET_MENUS", []);
        console.log(error);
      } finally {
        commit("SET_MENUS_LOADING", false);
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

    getStates: async ({ commit }) => {
      try {
        const { data } = await httpRequest.getRequest("/api/v1/states");
        commit("SET_STATES", data.collection);
      } catch (e) {
        console.log(e);
        commit("SET_STATES", []);
      }
    },

    getCities: async ({ commit }) => {
      try {
        const { data } = await httpRequest.getRequest("/api/v1/cities");
        commit("SET_CITIES", data.collection);
      } catch (e) {
        console.log(e);
        commit("SET_CITIES", []);
      }
    },

    getAdministrativeGenders: async ({ commit }) => {
      try {
        const { data } = await httpRequest.getRequest(
          "/api/v1/administrative-genders"
        );
        commit("SET_ADMINISTRATIVE_GENDERS", data.collection);
      } catch (e) {
        console.log(e);
        commit("SET_ADMINISTRATIVE_GENDERS", []);
      }
    },

    getIdentifierTypes: async ({ commit }) => {
      try {
        const { data } = await httpRequest.getRequest(
          "/api/v1/identifier-types"
        );
        commit("SET_IDENTIFIER_TYPES", data.collection);
      } catch (e) {
        console.log(e);
        commit("SET_IDENTIFIER_TYPES", []);
      }
    },

    getIdentifierUses: async ({ commit }) => {
      try {
        const { data } = await httpRequest.getRequest(
          "/api/v1/identifier-uses"
        );
        commit("SET_IDENTIFIER_USES", data.collection);
      } catch (e) {
        console.log(e);
        commit("SET_IDENTIFIER_USES", []);
      }
    },

    findPatientByIdentifier: async ({ commit }, payload) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/search?query=identifier&value=${payload}`
        );

        if (
          data &&
          Object.keys(data).length > 0 &&
          data.constructor === Object
        ) {
          commit("SET_PATIENT", data);
          console.log("found");
        } else {
          console.log("not found");
          commit("SET_PATIENT", new Patient());
          commit("SET_EDITED_PATIENT", new Patient());

          const identifier = {
            value: payload,
          };
          commit("SET_IDENTIFIER", { value: identifier, index: 0 });
        }
      } catch (e) {
        commit("SET_PATIENT", new Patient());
        return e.response;
      }
    },

    findPatientByNames: async ({ commit }, payload) => {
      try {
        const { data } = await httpRequest.getRequest(
          `${BASE_URL}/search?query=names&given=${payload.given}&father_family=${payload.father_family}&mother_family=${payload.mother_family}`
        );

        console.log(data);

        commit("SET_PATIENTS", data);
        return data;
      } catch (e) {
        commit("SET_PATIENTS", []);
        return e.response;
      }
    },
    setPatients: ({ commit }, payload) => {
      commit("SET_PATIENTS", payload);
    },

    setEditedPatient: ({ commit }, payload) => {
      commit("SET_EDITED_PATIENT", payload);
    },

    editName: ({ commit }, payload) => {
      commit("SET_NAME", payload);
    },

    editIdentifier: ({ commit }, payload) => {
      commit("SET_IDENTIFIER", payload);
    },

    editBirthdate: ({ commit }, payload) => {
      commit("SET_BIRTHDATE", payload);
    },

    editAdministrativeGender: ({ commit }, payload) => {
      commit("SET_GENDER", payload);
    },

    editActive: ({ commit }, payload) => {
      commit("SET_ACTIVE", payload);
    },

    editAddress: ({ commit }, payload) => {
      commit("SET_ADDRESS", payload);
    },

    addNewAddress: ({ commit }, payload) => {
      commit("SET_NEW_ADDRESS", payload);
    },

    destroyAddressItem: ({ commit }, payload) => {
      commit("SET_DESTROY_ADDRESS_ITEM", payload);
    },

    editTelecom: ({ commit }, payload) => {
      commit("SET_TELECOM", payload);
    },

    addNewTelecom: ({ commit }, payload) => {
      commit("SET_NEW_TELECOM", payload);
    },

    destroyTelecomItem: ({ commit }, payload) => {
      commit("SET_DESTROY_TELECOM_ITEM", payload);
    },

    editContact: ({ commit }, payload) => {
      commit("SET_CONTACT", payload);
    },

    addNewContact: ({ commit }, payload) => {
      commit("SET_NEW_CONTACT", payload);
    },

    destroyContactItem: ({ commit }, payload) => {
      commit("SET_DESTROY_CONTACT_ITEM", payload);
    },
  },
};
