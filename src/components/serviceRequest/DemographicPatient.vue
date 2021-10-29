<template>
  <ContainerPatientForm subtitle="Datos demográficos">
    <template v-slot:body>
      <v-row v-for="index in name.length" :key="index">
        <v-col cols="12" sm="4">
          <BaseTextfield
            @input="$v.name.$each.$iter[index - 1].given.$touch()"
            @blur="$v.name.$each.$iter[index - 1].given.$touch()"
            :error-messages="nameGivenErrors"
            v-model="name[index - 1].given"
            label="Nombres"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <BaseTextfield
            @input="$v.name.$each.$iter[index - 1].father_family.$touch()"
            @blur="$v.name.$each.$iter[index - 1].father_family.$touch()"
            :error-messages="nameFatherFamilyErrors"
            v-model="name[index - 1].father_family"
            label="Apellido Paterno"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <BaseTextfield
            @input="$v.name.$each.$iter[index - 1].mother_family.$touch()"
            @blur="$v.name.$each.$iter[index - 1].mother_family.$touch()"
            :error-messages="nameMotherFamilyErrors"
            v-model="name[index - 1].mother_family"
            label="Apellido Materno"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <BaseTextfield
                @input="$v.birthdate.$touch()"
                @blur="$v.birthdate.$touch()"
                :error-messages="birthdateErrors"
                v-model="birthdate"
                label="Fecha de nacimiento"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></BaseTextfield>
            </template>
            <v-date-picker
              :active-picker.sync="activePicker"
              :max="
                new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .substr(0, 10)
              "
              min="1900-01-01"
              @input="save"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6">
          <BaseSelect
            @change="$v.localGender.$touch()"
            @blur="$v.localGender.$touch()"
            :error-messages="genderErrors"
            v-model="localGender"
            :items="administrativeGenders"
            item-text="display"
            item-value="id"
            label="Género"
          />
        </v-col>
      </v-row>
    </template>
  </ContainerPatientForm>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ContainerPatientForm from "./ContainerPatientForm";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { validationMessage } from "../../helpers/ValidationMessage";

export default {
  name: "DemographicPatient",

  mixins: [validationMixin],

  validations: {
    name: {
      required,
      $each: {
        given: { required },
        mother_family: { required },
        father_family: { required },
      },
    },
    localGender: { required },
    birthdate: { required },
  },

  components: { ContainerPatientForm },

  data: () => ({
    activePicker: null,
    date: null,
    menu: false,
  }),

  watch: {
    triggerErrorForm(value) {
      console.log("trigger error in demographic form");
      value && this.$v.$touch();
    },

    emitFormData(value) {
      value && this.setName(this.name);
    },

    isFormValid() {
      this.handleNameFormValid(this.isFormValid);
    },
  },

  async mounted() {
    await this.getAdministrativeGenders();
  },

  computed: {
    ...mapGetters({
      name: "patient/name",
      birthdate: "patient/birthdate",
      active: "patient/active",
      gender: "patient/gender",
      administrativeGenders: "patient/administrativeGenders",
      emitFormData: "patient/emitFormData",
      triggerErrorForm: "patient/triggerFormErrorAdmitPatient",
    }),

    isFormValid() {
      return !this.$v.$invalid;
    },

    nameGivenErrors() {
      const errors = [];

      for (let i = 0; i < this.name.length; i++) {
        const v = this.$v.name.$each.$iter[i];
        if (!v.given.$dirty) return errors;
        !v.given.required && errors.push(validationMessage.REQUIRED);
      }

      return errors;
    },

    nameFatherFamilyErrors() {
      const errors = [];

      for (let i = 0; i < this.name.length; i++) {
        const v = this.$v.name.$each.$iter[i];
        if (!v.father_family.$dirty) return errors;
        !v.father_family.required && errors.push(validationMessage.REQUIRED);
      }

      return errors;
    },

    nameMotherFamilyErrors() {
      const errors = [];

      for (let i = 0; i < this.name.length; i++) {
        const v = this.$v.name.$each.$iter[i];
        if (!v.mother_family.$dirty) return errors;
        !v.mother_family.required && errors.push(validationMessage.REQUIRED);
      }

      return errors;
    },

    birthdateErrors() {
      const errors = [];
      if (!this.$v.birthdate.$dirty) return errors;
      !this.$v.birthdate.required && errors.push(validationMessage.REQUIRED);
      return errors;
    },

    genderErrors() {
      const errors = [];
      if (!this.$v.localGender.$dirty) return errors;
      !this.$v.localGender.required && errors.push(validationMessage.REQUIRED);
      return errors;
    },

    localGender: {
      get() {
        return this.gender;
      },
      set(value) {
        this.setGender(value);
      },
    },

    backgroundColorSheet() {
      return "grey lighten-5";
    },
  },

  methods: {
    ...mapActions({
      setBirthdate: "patient/editBirthdate",
      setGender: "patient/editAdministrativeGender",
      getAdministrativeGenders: "patient/getAdministrativeGenders",
      setName: "patient/editName",
      handleNameFormValid: "patient/nameFormValid",
    }),

    save(date) {
      this.setBirthdate(date);
      this.menu = false;
    },
  },
};
</script>

<style scoped></style>
