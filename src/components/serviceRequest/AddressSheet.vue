<template>
  <v-sheet
    outlined
    rounded
    class="px-3 mx-3 mt-2"
    :color="backgroundColorSheet"
  >
    <v-row>
      <v-col cols="12" sm="2">
        <BaseSelect
          :value="use"
          @change="$emit('use', $event)"
          :items="['Casa', 'Trabajo']"
          label="Uso"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <BaseTextfield
          :value="text"
          @focusout="$emit('text', $event.target.value)"
          label="Dirección"
        />
      </v-col>
      <v-col cols="12" sm="3">
        <BaseAutocomplete
          :value="city_id"
          @change="$emit('city', $event)"
          :items="cities"
          item-text="name"
          item-value="code"
          label="Comuna"
        />
      </v-col>
      <v-col cols="12" sm="3">
        <BaseAutocomplete
          :value="state_id"
          @change="$emit('state', $event)"
          :items="states"
          item-text="name"
          item-value="code"
          label="Región"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  name: "AddressSheet",

  props: {
    use: String,
    text: String,
    city_id: Number,
    state_id: Number,
    states: Array,
    cities: Array,
  },

  computed: {
    backgroundColorSheet() {
      return "grey lighten-5";
    },
  },
};
</script>

<style scoped></style>
