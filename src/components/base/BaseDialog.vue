<template>
  <v-dialog
    :max-width="maxWidth"
    v-bind="$attrs"
    v-on="$listeners"
    v-model="dialog"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <slot name="body"></slot>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <BaseCancelButton label="Cancelar" @click="close" />
        <BaseAcceptButton label="Guardar" @click="save" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "BaseDialog",
  props: {
    formTitle: String,
    dialog: Boolean,
    maxWidth: {
      type: String,
      default: () => "500px",
    },
  },
  data: () => ({}),
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      this.$emit("save");
    },
  },
};
</script>

<style scoped></style>
