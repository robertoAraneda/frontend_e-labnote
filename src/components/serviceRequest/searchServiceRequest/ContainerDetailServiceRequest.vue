<template>
  <v-card color="grey lighten-5" elevation="0">
    <v-card-text>
      <v-subheader class="subtitle-1 text-uppercase font-weight-medium">
        {{ title }}
      </v-subheader>
      <v-divider class="mb-3 primary"></v-divider>
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
