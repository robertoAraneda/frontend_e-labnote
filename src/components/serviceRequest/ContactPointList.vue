<template>
  <div>
    <ContainerPatientForm subtitle="Medio de contacto">
      <template v-slot:leftButton>
        <BaseAcceptButton
          @click="handleAddNewTelecom"
          label="Agregar otro medio "
          small
          :loading="triggerValidation"
        />
      </template>
      <template v-slot:body>
        <v-list three-line color="transparent">
          <v-list-item
            v-for="(telecom, index) in localTelecoms"
            :key="telecom.value + index"
          >
            <v-list-item-avatar v-if="localTelecoms.length !== 1" size="24">
              <v-icon color="primary"> mdi-numeric-{{ index + 1 }}-box </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <ContactPointItem
                :index="index"
                v-bind.sync="localTelecoms[index]"
                :isFormValid.sync="isValid"
              />
              <v-divider v-if="index < localTelecoms.length - 1"></v-divider>
            </v-list-item-content>

            <v-list-item-action v-if="localTelecoms.length !== 1">
              <v-btn icon @click="handleDestroyItem(index)">
                <v-icon color="grey lighten-1">mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
    </ContainerPatientForm>
    <BaseSnackbar
      custom-message="No puede agregar una nueva dirección. Faltan datos obligatorios."
      type="error"
      v-model="openWarningMessage"
    />
  </div>
</template>

<script>
import ContainerPatientForm from "./ContainerPatientForm";
import ContactPointItem from "./ContactPointItem";
import { mapActions, mapGetters } from "vuex";
import ContactPointPatient from "../../models/ContactPointPatient";

import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "ContactPointList",

  components: { ContactPointItem, ContainerPatientForm },

  mixins: [validationMixin],

  validations: {
    localTelecoms: {
      required,
      $each: {
        use: { required },
        value: { required },
        system: { required },
      },
    },
  },

  data: () => ({
    triggerValidation: false,
    openWarningMessage: false,
    localTelecoms: [new ContactPointPatient()],
    isValid: false,
  }),

  watch: {
    telecoms: {
      deep: true,
      handler() {
        //transformamos el array de contactos para mapearlo con valueTelecom. Error en vuetify al emitir evento con "value"
        this.localTelecoms = [
          ...this.telecoms.map((telecom) => ({
            ...telecom,
            valueTelecom: telecom.value,
          })),
        ];
      },
    },

    emitFormData() {
      this.$v.$touch();

      this.handleTelecomFormValid(this.isValid);

      //transformamos el array de contactos para mapearlo con valueTelecom. Error en vuetify al emitir evento con "value"
      this.editTelecom(
        this.localTelecoms.map((telecom) => ({
          ...telecom,
          value: telecom.valueTelecom,
        }))
      );
    },
  },

  computed: {
    ...mapGetters({
      telecoms: "patient/telecom",
      emitFormData: "patient/emitFormData",
    }),
  },

  methods: {
    ...mapActions({
      editTelecom: "patient/editTelecom",
      emitTriggerErrorForm: "patient/triggerErrorForm",
      handleTelecomFormValid: "patient/telecomFormValid",
    }),

    handleDestroyItem(index) {
      this.localTelecoms.splice(index, 1);
    },

    handleAddNewTelecom() {
      this.emitTriggerErrorForm();

      if (this.isValid) {
        this.localTelecoms.push(new ContactPointPatient());
      } else {
        this.openWarningMessage = true;
        console.log("falta informacióm");
      }
    },
  },
};
</script>

<style scoped></style>
