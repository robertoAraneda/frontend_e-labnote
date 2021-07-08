<template>
  <v-snackbar
    app
    v-bind="$attrs"
    v-on="$listeners"
    color="white"
    v-model="active"
    :timeout="timeout"
    transition="scale-transition"
    :content-class="setClass"
  >
    <div class="d-flex justtify-content-between">
      <v-icon size="30" :color="setColor" dark>{{ setIcon }}</v-icon>
      <v-spacer />
      <span class="ml-3 mr-10 mt-1 black--text text-subtitle-1">{{
        setMessage
      }}</span>
      <v-spacer />
      <v-btn icon @click="active = false">
        <v-icon :color="setColor">mdi-close</v-icon>
      </v-btn>
    </div>
  </v-snackbar>
</template>

<script>
import { SnackbarMessages } from "../../helpers/SnackbarMessages";

export default {
  name: "BaseSnackbar",

  inheritAttrs: false,

  props: {
    value: Boolean,
    type: String,
  },

  data: () => ({
    timeout: 3000,
  }),

  computed: {
    active: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },

    setMessage() {
      switch (this.type) {
        case "success":
          return SnackbarMessages.SUCCESS;
        case "warning":
          return "warning";
        case "error":
          return SnackbarMessages.ERROR;
        default:
          return "primary";
      }
    },

    setColor() {
      switch (this.type) {
        case "success":
          return "success";
        case "warning":
          return "warning";
        case "error":
          return "error";
        default:
          return "primary";
      }
    },
    setClass() {
      switch (this.type) {
        case "success":
          return "success_";
        case "warning":
          return "warning_";
        case "error":
          return "error_";
        default:
          return "primary";
      }
    },
    setIcon() {
      switch (this.type) {
        case "success":
          return "mdi-check-circle";
        case "warning":
          return "mdi-alert-circle";
        case "error":
          return "mdi-alert";
        default:
          return "";
      }
    },
  },
};
</script>

<style scoped>
.v-application--is-ltr .v-snack__action {
  margin-right: 0;
}

.success_ {
  border-radius: 5px;
  border-left: 10px;
  border-left-color: #4caf50;
  border-left-style: solid;
  /* background-color: white; */
}

.error_ {
  border-radius: 5px;
  border-left: 10px;
  border-left-color: #ff5252;
  border-left-style: solid;
  /* background-color: white; */
}

.info_ {
  border-radius: 5px;
  border-left: 10px;
  border-left-color: #2196f3;
  border-left-style: solid;
  /* background-color: white; */
}

.warning_ {
  border-radius: 5px;
  border-left: 10px;
  border-left-color: #fb8c00; /*#ffc107;*/
  border-left-style: solid;
  /* background-color: white; */
}
</style>
