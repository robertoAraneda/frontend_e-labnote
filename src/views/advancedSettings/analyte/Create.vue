<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-text-field color="primary" label="Nombre" filled></v-text-field>
        <v-text-field
          color="primary"
          disabled
          label="Slug"
          filled
        ></v-text-field>
        <v-textarea
          filled
          name="input-7-4"
          label="Información clínica"
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
        ></v-textarea>
        <v-row>
          <v-col cols="2">
            <v-text-field
              color="primary"
              v-model="search"
              label="Buscar LOINC"
              placeholder="Código"
              filled
              @input="$v.search.$touch()"
              @blur="$v.search.$touch()"
              :error-messages="modelErrors"
            ></v-text-field>
          </v-col>
          <v-col cols="10">
            <v-text-field
              color="primary"
              :value="longCommonName"
              label="Código LOINC"
              disabled
              filled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6"> </v-col>
          <v-col cols="6"> </v-col>
          <v-col cols="6"> </v-col>
          <v-col cols="6"> </v-col>
        </v-row>

        <v-text-field label="Filled" filled></v-text-field>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { validateLoincCode } from "../../../helpers/Functions";
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";

export default {
  name: "Create",

  mixins: [validationMixin],

  validations: {
    search: { validateLoincCode },
  },

  data: () => ({
    isLoading: false,
    items: [],
    search: null,
    model: null,
  }),

  watch: {
    async search(val) {
      this.isLoading = true;

      const test = validateLoincCode(val);

      if (test) {
        try {
          const response = await this.findLoincByCode(val);

          if (response.status === 404) {
            this.items = [{ long_common_name: "Código LOINC no encontrado" }];
          } else {
            this.items = [response.data];
          }
        } catch (e) {
          console.log(e);
        } finally {
          this.isLoading = false;
        }
      } else {
        this.items = [];
      }
    },
  },

  computed: {
    loincs() {
      return this.items;
    },

    longCommonName() {
      if (this.items.length !== 0) return this.items[0].long_common_name;
      return "";
    },

    modelErrors() {
      const errors = [];
      if (!this.$v.search.$dirty) return errors;
      !this.$v.search.validateLoincCode && errors.push("Código inválido");
      return errors;
    },
  },

  methods: {
    ...mapActions({
      findLoincByCode: "loinc/findLoincByCode",
      getProcessTime: "pro",
    }),
  },
};
</script>

<style scoped></style>
