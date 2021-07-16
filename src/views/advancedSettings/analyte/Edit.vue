<template>
  <pre>{{ editedItem }}</pre>
</template>

<script>
import { mapGetters } from "vuex";
import Analyte from "../../../models/Analyte";

export default {
  name: "Edit",

  data: () => ({
    editedItem: new Analyte(),
  }),

  watch: {
    editedAnalyte() {
      this.editedItem = Object.assign({}, this.editedAnalyte);
    },
  },

  computed: {
    ...mapGetters({
      editedAnalyte: "analyte/editAnalyte",
    }),
  },
};
</script>

<style scoped></style>
