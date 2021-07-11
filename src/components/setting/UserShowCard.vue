<template>
  <v-dialog
    max-width="500px"
    v-bind="$attrs"
    v-on="$listeners"
    v-model="dialog"
    persistent
  >
    <v-card class="mx-auto">
      <v-app-bar flat>
        <v-chip v-if="active" class="ma-2" color="primary">
          <v-icon left> mdi-check </v-icon>
          Activo
        </v-chip>
        <v-chip v-else class="ma-2" color="secondary">
          <v-icon left>mdi-alert-outline</v-icon>
          Inactivo
        </v-chip>

        <v-spacer></v-spacer>

        <v-btn color="black" icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>

      <v-card-title class="grey--text darken-3 pl-12 pt-3">
        <div class="text-h4 pl-6">{{ names }}</div>
        <br />
        <div class="text-h4 pl-6">{{ lastname }} {{ mother_lastname }}</div>
        <br />
        <div class="text-h5 pl-6">{{ rut }}</div>
      </v-card-title>

      <v-card-text>
        <v-list two-line>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo"> mdi-phone </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ phone }}</v-list-item-title>
              <v-list-item-subtitle>Celular</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-icon>
              <v-icon>mdi-message-text</v-icon>
            </v-list-item-icon>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo"> mdi-email </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ email }}</v-list-item-title>
              <v-list-item-subtitle>Trabajo</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <small v-if="created !== ''" class="caption"
          ><strong>Creado por: </strong> {{ created }}</small
        >
        <v-spacer />
        <small v-if="updated !== ''" class="caption"
          ><strong>Actualizado por:</strong> {{ updated }}</small
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "UserShowCard",

  props: {
    dialog: Boolean,
    names: String,
    lastname: String,
    mother_lastname: String,
    rut: String,
    email: String,
    _embedded: Object,
    created_at: String,
    updated_at: String,
    active: Boolean,
    phone: String,
  },

  computed: {
    created() {
      if (this._embedded === undefined) return "";
      if (this._embedded.createdUser === null) return "";
      return `${this._embedded.createdUser.name} (${this.created_at})`;
    },
    updated() {
      if (this._embedded === undefined) return "";
      if (this._embedded.updatedUser === null) return "";
      return `${this._embedded.updatedUser.name} (${this.updated_at})`;
    },
  },

  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped></style>
