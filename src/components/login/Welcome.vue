<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col>
        <v-card color="grey lighten-4" elevation="0" min-height="87vh">
          <v-card-title>
            <span v-text="title"></span>
          </v-card-title>
          <v-card-text>
            <p class="text-h4">e-Labnote</p>
            <p class="text-h2">
              Accede al sistema web para gestionar tus procesos.
            </p>
            <p>{{ text }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    text: String,
    title: String,
  },
};
</script>

<style lang="scss" scoped></style>
