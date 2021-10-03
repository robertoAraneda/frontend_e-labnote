<template>
  <div>
    <v-row class="mb-10">
      <v-col cols="12">
        <h3 class="text-subtitle-1 black--text">
          En este módulo podrás gestionar los roles.
        </h3>
      </v-col>
    </v-row>

    <BaseDatatable
      @deleteItem="handleDeleteModel($event)"
      @editItem="handleEditModel($event)"
      @customMethod="handlePermissions($event)"
      @changeStatus="handleChangeStatus($event)"
      :items="roles"
      :headers="headers"
      sort-by="id"
      title="Roles"
      :extra-buttons="true"
    >
      <template slot="searchButton">
        <BaseAcceptButton small @click="openDialog" label="Crear nuevo rol" />
      </template>
    </BaseDatatable>

    <BaseDialog
      max-width="700px"
      :dialog="isPermissionShow"
      form-title="Asignar permisos"
      @close="isPermissionShow = false"
      @save="savePermissions"
    >
      <template v-slot:body>
        <v-col cols="12" v-if="isPermissionShow">
          <v-row>
            <v-col
              v-for="module in modulesByLaboratory"
              :key="module.id"
              cols="11"
            >
              <TreeviewPermission
                :permissions="selectedPermissions[module.id]"
                :module="module"
              />
            </v-col>
          </v-row>
        </v-col>
      </template>
    </BaseDialog>
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
import { RoleHeaders } from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import Role from "../../models/Role";
import TreeviewPermission from "../../components/setting/TreeviewPermission";

export default {
  name: "Role",
  components: { TreeviewPermission },
  mixins: [validationMixin],

  validations: {
    editedItem: {
      name: { required },
    },
  },

  data: () => ({
    dialog: false,
    permissionDialog: false,

    selectedPermissions: {},
    isPermissionShow: false,

    editedItem: new Role(),
    editedIndex: -1,
    defaultItem: new Role(),
    snackbar: false,
    timeout: 2000,
    headers: RoleHeaders,
    dialogDelete: false,
    type: "success",
  }),

  mounted() {
    if (!this.modulesByLaboratory.length) {
      this.getModulesByLaboratory(1);
    }
    this.index();
  },

  computed: {
    ...mapGetters({
      roles: "role/roles",
      loggedUser: "auth/user",
      modulesByLaboratory: "laboratory/modulesByLaboratory",
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
      index: "role/getRoles",
      store: "role/postRoles",
      put: "role/putRoles",
      delete: "role/deleteRoles",
      changeStatus: "role/changeStatusRole",
      getModulesByLaboratory: "laboratory/getModulesByLaboratory",
      getPermissionsByModule: "module/getPermissionsByModule",
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
          await this.index();
        }
      }
    },

    //TODO falta guardar los privilegios. Ya estan flateados
    async savePermissions() {
      const flatPermissions = Object.values(this.selectedPermissions).reduce(
        (accumulator, module) => {
          accumulator = [...accumulator, ...module];
          return accumulator;
        },
        []
      );

      console.log(flatPermissions);
    },

    async send() {
      this.selectedPermissions = {};
      await Promise.all(
        this.modulesByLaboratory.map(async (module) => {
          this.selectedPermissions[module.id] = [
            ...(await this.getPermissionsByModule({
              idRol: this.editedItem.id,
              idModule: module.id,
            })),
          ];
        })
      );

      this.isPermissionShow = true;
    },

    async handleChangeStatus(item) {
      try {
        const { status } = await this.changeStatus(item);

        if (status === 200) {
          this.type = SnackbarType.SUCCESS;
        }
      } catch (e) {
        this.type = SnackbarType.ERROR;
      } finally {
        this.dialogDelete = false;
        this.activateSnackbar();
        this.resetForm();
        await this.index();
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
          await this.index();
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

    async handlePermissions(value) {
      this.fillEditedItem(value);
      this.editedIndex = this.roles.indexOf(value);
      await this.send();

      this.permissionDialog = true;
    },
  },
};
</script>

<style scoped></style>
