<template>
  <ContainerPatientForm subtitle="Identificación">
    <template v-slot:body>
      <v-list color="transparent">
        <v-list-item
          v-for="(identifier, index) in identifiers"
          :key="identifier.value + index"
        >
          <v-list-item-content>
            <IdentifierPatientItem :index="index" :identifier="identifier" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </ContainerPatientForm>
</template>

<script>
import { mapGetters } from "vuex";
import IdentifierPatientItem from "./IdentifierPatientItem";
import ContainerPatientForm from "./ContainerPatientForm";

export default {
  name: "IdentifierPatientList",

  components: { ContainerPatientForm, IdentifierPatientItem },

  computed: {
    ...mapGetters({
      identifiers: "patient/identifier",
    }),
  },

  methods: {},
};
</script>

<style scoped></style>
