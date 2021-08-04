<template>
  <v-row>
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="localAddress.use"
        :items="['Casa', 'Trabajo']"
        label="Uso"
      />
    </v-col>
    <v-col cols="12" sm="9">
      <BaseTextfield v-model="localAddress.text" label="Dirección" />
    </v-col>
    <v-col cols="12" sm="7">
      <BaseAutocomplete
        v-model="localAddress.state_code"
        :items="states"
        item-text="name"
        item-value="code"
        label="Región"
      />
    </v-col>
    <v-col cols="12" sm="5">
      <BaseAutocomplete
        v-model="localAddress.city_code"
        :items="cities"
        item-text="name"
        item-value="code"
        label="Comuna"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AddressPatientItem",

  props: {
    address: {
      use: String,
      text: String,
      city_code: String,
      state_code: String,
    },
    index: Number,
  },

  data: (vm) => ({
    localAddress: { ...vm.address },
  }),

  watch: {
    localAddress: {
      deep: true,

      handler(value) {
        this.editAddress({ index: this.index, value });
      },
    },
  },

  computed: {
    ...mapGetters({
      states: "patient/states",
      cities: "patient/cities",
    }),
  },

  methods: {
    ...mapActions({
      editAddress: "patient/editAddress",
    }),
  },
};
</script>

<style scoped></style>
