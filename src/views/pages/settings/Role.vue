<template>
  <div>
    <v-row class="mb-10">
      <v-col cols="12">
        <h3 class="text-subtitle-1 black--text">
          En este módulo podrás gestionar los roles
        </h3>
      </v-col>
    </v-row>

    <BaseDatatable
      @deleteItem="handleDeleteModel($event)"
      @editItem="handleEditModel($event)"
      @customMethod="handlePermissions($event)"
      :items="roles"
      :headers="headers"
      sort-by="id"
      title="Roles"
      :extra-buttons="true"
    >
      <template slot="top">
        <BaseAcceptButton small @click="openDialog" label="Crear nuevo rol" />
      </template>
    </BaseDatatable>
    <BaseDialog
      :dialog="dialog"
      :form-title="formTitle"
      @close="dialog = false"
      @save="save"
    >
      <template slot="body">
        <BaseTextfield
          v-model="editedItem.name"
          label="Nombre"
          placeholder="Nombre"
          @input="$v.editedItem.name.$touch()"
          @blur="$v.editedItem.name.$touch()"
          :error-messages="nameErrors"
        />
        <BaseTextfield
          v-model="editedItem.guard_name"
          label="Guard"
          placeholder="Nombre del guard"
          disabled
        />
        <v-row justify="center">
          <v-radio-group v-model="editedItem.active" row>
            <v-radio label="Inactivo" :value="false"></v-radio>
            <v-radio label="Activo" :value="true"></v-radio>
          </v-radio-group>
        </v-row>
      </template>
    </BaseDialog>
    <BaseSnackbar v-model="snackbar" :type="type" />
    <BaseConfirmDelete
      @closeDelete="dialogDelete = false"
      @deleteItemConfirm="deleteItemConfirm()"
      :dialog-delete="dialogDelete"
    />
  </div>
</template>

<script>
import { RoleHeaders } from "../../../helpers/headersDatatable";
import {
  SnackbarMessages,
  SnackbarType,
} from "../../../helpers/SnackbarMessages";
import { validationMessage } from "../../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import Role from "../../../models/Role";
import BaseSnackbar from "../../../components/base/BaseSnackbar";

export default {
  name: "Role",
  components: { BaseSnackbar },
  mixins: [validationMixin],

  validations: {
    editedItem: {
      name: { required },
    },
  },

  data: () => ({
    dialog: false,
    editedItem: new Role(),
    editedIndex: -1,
    defaultItem: new Role(),
    snackbar: false,
    text: SnackbarMessages.SUCCESS,
    timeout: 2000,
    headers: RoleHeaders,
    dialogDelete: false,
    type: "success",
  }),

  mounted() {
    this.getRoles();
  },

  computed: {
    ...mapGetters({
      roles: "role/roles",
      loggedUser: "auth/user",
    }),

    formTitle() {
      return this.editedIndex === -1 ? "Crear rol" : "Editar rol";
    },

    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },
  },

  methods: {
    ...mapActions({
      getRoles: "role/getRoles",
      store: "role/postRoles",
      put: "role/putRoles",
      delete: "role/deleteRoles",
    }),

    async save() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          let response;
          if (this.editedIndex === -1) {
            response = await this.store(this.editedItem);
          } else {
            response = await this.put(this.editedItem);
          }

          if (response) {
            this.type = SnackbarType.SUCCESS;
          }
        } catch (e) {
          this.type = SnackbarType.ERROR;
        } finally {
          this.activateSnackbar();
          this.resetForm();
          this.closeDialog();
          await this.getRoles();
        }
      }
    },

    handleDeleteModel(value) {
      this.fillEditedItem(value);
      this.editedIndex = this.roles.indexOf(value);
      this.dialogDelete = true;
    },

    handleEditModel(value) {
      this.fillEditedItem(value);
      this.editedIndex = this.roles.indexOf(value);
      this.openDialog();
    },

    async deleteItemConfirm() {
      if (this.editedIndex !== -1) {
        try {
          const { status } = await this.delete(this.editedItem);

          if (status === 204) {
            this.type = SnackbarType.SUCCESS;
          }
        } catch (e) {
          this.type = SnackbarType.ERROR;
        } finally {
          this.dialogDelete = false;
          this.activateSnackbar();
          this.resetForm();
          await this.getRoles();
        }
      }
    },

    closeDialog() {
      this.dialog = false;
    },

    openDialog() {
      this.$v.$reset();
      this.dialog = true;
    },

    fillEditedItem(value) {
      this.editedItem.id = value.id;
      this.editedItem.name = value.name;
      this.editedItem.guard_name = value.guardName;
      this.editedItem.active = value.active;
    },

    activateSnackbar() {
      this.snackbar = true;
    },

    resetForm() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },

    handlePermissions(value) {
      console.log(value);
    },
  },
};
</script>

<style scoped></style>
