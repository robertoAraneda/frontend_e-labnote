<template>
  <v-dialog
    max-width="500px"
    v-bind="$attrs"
    v-on="$listeners"
    v-model="dialogDelete"
    persistent
  >
    <v-card>
      <v-card-title class="text-h6"
        >¿Está seguro que desea eliminar este registro?</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <BaseCancelButton @click="closeDelete" label="Cancelar" />
        <BaseAcceptButton @click="deleteItemConfirm" label="Aceptar" />
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "BaseConfirmDelete",
  props: {
    dialogDelete: Boolean,
  },
  methods: {
    closeDelete() {
      this.$emit("closeDelete");
    },
    deleteItemConfirm() {
      this.$emit("deleteItemConfirm");
    },
  },
};
</script>

<style scoped></style>
