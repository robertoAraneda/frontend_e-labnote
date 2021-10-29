export const settings = [
  {
    path: "",
    name: "settings",
    component: () =>
      import(/* webpackChunkName: "base" */ "../views/settings/BaseIndex.vue"),
  },
  {
    path: "prestaciones",
    name: "serviceRequestObservationCode",
    component: () =>
      import(
        /* webpackChunkName: "base" */ "../views/settings/ServiceRequestObservationCode.vue"
      ),
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
    path: "tipos-de-disponibilidad",
    name: "availabilities",
    component: () =>
      import(
        /* webpackChunkName: "availabilities" */ "../views/settings/Availability.vue"
      ),
  },
  {
    path: "tipos-de-tiempo-de-proceso",
    name: "processTimes",
    component: () =>
      import(
        /* webpackChunkName: "processTimes" */ "../views/settings/ProcessTime.vue"
      ),
  },
  {
    path: "tipos-de-tiempo-de-respuesta",
    name: "responseTimes",
    component: () =>
      import(
        /* webpackChunkName: "responseTimes" */ "../views/settings/ResponseTime.vue"
      ),
  },
  {
    path: "tipos-de-solicitud-medica",
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
  {
    path: "tipos-de-condicion-de-toma-de-muestra",
    name: "samplingConditions",
    component: () =>
      import(
        /* webpackChunkName: "samplingConditions" */ "../views/settings/SamplingCondition.vue"
      ),
  },
  {
    path: "toma-de-muestra",
    name: "specimens",
    component: () =>
      import(
        /* webpackChunkName: "specimens" */ "../views/settings/SpecimenCode.vue"
      ),
  },
  {
    path: "tipos-de-contenedor",
    name: "containers",
    component: () =>
      import(
        /* webpackChunkName: "containers" */ "../views/settings/Container.vue"
      ),
  },
  {
    path: "bloques",
    name: "slots",
    component: () =>
      import(
        /* webpackChunkName: "slots" */ "../views/settings/AppointmentSlot.vue"
      ),
  },
];
