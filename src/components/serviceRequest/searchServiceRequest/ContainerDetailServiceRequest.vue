<template>
  <v-card elevation="1">
    <v-card-text>
      <v-subheader class="subtitle-1"> {{ title }} </v-subheader>
      <v-divider class="mb-3"></v-divider>
      <slot name="default" />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ContainerDetailServiceRequest",

  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
