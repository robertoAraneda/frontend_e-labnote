<template>
  <v-row align="center" justify="center">
    <v-col cols="10" md="6">
      <h1 class="display-3 mb-3 font-weight-black primary--text">e-Labnote</h1>
      <p class="title font-weight-light" style="line-height: 1.7 !important">
        Accede al sistema web para gestionar tus procesos.
      </p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    text: String,
    title: String,
  },
};
</script>

<style lang="sass" scoped>
.v-heading
  letter-spacing: 3px !important
</style>
