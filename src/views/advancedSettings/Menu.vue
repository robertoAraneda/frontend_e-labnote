<template>
  <div>
    <BaseHeaderModule
      title="Mantenedor base de Menú"
      subtitle="En este módulo podrás gestionar los menus de e-labnote."
    />
    <BaseDatatable
      @deleteItem="handleDeleteModel($event)"
      @editItem="handleEditModel($event)"
      @changeStatus="handleChangeStatus($event)"
      @searchItem="handleShowItem($event)"
      :can-update="canUpdate"
      :can-delete="canDelete"
      :can-show="canShow"
      :items="items"
      :headers="headers"
      sort-by="id"
      title="Menús"
    >
      <template slot="searchButton">
        <BaseAcceptButton
          @click="openDialog"
          label="Crear nuevo menú"
          v-if="canCreate"
        />
      </template>
      <template slot="select">
        <BaseAutocomplete
          v-model="selectedModule"
          placeholder="Seleccione:"
          :items="modules"
          item-value="id"
          item-text="name"
          label="Módulos"
          single-line
          hide-details
          @remove="remove"
        />
      </template>
    </BaseDatatable>
    <BaseDialog
      :dialog="dialog"
      :form-title="formTitle"
      @close="closeDialog"
      @save="save"
    >
      <template slot="body">
        <BaseTextfield
          v-model="editedItem.name"
          label="Nombre"
          @input="$v.editedItem.name.$touch()"
          @blur="$v.editedItem.name.$touch()"
          :error-messages="nameErrors"
        />
        <BaseTextfield
          v-model="editedItem.url"
          label="Vue URL"
          @input="$v.editedItem.url.$touch()"
          @blur="$v.editedItem.url.$touch()"
          :error-messages="urlErrors"
        />
        <BaseTextfield
          v-model="editedItem.icon"
          label="Icono"
          @input="$v.editedItem.icon.$touch()"
          @blur="$v.editedItem.icon.$touch()"
          :error-messages="iconErrors"
        />
        <BaseAutocomplete
          v-model="editedItem.permission_id"
          placeholder="Seleccione:"
          :items="permissions"
          item-value="id"
          item-text="name"
          label="Permiso inicial"
          @input="$v.editedItem.permission_id.$touch()"
          @blur="$v.editedItem.permission_id.$touch()"
          :error-messages="permissionErrors"
        />
        <BaseAutocomplete
          placeholder="Seleccione:"
          v-model="editedItem.module_id"
          :items="modules"
          item-value="id"
          item-text="name"
          label="Módulo"
          @input="$v.editedItem.module_id.$touch()"
          @blur="$v.editedItem.module_id.$touch()"
          :error-messages="moduleErrors"
        />
        <v-radio-group v-model="editedItem.active" row>
          <template v-slot:label>
            <div class="black--text text-subtitle-1">Estado:</div>
          </template>
          <v-spacer />
          <v-radio label="Inactivo" :value="false"></v-radio>
          <v-radio label="Activo" :value="true"></v-radio>
        </v-radio-group>
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
import { MenuHeaders } from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { findIndex } from "../../helpers/Functions";
import { mask } from "vue-the-mask";
import Menu from "../../models/Menu";

export default {
  name: "Menu",

  directives: {
    mask,
  },

  mixins: [validationMixin],

  validations: {
    editedItem: {
      name: { required },
      icon: { required },
      permission_id: { required },
      module_id: { required },
      url: { required },
      active: { required },
    },
  },

  data: () => ({
    dialog: false,
    editedItem: new Menu(),
    editedIndex: -1,
    defaultItem: new Menu(),
    snackbar: false,
    timeout: 2000,
    headers: MenuHeaders,
    dialogDelete: false,
    type: "success",
    permissions: [],
    modules: [],
    selectedModule: null,
  }),

  async mounted() {
    await this.index();
    await this.handleSelectForm();
  },

  computed: {
    ...mapGetters({
      menus: "menus/menus",
      loggedUser: "auth/user",
      currentModule: "module/currentModule",
      namedPermissions: "auth/namedPermissions",
      _modules: "module/modules",
      _permissions: "permission/permissions",
    }),

    items() {
      if (!this.menus) return [];
      if (!this.selectedModule) return this.menus.collection;
      return this.menus.collection.filter(
        (menu) => menu.module.id === this.selectedModule
      );
    },

    formTitle() {
      return this.editedIndex === -1 ? "Crear menú" : "Editar menú";
    },

    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    urlErrors() {
      const errors = [];
      if (!this.$v.editedItem.url.$dirty) return errors;
      !this.$v.editedItem.url.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    iconErrors() {
      const errors = [];
      if (!this.$v.editedItem.icon.$dirty) return errors;
      !this.$v.editedItem.icon.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    permissionErrors() {
      const errors = [];
      if (!this.$v.editedItem.permission_id.$dirty) return errors;
      !this.$v.editedItem.permission_id.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    moduleErrors() {
      const errors = [];
      if (!this.$v.editedItem.module_id.$dirty) return errors;
      !this.$v.editedItem.module_id.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    canCreate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("menu.create");
    },

    canUpdate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("menu.update");
    },

    canDelete() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("menu.delete");
    },

    canShow() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("menu.show");
    },
  },

  methods: {
    ...mapActions({
      index: "menus/getItems",
      indexPaginate: "menus/getPaginatedItems",
      store: "menus/postItem",
      update: "menus/putItem",
      delete: "menus/deleteItem",
      show: "menus/showItem",
      changeStatus: "menus/changeStatusItem",
      getPermissionsByModule: "permission/getPermissionsByModule",
      getModules: "module/getItems",
      getPermissions: "permission/getItems",
    }),

    remove() {
      this.selectedModule = null;
    },

    async save() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          let response;

          if (this.editedIndex === -1) {
            response = await this.store(this.editedItem);
          } else {
            response = await this.update(this.editedItem);
          }

          if (response) {
            this.type = SnackbarType.SUCCESS;
          }
        } catch (e) {
          this.type = SnackbarType.ERROR;
          console.log(e);
        } finally {
          this.activateSnackbar();
          this.closeDialog();
          await this.index();
        }
      }
    },

    async handleChangeStatus(item) {
      try {
        const { status } = await this.changeStatus(item);

        if (status === 200) {
          this.type = SnackbarType.SUCCESS;
        }
      } catch (e) {
        this.type = SnackbarType.ERROR;
        console.log(e);
      } finally {
        this.activateSnackbar();
        this.resetForm();
        await this.index();
      }
    },

    async handleSelectForm() {
      await this.getModules();
      await this.getPermissions();

      this.permissions = this._permissions.collection.filter(
        (permission) => permission.action === "index"
      );
      this.modules = this._modules.collection;
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
          console.log(e);
        } finally {
          this.activateSnackbar();
          this.closeDeleteDialog();
          await this.index();
        }
      }
    },

    async handleShowItem(item) {
      try {
        await this.fillEditedItem(item);
      } catch (e) {
        this.type = SnackbarType.ERROR;
        this.activateSnackbar();
        console.log(e);
      }
    },

    handleDeleteModel(value) {
      this.fillEditedItem(value);
      this.editedIndex = findIndex(value, this.items);
      this.dialogDelete = true;
    },

    handleEditModel(value) {
      this.fillEditedItem(value);
      this.editedIndex = findIndex(value, this.items);
      this.openDialog();
    },

    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },

    async openDialog() {
      this.$v.$reset();

      this.dialog = true;
    },

    closeDeleteDialog() {
      this.dialogDelete = false;
      this.resetForm();
    },

    async fillEditedItem(item) {
      const { status, data } = await this.show(item._links.self.href);

      if (status === 200) {
        this.editedItem = Object.assign({}, data);
        console.log(data);
      } else if (status === 403) {
        this.type = SnackbarType.FORBIDDEN;
        this.activateSnackbar();
      } else {
        this.type = SnackbarType.ERROR;
        this.activateSnackbar();
      }
    },

    activateSnackbar() {
      this.snackbar = true;
    },

    resetForm() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
  },
};
</script>

<style scoped></style>
