<template>
  <v-sheet outlined rounded class="px-3 mx-3" :color="backgroundColorSheet">
    <v-row>
      <v-col cols="12" sm="3">
        <BaseSelect
          :value="relationship"
          @change="$emit('relationship', $event)"
          :items="['Padre', 'Madre', 'Hermano/a', 'Abuelo/a', 'Tío/a', 'Otro']"
          label="Relación de contacto"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <BaseTextfield
          :value="given"
          @focusout="$emit('given', $event.target.value)"
          label="Nombres"
        />
      </v-col>
      <v-col cols="12" sm="5">
        <BaseTextfield
          :value="family"
          @focusout="$emit('family', $event.target.value)"
          label="Apellidos"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <BaseTextfield
          :value="phone"
          @focusout="$emit('phone', $event.target.value)"
          label="Teléfono"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <BaseTextfield
          :value="email"
          @focusout="$emit('email', $event.target.value)"
          label="Email"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  name: "ContactSheet",

  props: {
    given: String,
    family: String,
    relationship: String,
    phone: String,
    email: String,
  },

  computed: {
    backgroundColorSheet() {
      return "grey lighten-5";
    },
  },
};
</script>

<style scoped></style>
