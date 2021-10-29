<template>
  <div class="mt-3">
    <v-subheader
      ><span class="title text-uppercase">{{ subtitle }}</span
      ><v-spacer /> <slot name="leftButton"></slot
    ></v-subheader>
    <v-sheet outlined rounded class="px-3 mx-3" :color="backgroundColorSheet">
      <slot name="body"></slot>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: "ContainerPatientForm",

  props: {
    subtitle: {
      type: String,
      default: () => "",
    },
  },

  computed: {
    backgroundColorSheet() {
      return "grey lighten-5";
    },
  },
};
</script>

<style scoped></style>
