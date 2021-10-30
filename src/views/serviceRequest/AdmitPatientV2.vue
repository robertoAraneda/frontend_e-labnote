<template>
  <div>
    <v-overlay :value="openModalPatientExist">
      <v-card color="white" width="600">
        <v-card-text class="text-center">
          <v-avatar color="warning" size="64">
            <v-icon large icon="mdi-alert" color="white"> mdi-alert </v-icon>
          </v-avatar>
        </v-card-text>

        <v-card-text class="text-center black--text darken-5">
          El número de documento
          <strong>{{ editedPatient.identifier[0].value }}</strong> ya se
          encuentra registrado. Pertenece al paciente
          <strong>{{ fullNamePatient }}.</strong><br /><br />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-menu bottom open-on-hover min-width="215">
            <template v-slot:activator="{ on, attrs }">
              <v-btn small rounded color="primary" v-bind="attrs" v-on="on">
                Seleccione una opción
                <v-icon right>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list rounded dense>
              <v-list-item-group>
                <v-list-item @click="handleSetEditedPatient()">
                  <v-list-item-icon>
                    <v-icon>mdi-account-edit</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title> Editar</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="handleDestroyPatient()">
                  <v-list-item-icon>
                    <v-icon>mdi-account-remove</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title> Eliminar</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>
                <v-list-item @click="handleCancelBanner()">
                  <v-list-item-icon>
                    <v-icon>mdi-keyboard-backspace</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title> Volver</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-card-actions>
      </v-card>
    </v-overlay>
    <v-container>
      <BaseHeaderModule
        title="Admisión de pacientes"
        subtitle="En éste módulo podrás gestionar los pacientes de E-labNote."
      />
      <v-sheet elevation="0" rounded class="mt-3 pb-3">
        <IdentifierPatientList :reset="reset" />
      </v-sheet>

      <div v-if="showAdmitPatientForm">
        <v-sheet elevation="0" rounded class="mt-3 pb-3">
          <DemographicPatient />
        </v-sheet>

        <v-sheet elevation="0" rounded class="mt-3 pb-3">
          <ContactPointList />
        </v-sheet>

        <v-sheet elevation="0" rounded class="mt-3 pb-3">
          <AddressPatientList />
        </v-sheet>

        <v-sheet elevation="0" rounded class="mt-3 pb-3">
          <ContactPatientList />
        </v-sheet>

        <v-sheet elevation="0" rounded>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="cancelForm" text> Cancelar </v-btn>
            <v-btn :loading="isValidating" color="primary" @click="savePatient">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-sheet>
      </div>
    </v-container>
    <BaseSnackbar
      custom-message="Faltan datos obligatorios."
      type="error"
      v-model="openWarningMessage"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import IdentifierPatientList from "../../components/serviceRequest/IdentifierPatientList";
import Patient from "../../models/Patient";
import DemographicPatient from "../../components/serviceRequest/DemographicPatient";
import AddressPatientList from "../../components/serviceRequest/AddressPatientList";
import ContactPointList from "../../components/serviceRequest/ContactPointList";
import ContactPatientList from "../../components/serviceRequest/ContactPatientList";

export default {
  name: "AdmitPatientV2",

  components: {
    ContactPatientList,
    ContactPointList,
    AddressPatientList,
    DemographicPatient,
    IdentifierPatientList,
  },

  data: () => ({
    openModalPatientExist: false,
    defaultItem: new Patient(),
    openWarningMessage: false,
    isValidating: false,
    reset: false,
  }),

  mounted() {
    this.getRegions();
    this.getCommunes();
  },

  beforeDestroy() {},

  watch: {
    patient(value) {
      if (value.birthdate !== "") {
        this.openModalPatientExist = true;
      } else {
        this.handleIsEditingPatient(false);

        this.editedPatientId = -1;
      }
    },
  },

  computed: {
    ...mapGetters({
      editedPatient: "patient/editedPatient",
      patient: "patient/patient",
      showAdmitPatientForm: "patient/showAdmitPatientForm",
      isIdentifierFormValid: "patient/isIdentifierFormValid",
      isNameFormValid: "patient/isNameFormValid",
      isAddressFormValid: "patient/isAddressFormValid",
      isTelecomFormValid: "patient/isTelecomFormValid",
      isContactFormValid: "patient/isContactFormValid",
      isEditingPatient: "patient/isEditingPatient",
    }),

    isValidForm() {
      return (
        this.isIdentifierFormValid &&
        this.isNameFormValid &&
        this.isAddressFormValid &&
        this.isTelecomFormValid &&
        this.isContactFormValid
      );
    },

    fullNamePatient() {
      if (!this.patient.name[0]) return "";
      return `${this.patient.name[0].given} ${this.patient.name[0].father_family} ${this.patient.name[0].mother_family}`;
    },
  },

  methods: {
    ...mapActions({
      setEditedPatient: "patient/setEditedPatient",
      triggerErrorForm: "patient/triggerErrorForm",
      emitFormData: "patient/emitFormData",
      setPatient: "patient/setPatient",
      getCommunes: "city/getItems",
      getRegions: "state/getItems",
      triggerAdmitPatientForm: "patient/showAdmitForm",
      handleIsEditingPatient: "patient/handleIsEditingPatient",
      store: "patient/postItem",
      update: "patient/putItem",
      destroy: "patient/deleteItem",
    }),

    handleDestroyPatient() {
      this.destroy(this.patient);
      this.cancelForm();
    },

    handleCancelBanner() {
      this.openModalPatientExist = false;
      this.handleIsEditingPatient(false);
      this.editedPatientId = -1;
      this.cancelForm();
    },

    handleSetEditedPatient() {
      this.triggerAdmitPatientForm(true);

      this.$nextTick(() => {
        this.setEditedPatient(this.patient);
        this.handleIsEditingPatient(true);
        this.editedPatientId = this.patient.id;
        this.openModalPatientExist = false;
      });
    },

    cancelForm() {
      this.reset = true;
      this.openModalPatientExist = false;
      this.handleIsEditingPatient(false);
      this.editedPatientId = -1;
      setTimeout(() => {
        this.setEditedPatient(new Patient());
        this.setPatient(new Patient());
        this.reset = false;
      }, 1000);
    },

    savePatient() {
      this.emitFormData();
      this.triggerErrorForm();

      this.isValidating = false;
      setTimeout(() => {
        if (this.isValidForm) {
          const { contact, ...rest } = this.editedPatient;

          let payload = this.editedPatient;

          if (!contact[0].relationship) {
            payload = rest;
          }

          if (this.isEditingPatient) {
            this.update(payload);
          } else {
            this.store(payload);
          }

          this.cancelForm();
        } else {
          this.openWarningMessage = true;
        }

        this.isValidating = false;
        this.handleIsEditingPatient(false);
      }, 1000);
    },
  },
};
</script>

<style scoped></style>
