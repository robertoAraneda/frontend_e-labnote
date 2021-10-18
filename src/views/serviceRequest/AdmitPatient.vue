<template>
  <div>
    <v-overlay :value="dial">
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
        subtitle=" En éste módulo podrás gestionar los pacientes de E-labNote."
      />
      <v-sheet :elevation="elevation" rounded :class="classSheet">
        <IdentifierPatientList />
      </v-sheet>

      <v-sheet :elevation="elevation" rounded :class="classSheet">
        <DemographicPatient />
      </v-sheet>

      <v-sheet :elevation="elevation" rounded :class="classSheet">
        <AddressPatientList />
      </v-sheet>

      <v-sheet :elevation="elevation" rounded :class="classSheet">
        <ContactPointList />
      </v-sheet>

      <v-sheet :elevation="elevation" rounded :class="classSheet">
        <ContactPatientList />
      </v-sheet>

      <v-sheet :elevation="elevation" rounded>
        <v-card-actions>
          <v-spacer />
          <v-btn text> Cancelar </v-btn>
          <v-btn color="primary" @click="savePatient"> Guardar </v-btn>
        </v-card-actions>
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import Patient from "../../models/Patient";
import AddressPatient from "../../models/AddressPatient";
import ContactPointPatient from "../../models/ContactPointPatient";
import ContactPatient from "../../models/ContactPatient";
import AddressPatientList from "../../components/serviceRequest/AddressPatientList";
import IdentifierPatientList from "../../components/serviceRequest/IdentifierPatientList";
import ContactPointList from "../../components/serviceRequest/ContactPointList";
import ContactPatientList from "../../components/serviceRequest/ContactPatientList";
import DemographicPatient from "../../components/serviceRequest/DemographicPatient";
export default {
  name: "AdmitPatient",

  components: {
    DemographicPatient,
    ContactPatientList,
    ContactPointList,
    IdentifierPatientList,
    AddressPatientList,
  },

  mixins: [validationMixin],

  validations: {
    editedItem: {
      patient: {
        birthdate: { required },
        gender_id: { required },
      },
      humanNames: {
        use: { required },
        given: { required },
        father_family: { required },
        mother_family: { required },
      },
    },
  },

  data: () => ({
    test: "",
    addressLength: 1,
    chip1: true,
    chip2: true,
    dial: false,
    states: [],
    cities: [],
    editedItem: new Patient(),
    defaultPatient: new Patient(),
    isEditedPatient: false,
    editedPatientId: -1,
  }),

  async mounted() {
    await this.getStates();
    await this.getCities();
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
    patient(value) {
      if (value.birthdate !== "") {
        this.dial = true;
      } else {
        this.isEditedPatient = false;
        this.editedPatientId = -1;
      }
    },
  },
  computed: {
    ...mapGetters({
      editedPatient: "patient/editedPatient",
      patient: "patient/patient",
    }),

    fullNamePatient() {
      if (!this.patient.name[0]) return "";
      return `${this.patient.name[0].given} ${this.patient.name[0].father_family} ${this.patient.name[0].mother_family}`;
    },

    classSheet() {
      return "mt-3 pb-3";
    },

    elevation() {
      return "0";
    },

    validContact() {
      return (
        this.editedItem.contact[this.editedItem.contact.length - 1]
          .relationship !== null &&
        this.editedItem.contact[this.editedItem.contact.length - 1].given !==
          "" &&
        this.editedItem.contact[this.editedItem.contact.length - 1].family !==
          ""
      );
    },
  },

  methods: {
    ...mapActions({
      store: "patient/postItem",
      update: "patient/putItem",
      destroy: "patient/deleteItem",
      getStates: "patient/getStates",
      getCities: "patient/getCities",
      setEditedPatient: "patient/setEditedPatient",
    }),

    handleDestroyPatient() {
      this.dial = false;
      this.isEditedPatient = false;
      this.editedPatientId = -1;
      this.destroy(this.patient);
    },

    handleCancelBanner() {
      this.dial = false;
      this.isEditedPatient = false;
      this.editedPatientId = -1;
      this.setEditedPatient(new Patient());
    },

    handleSetEditedPatient() {
      this.setEditedPatient(this.patient);
      this.isEditedPatient = true;
      this.editedPatientId = this.patient.id;

      this.$nextTick(() => {
        this.dial = false;
      });
    },

    savePatient() {
      if (this.isEditedPatient) {
        this.update(this.editedPatient);
      } else {
        this.store(this.editedPatient);
      }

      this.setEditedPatient(this.defaultPatient);
    },

    save(date) {
      this.$refs.menu.save(date);
    },

    handleDestroyContactPointForm(index) {
      console.log(index);
      this.editedItem.telecom.splice(index, 1);
    },

    handleDestroyContactForm(index) {
      console.log(index);
      this.editedItem.contact.splice(index, 1);
    },

    handleNewAddress() {
      this.editedItem.address.push(new AddressPatient());
    },

    handleNewContactPoint() {
      this.editedItem.telecom.push(new ContactPointPatient());
    },

    handleNewContact() {
      if (this.validContact) {
        this.editedItem.contact.push(new ContactPatient());
      } else {
        console.log("complete la información");
      }
    },
  },
};
</script>

<style scoped></style>
