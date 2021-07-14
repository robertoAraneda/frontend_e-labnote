<template>
  <div>
    <h1>Landing page</h1>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Index",

  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
    }),
  },
};
</script>

<style scoped></style>
