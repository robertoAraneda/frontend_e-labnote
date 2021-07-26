export const settings = [
  {
    path: "",
    name: "settings",
    component: () =>
      import(/* webpackChunkName: "base" */ "../views/settings/BaseIndex.vue"),
  },
  {
    path: "examenes",
    component: () =>
      import(
        /* webpackChunkName: "users" */ "../views/settings/observationServiceRequest/Index.vue"
      ),
    children: [
      {
        path: "",
        name: "observationServiceRequests",
        component: () =>
          import(
            /* webpackChunkName: "users" */ "../views/settings/observationServiceRequest/List.vue"
          ),
      },
      {
        path: "editar/:slug",
        name: "editObservationServiceRequest",
        component: () =>
          import(
            /* webpackChunkName: "edit" */ "../views/settings/observationServiceRequest/Edit.vue"
          ),
      },
      {
        path: "crear",
        name: "createObservationServiceRequest",
        component: () =>
          import(
            /* webpackChunkName: "create" */ "../views/settings/observationServiceRequest/Create.vue"
          ),
      },
    ],
  },
  {
    path: "usuarios",
    name: "users",
    component: () =>
      import(/* webpackChunkName: "users" */ "../views/settings/User.vue"),
  },
  {
    path: "area-de-trabajo",
    name: "workareas",
    component: () =>
      import(
        /* webpackChunkName: "workareas" */ "../views/settings/Workarea.vue"
      ),
  },
  {
    path: "disponibilidad",
    name: "availabilities",
    component: () =>
      import(
        /* webpackChunkName: "availabilities" */ "../views/settings/Availability.vue"
        ),
  },
  {
    path: "tiempo-de-proceso",
    name: "processTimes",
    component: () =>
      import(
        /* webpackChunkName: "processTimes" */ "../views/settings/ProcessTime.vue"
        ),
  },
  {
    path: "tiempo-de-respuesta",
    name: "responseTimes",
    component: () =>
      import(
        /* webpackChunkName: "responseTimes" */ "../views/settings/ResponseTime.vue"
        ),
  },
  {
    path: "tipo-de-solicitud-medica",
    name: "medicalRequestTypes",
    component: () =>
      import(
        /* webpackChunkName: "medicalRequestTypes" */ "../views/settings/MedicalRequestType.vue"
        ),
  },
  {
    path: "cantidad-de-muestra",
      name: "sampleQuantities",
    component: () =>
    import(
      /* webpackChunkName: "sampleQuantities" */ "../views/settings/SampleQuantity.vue"
      ),
  },
];
