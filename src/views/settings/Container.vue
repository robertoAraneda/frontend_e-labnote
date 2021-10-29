<template>
  <v-container>
    <BaseHeaderModule
      title="Módulo de contenedor"
      subtitle="En este módulo podrás gestionar los contenedores."
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
    >
      <template slot="searchButton">
        <BaseAcceptButton
          small
          @click="openDialog"
          label="Crear nuevo contenedor"
          v-if="canCreate"
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
          v-model="editedItem.shortname"
          label="Abreviatura"
          @input="$v.editedItem.shortname.$touch()"
          @blur="$v.editedItem.shortname.$touch()"
          :error-messages="shortnameErrors"
        />
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="editedItem.color"
              @input="$v.editedItem.color.$touch()"
              @blur="$v.editedItem.color.$touch()"
              label="Color"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-color-picker
            v-model="color"
            hide-canvas
            hide-sliders
            mode="hexa"
            hide-mode-switch
            dot-size="25"
            elevation="5"
            show-swatches
            @input="menu = false"
          >
          </v-color-picker>
        </v-menu>
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
      @closeDelete="closeDeleteDialog"
      @deleteItemConfirm="deleteItemConfirm()"
      :dialog-delete="dialogDelete"
    />
  </v-container>
</template>

<script>
import { ContainerHeaders } from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { findIndex } from "../../helpers/Functions";
import Container from "../../models/Container";

export default {
  name: "Container",

  mixins: [validationMixin],

  validations: {
    editedItem: {
      name: { required },
      shortname: { required },
      color: { required },
      active: { required },
    },
  },

  data: () => ({
    color: "",
    menu: false,
    dialog: false,
    editedItem: new Container(),
    editedIndex: -1,
    defaultItem: new Container(),
    snackbar: false,
    headers: ContainerHeaders,
    dialogDelete: false,
    type: SnackbarType.SUCCESS,
  }),

  async mounted() {
    await this.index();
  },

  watch: {
    color(value) {
      console.log(value);
      this.editedItem.color = value;
    },
  },
  computed: {
    ...mapGetters({
      containers: "container/containers",
      namedPermissions: "auth/namedPermissions",
    }),

    items() {
      if (!this.containers) return [];
      return this.containers.collection;
    },

    formTitle() {
      return this.editedIndex === -1 ? "Crear contenedor" : "Editar contenedor";
    },

    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },
    shortnameErrors() {
      const errors = [];
      if (!this.$v.editedItem.shortname.$dirty) return errors;
      !this.$v.editedItem.shortname.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    canCreate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("container.create");
    },

    canUpdate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("container.update");
    },

    canDelete() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("container.delete");
    },

    canShow() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("container.show");
    },
  },

  methods: {
    ...mapActions({
      index: "container/getItems",
      indexPaginate: "container/getPaginatedItems",
      store: "container/postItem",
      update: "container/putItem",
      delete: "container/deleteItem",
      show: "container/showItem",
      changeStatus: "container/changeStatusItem",
    }),

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

    openDialog() {
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
