export const advancedSettings = [
  {
    path: "",
    name: "advancedSettings",
    component: () =>
      import(
        /* webpackChunkName: "roles" */ "../views/advancedSettings/BaseIndex.vue"
      ),
  },

  {
    path: "permisos",
    name: "permissions",
    component: () =>
      import(
        /* webpackChunkName: "permissions" */ "../views/advancedSettings/Permission.vue"
      ),
  },
  {
    path: "laboratorios",
    name: "laboratories",
    component: () =>
      import(
        /* webpackChunkName: "laboratories" */ "../views/advancedSettings/Laboratory.vue"
      ),
  },
  {
    path: "modulos",
    name: "modules",
    component: () =>
      import(
        /* webpackChunkName: "modules" */ "../views/advancedSettings/Module.vue"
      ),
  },
  {
    path: "menus",
    name: "menus",
    component: () =>
      import(
        /* webpackChunkName: "menus" */ "../views/advancedSettings/Menu.vue"
      ),
  },
  {
    path: "regiones",
    name: "states",
    component: () =>
      import(
        /* webpackChunkName: "cities" */ "../views/advancedSettings/State.vue"
      ),
  },
  {
    path: "comunas",
    name: "cities",
    component: () =>
      import(
        /* webpackChunkName: "cities" */ "../views/advancedSettings/City.vue"
      ),
  },
  {
    path: "generos",
    name: "administrativeGenders",
    component: () =>
      import(
        /* webpackChunkName: "administrativeGenders" */ "../views/advancedSettings/AdministrativeGender.vue"
      ),
  },
  {
    path: "tipos-de-ubicacion-fisica",
    name: "locationPhysicalTypes",
    component: () =>
      import(
        /* webpackChunkName: "locationPhysicalTypes" */ "../views/advancedSettings/LocationPhysicalType.vue"
      ),
  },
  {
    path: "estados-de-ubicacion",
    name: "locationStatuses",
    component: () =>
      import(
        /* webpackChunkName: "locationStatuses" */ "../views/advancedSettings/LocationStatus.vue"
      ),
  },
  {
    path: "tipos-de-ubicacion",
    name: "locationTypes",
    component: () =>
      import(
        /* webpackChunkName: "locationTypes" */ "../views/advancedSettings/LocationType.vue"
      ),
  },
  {
    path: "categorias-de-solicitud-de-examen",
    name: "serviceRequestCategories",
    component: () =>
      import(
        /* webpackChunkName: "serviceRequestCategories" */ "../views/advancedSettings/ServiceRequestCategory.vue"
      ),
  },
  {
    path: "intenciones-de-examen",
    name: "serviceRequestIntents",
    component: () =>
      import(
        /* webpackChunkName: "serviceRequestIntents" */ "../views/advancedSettings/ServiceRequestIntent.vue"
      ),
  },
  {
    path: "prioridades-de-examen",
    name: "serviceRequestPriorities",
    component: () =>
      import(
        /* webpackChunkName: "serviceRequestPriorities" */ "../views/advancedSettings/ServiceRequestPriority.vue"
      ),
  },
  {
    path: "estados-de-examen",
    name: "serviceRequestStatuses",
    component: () =>
      import(
        /* webpackChunkName: "serviceRequestStatuses" */ "../views/advancedSettings/ServiceRequestStatus.vue"
      ),
  },
];
