<template>
  <v-row class="justify-center">
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="localIdentifier.identifier_type_id"
        :items="localIdentifierTypes"
        item-text="display"
        item-value="id"
        label="Tipo documento"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <BaseTextfield
        v-if="localIdentifier.identifier_type_id === 1"
        @blur="findPatientByIdentifier(localIdentifier)"
        v-model="localIdentifier.value"
        label="Número documento"
        v-mask="[
          '###-#',
          '####-#',
          '#####-#',
          '######-#',
          '#######-#',
          '########-#',
        ]"
      />
      <BaseTextfield
        v-else
        @blur="findPatientByIdentifier(localIdentifier)"
        v-model="localIdentifier.value"
        label="Número documento"
      />
    </v-col>
    <!--
    <v-col cols="12" sm="4">
      <v-radio-group v-model="localIdentifier.identifier_use_id" row>
        <v-radio
          v-for="use in identifierUses"
          :label="use.display"
          :value="use.id"
          :key="use.id"
        ></v-radio>
      </v-radio-group>
    </v-col>
    -->
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { mask } from "vue-the-mask";
import { PatientIdentifierTypeEnum } from "../../enums/patient-identifier-type.enum";

export default {
  name: "IdentifierPatientItem",

  directives: {
    mask,
  },

  props: {
    identifier: {
      identifier_type_id: Number,
      identifier_use_id: Number,
      value: String,
    },
    index: Number,
  },

  data: (vm) => ({
    localIdentifier: { ...vm.identifier },
  }),

  async mounted() {
    await this.getIdentifierUses();
    await this.getIdentifierTypes();
  },

  watch: {
    localIdentifier: {
      deep: true,

      handler(value) {
        this.editIdentifier({ index: this.index, value });
      },
    },
    editedPatient() {
      this.localIdentifier = { ...this.identifier };
    },
  },

  computed: {
    ...mapGetters({
      identifierTypes: "patient/identifierTypes",
      identifierUses: "patient/identifierUses",
      editedPatient: "patient/editedPatient",
    }),

    localIdentifierTypes() {
      return this.identifierTypes.filter(
        (identifierType) =>
          identifierType.code !== PatientIdentifierTypeEnum.CONFIDENTIAL
      );
    },
  },

  methods: {
    ...mapActions({
      editIdentifier: "patient/editIdentifier",
      getIdentifierTypes: "patient/getIdentifierTypes",
      getIdentifierUses: "patient/getIdentifierUses",
      findPatientByIdentifier: "patient/findPatientByIdentifier",
    }),
  },
};
</script>

<style scoped></style>
