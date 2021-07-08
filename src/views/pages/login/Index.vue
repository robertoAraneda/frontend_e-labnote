<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6" class="grey lighten-4" style="height: 100%"
        ><welcome
      /></v-col>
      <v-col cols="6"><login /></v-col>
    </v-row>
  </v-container>
</template>

<script>
import Welcome from "../../../components/login/Welcome.vue";
import Login from "../../../components/login/Login.vue";
export default {
  components: { Welcome, Login },
};
</script>

<style lang="scss" scoped></style>
