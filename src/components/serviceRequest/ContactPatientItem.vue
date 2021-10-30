<template>
  <v-row>
    <v-col cols="12" sm="3">
      <BaseSelect
        @blur="$v.localContact.relationship.$touch()"
        :error-messages="relationshipErrors"
        @input="$v.localContact.relationship.$touch()"
        v-model="relationshipLocal"
        :items="[
          'PADRE',
          'MADRE',
          'HERMANO/A',
          'ABUELO/A',
          'TIO/A',
          'HIJO/A',
          'OTRO',
        ]"
        label="Relación de contacto"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <BaseTextfield
        @blur="$v.localContact.givenContact.$touch()"
        :error-messages="givenErrors"
        @input="$v.localContact.givenContact.$touch()"
        v-model="givenLocal"
        label="Nombres"
      />
    </v-col>
    <v-col cols="12" sm="5">
      <BaseTextfield
        @blur="$v.localContact.family.$touch()"
        :error-messages="familyErrors"
        @input="$v.localContact.family.$touch()"
        v-model="familyLocal"
        label="Apellidos"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <BaseTextfield
        @blur="$v.localContact.phone.$touch()"
        :error-messages="phoneErrors"
        @input="$v.localContact.phone.$touch()"
        v-model="phoneLocal"
        label="Teléfono"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <BaseTextfield
        @blur="$v.localContact.email.$touch()"
        :error-messages="emailErrors"
        @input="$v.localContact.email.$touch()"
        v-model="emailLocal"
        label="Email"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ContactPatient from "../../models/ContactPatient";

import { validationMixin } from "vuelidate";
import { requiredIf, email, or } from "vuelidate/lib/validators";
import { validationMessage } from "../../helpers/ValidationMessage";

export default {
  name: "ContactPatientItem",

  mixins: [validationMixin],

  validations() {
    return {
      //sólo validamos el form si algún campo del form tiene algún dato
      localContact: {
        givenContact: { required: requiredIf(() => this.isDirty) },
        family: { required: requiredIf(() => this.isDirty) },
        relationship: { required: requiredIf(() => this.isDirty) },
        phone: { required: requiredIf(() => this.isDirty) },
        email: {
          required: requiredIf(() => this.isDirty),
          email: or(email),
        },
      },
    };
  },

  props: {
    givenContact: String,
    family: String,
    relationship: String,
    phone: String,
    email: String,
    index: Number,
    isFormValid: Boolean,
    isFormDirty: Boolean,
  },

  data: () => ({
    localContact: new ContactPatient(),
  }),

  mounted() {
    this.localContact.givenContact = this.givenContact;
    this.localContact.family = this.family;
    this.localContact.relationship = this.relationship;
    this.localContact.phone = this.phone;
    this.localContact.email = this.email;

    //emitimos evento al montar el componente
    this.$emit("update:isFormValid", this.isValid);
    this.$emit("update:isFormDirty", this.isDirty);
  },

  watch: {
    //se utiliza para emitir un evento de errores desde un componente externo.
    triggerErrorForm(value) {
      value && this.$v.$touch();
      this.$emit("update:isFormValid", this.isValid);
    },

    //se utiliza para revisar si el formulario contacto anterior esta correcto antes de crear un nuevo form
    isValid() {
      this.$emit("update:isFormValid", this.isValid);
    },

    isDirty() {
      this.$emit("update:isFormDirty", this.isDirty);
    },
  },

  computed: {
    ...mapGetters({
      editedPatient: "patient/editedPatient",
      triggerErrorForm: "patient/triggerFormErrorAdmitPatient",
    }),

    givenErrors() {
      const errors = [];
      if (!this.$v.localContact.givenContact.$dirty) return errors;
      !this.$v.localContact.givenContact.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    familyErrors() {
      const errors = [];
      if (!this.$v.localContact.family.$dirty) return errors;
      !this.$v.localContact.family.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    relationshipErrors() {
      const errors = [];
      if (!this.$v.localContact.relationship.$dirty) return errors;
      !this.$v.localContact.relationship.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    phoneErrors() {
      const errors = [];
      if (!this.$v.localContact.phone.$dirty) return errors;
      !this.$v.localContact.phone.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    emailErrors() {
      const errors = [];
      if (!this.$v.localContact.email.$dirty) return errors;
      !this.$v.localContact.email.required &&
        errors.push(validationMessage.REQUIRED);
      !this.$v.localContact.email.email && errors.push(validationMessage.EMAIL);
      return errors;
    },

    isValid() {
      return !this.$v.$invalid && !this.isDirty;
    },

    givenLocal: {
      get() {
        return this.givenContact;
      },
      set(value) {
        this.$emit("update:givenContact", value);
        this.localContact.givenContact = value;
      },
    },

    familyLocal: {
      get() {
        return this.family;
      },
      set(value) {
        this.$emit("update:family", value);
        this.localContact.family = value;
      },
    },

    relationshipLocal: {
      get() {
        return this.relationship;
      },
      set(value) {
        this.$emit("update:relationship", value);
        this.localContact.relationship = value;
      },
    },

    emailLocal: {
      get() {
        return this.email;
      },
      set(value) {
        this.$emit("update:email", value);
        this.localContact.email = value;
      },
    },

    phoneLocal: {
      get() {
        return this.phone;
      },
      set(value) {
        this.$emit("update:phone", value);
        this.localContact.phone = value;
      },
    },

    //se revisa que todos los campos estén vacíos. (Para validación)
    isDirty() {
      return (
        !!this.localContact.email ||
        !!this.localContact.family ||
        !!this.localContact.givenContact ||
        !!this.localContact.phone ||
        !!this.localContact.relationship
      );
    },
  },

  methods: {
    ...mapActions({
      editContact: "patient/editContact",
    }),
  },
};
</script>

<style scoped></style>
