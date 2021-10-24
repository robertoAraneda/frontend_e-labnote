<template>
  <section class="overflow-hidden">
    <v-row no-gutters>
      <v-col
        class="
          align-content-space-between
          layout
          wrap
          hidden-sm-and-down
          grey
          lighten-3
        "
        cols="12"
        md="6"
      >
        <v-img
          class="grow hidden-sm-and-down"
          contain
          max-height="200"
          width="100%"
          position="top right"
          :src="bubble1"
          style="transform: rotate(180deg) translateY(25%)"
        />
        <welcome />
        <v-img
          class="grow hidden-sm-and-down"
          contain
          max-height="200"
          width="100%"
          position="bottom left"
          :src="bubble2"
          style="transform: rotate(180deg) translate(-150px, -30%)"
        />
      </v-col>
      <v-col
        class="justify-center align-center white"
        md="6"
        :pa-5="$vuetify.breakpoint.smAndDown"
      >
        <login />
      </v-col>
    </v-row>
  </section>
</template>

<script>
import Welcome from "../../components/login/Welcome.vue";
import Login from "../../components/login/Login.vue";
import bubble1 from "../../assets/bubbles1.png";
import bubble2 from "../../assets/bubbles2.png";

export default {
  components: { Welcome, Login },

  data: () => ({
    bubble1,
    bubble2,
  }),
};
</script>

<style lang="scss" scoped></style>
