export const serviceRequest = [
  {
    path: "",
    name: "serviceRequest",
    component: () =>
      import(
        /* webpackChunkName: "BaseIndex" */ "../views/serviceRequest/BaseIndex.vue"
      ),
  },
  {
    path: "admitir-paciente",
    name: "admitPatient",
    component: () =>
      import(
        /* webpackChunkName: "AdmitPatient" */ "../views/serviceRequest/AdmitPatient.vue"
      ),
  },
  {
    path: "nueva-solicitud",
    name: "createServiceRequest",
    component: () =>
      import(
        /* webpackChunkName: "CreateServiceRequest" */ "../views/serviceRequest/CreateServiceRequest.vue"
      ),
  },
];
