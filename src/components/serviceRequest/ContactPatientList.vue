<template>
  <div>
    <ContainerPatientForm subtitle="Contacto adicional">
      <template v-slot:leftButton>
        <BaseAcceptButton
          @click="handleAddNewContact"
          label="Agregar otro contacto"
          small
        />
      </template>
      <template v-slot:body>
        <v-list three-line color="transparent">
          <v-list-item
            v-for="(contact, index) in localContactPatient"
            :key="contact.given + index"
          >
            <v-list-item-avatar
              v-if="localContactPatient.length !== 1"
              size="24"
            >
              <v-icon color="primary"> mdi-numeric-{{ index + 1 }}-box </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <ContactPatientItem
                :index="index"
                v-bind.sync="localContactPatient[index]"
                :isFormValid.sync="isValid"
                :isFormDirty.sync="isDirty"
              />
              <v-divider
                v-if="index < localContactPatient.length - 1"
              ></v-divider>
            </v-list-item-content>

            <v-list-item-action v-if="localContactPatient.length !== 1">
              <v-btn icon @click="handleDestroyItem(index)">
                <v-icon color="grey lighten-1">mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
    </ContainerPatientForm>
    <BaseSnackbar
      custom-message="No puede agregar otro contacto. Faltan datos obligatorios."
      type="error"
      v-model="openWarningMessage"
    />
  </div>
</template>

<script>
import ContainerPatientForm from "./ContainerPatientForm";
import ContactPatientItem from "./ContactPatientItem";
import { mapActions, mapGetters } from "vuex";
import ContactPatient from "../../models/ContactPatient";

import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  name: "ContactPatientList",

  mixins: [validationMixin],

  components: { ContactPatientItem, ContainerPatientForm },

  validations: {
    localContactPatient: {
      $each: {
        given: { required },
        family: { required },
        relationship: { required },
        phone: { required },
        email: { required, email },
      },
    },
  },

  data: () => ({
    localContactPatient: [new ContactPatient()],
    triggerValidation: false,
    openWarningMessage: false,
    isValid: false,
    isDirty: false,
  }),

  watch: {
    contacts() {
      //transformamos el array de contactos para mapearlo con givenContact. Error en vuetify al emitir evento con "given"
      if (this.contacts.length !== 0) {
        this.localContactPatient = [
          ...this.contacts.map((contact) => ({
            ...contact,
            givenContact: contact.given,
          })),
        ];
      }
    },

    emitFormData() {
      this.$v.$touch();

      this.handleContactFormValid(this.isValid);

      if (this.isValid) {
        //transformamos el array de contactos para mapearlo con givenContact. Error en vuetify al emitir evento con "given"
        this.editContact(
          this.localContactPatient.map((contact) => ({
            ...contact,
            given: contact.givenContact,
          }))
        );
      }
    },
  },

  computed: {
    ...mapGetters({
      contacts: "patient/contact",
      emitFormData: "patient/emitFormData",
    }),
  },

  methods: {
    ...mapActions({
      editContact: "patient/editContact",
      emitTriggerErrorForm: "patient/triggerErrorForm",
      handleContactFormValid: "patient/contactFormValid",
    }),

    handleDestroyItem(index) {
      this.localContactPatient.splice(index, 1);
    },

    handleAddNewContact() {
      this.emitTriggerErrorForm();

      if (this.isDirty) {
        this.localContactPatient.push(new ContactPatient());
      } else {
        this.openWarningMessage = true;
      }
    },
  },
};
</script>

<style scoped></style>
