<template>
  <v-row>
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="useLocal"
        :items="['PARTICULAR', 'TRABAJO']"
        label="Uso"
        @input="$v.localAddress.use.$touch()"
        @blur="$v.localAddress.use.$touch()"
        :error-messages="addressUseErrors"
      />
    </v-col>
    <v-col cols="12" sm="9">
      <BaseTextfield
        @blur="$v.localAddress.text.$touch()"
        :error-messages="addressTextErrors"
        @input="$v.localAddress.text.$touch()"
        v-model="textLocal"
        label="Dirección"
      />
    </v-col>

    <v-col cols="12" sm="7">
      <BaseAutocomplete
        v-model="stateLocal"
        :items="states"
        item-text="name"
        item-value="code"
        label="Región"
        @input="$v.localAddress.state_code.$touch()"
        @blur="$v.localAddress.state_code.$touch()"
        :error-messages="addressStateCodeErrors"
      />
    </v-col>
    <v-col cols="12" sm="5">
      <BaseAutocomplete
        v-model="cityLocal"
        :items="filteredCities"
        item-text="name"
        item-value="code"
        label="Comuna"
        @input="$v.localAddress.city_code.$touch()"
        @blur="$v.localAddress.city_code.$touch()"
        :error-messages="addressCityCodeErrors"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { validationMessage } from "../../helpers/ValidationMessage";
import AddressPatient from "../../models/AddressPatient";

export default {
  name: "AddressPatientItem",

  mixins: [validationMixin],

  validations: {
    localAddress: {
      use: { required },
      textAddress: { required },
      city_code: { required },
      state_code: { required },
    },
  },

  props: {
    use: String,
    textAddress: String,
    city_code: String,
    state_code: String,

    index: Number,
  },

  data: () => ({
    localAddress: new AddressPatient(),
  }),

  mounted() {
    this.localAddress.use = this.use;
    this.localAddress.textAddress = this.textAddress;
    this.localAddress.city_code = this.city_code;
    this.localAddress.state_code = this.state_code;
  },

  watch: {
    triggerErrorForm(value) {
      console.log("trigger error in address form");
      value && this.$v.$touch();
    },
  },

  computed: {
    ...mapGetters({
      _states: "state/states",
      _cities: "city/cities",
      editedPatient: "patient/editedPatient",
      triggerErrorForm: "patient/triggerFormErrorAdmitPatient",
    }),

    states() {
      if (this._states.length) return [];
      return this._states.collection;
    },

    filteredCities() {
      if (this._cities.length === 0) return [];
      if (!this.localAddress.state_code) return this._cities.collection;
      return this._cities.collection.filter(
        (city) => city.state_code === this.localAddress.state_code
      );
    },

    useLocal: {
      get() {
        return this.use;
      },
      set(value) {
        this.$emit("update:use", value);
        this.localAddress.use = value;
      },
    },

    textLocal: {
      get() {
        return this.textAddress;
      },
      set(value) {
        this.$emit("update:textAddress", value);
        this.localAddress.textAddress = value;
        this.localAddress.text = value;
      },
    },

    cityLocal: {
      get() {
        return this.city_code;
      },
      set(value) {
        this.$emit("update:city_code", value);
        this.localAddress.city_code = value;
      },
    },

    stateLocal: {
      get() {
        return this.state_code;
      },
      set(value) {
        this.$emit("update:state_code", value);
        this.localAddress.state_code = value;
      },
    },

    addressUseErrors() {
      const errors = [];
      if (!this.$v.localAddress.use.$dirty) return errors;
      !this.$v.localAddress.use.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    addressTextErrors() {
      const errors = [];
      if (!this.$v.localAddress.textAddress.$dirty) return errors;
      !this.$v.localAddress.textAddress.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    addressCityCodeErrors() {
      const errors = [];
      if (!this.$v.localAddress.city_code.$dirty) return errors;
      !this.$v.localAddress.city_code.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    addressStateCodeErrors() {
      const errors = [];
      if (!this.$v.localAddress.state_code.$dirty) return errors;
      !this.$v.localAddress.state_code.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },
  },

  methods: {
    ...mapActions({
      editAddress: "patient/editAddress",
    }),
  },
};
</script>

<style scoped></style>
