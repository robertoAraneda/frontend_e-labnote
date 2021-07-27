export const serviceRequest = [
  {
    path: "",
    name: "serviceRequest",
    component: () =>
      import(
        /* webpackChunkName: "roles" */ "../views/serviceRequest/BaseIndex.vue"
      ),
  },
  {
    path: "admitir-paciente",
    name: "admitPatient",
    component: () =>
      import(
        /* webpackChunkName: "roles" */ "../views/serviceRequest/AdmitPatient.vue"
      ),
  },
];
