<template>
  <v-sheet outlined rounded class="px-3 mx-3" :color="backgroundColorSheet">
    <v-row>
      <v-col cols="12" sm="3">
        <BaseSelect
          :value="use"
          @change="$emit('use', $event)"
          :items="['Casa', 'Trabajo']"
          label="Uso"
        />
      </v-col>
      <v-col cols="12" sm="3">
        <BaseSelect
          :value="system"
          @change="$emit('system', $event)"
          :items="['Email', 'Telefono fijo', 'Celular']"
          label="Tipo"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <BaseTextfield
          :value="value"
          @focusout="$emit('value', $event.target.value)"
          label="El tipo que sea"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  name: "ContactPointSheet",

  props: {
    use: String,
    system: String,
    value: String,
  },

  computed: {
    backgroundColorSheet() {
      return "grey lighten-5";
    },
  },
};
</script>

<style scoped></style>
