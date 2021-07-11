export const settings = [
  {
    path: "roles",
    name: "roles",
    component: () =>
      import(
        /* webpackChunkName: "roles" */ "../views/pages/settings/Role.vue"
      ),
  },
  {
    path: "permisos",
    name: "permissions",
    component: () =>
      import(
        /* webpackChunkName: "permissions" */ "../views/pages/settings/Permission.vue"
      ),
  },
  {
    path: "usuarios",
    name: "users",
    component: () =>
      import(
        /* webpackChunkName: "users" */ "../views/pages/settings/User.vue"
      ),
  },
  {
    path: "laboratorios",
    name: "laboratories",
    component: () =>
      import(
        /* webpackChunkName: "laboratories" */ "../views/pages/settings/Laboratory.vue"
      ),
  },
  {
    path: "modulos",
    name: "modules",
    component: () =>
      import(
        /* webpackChunkName: "modules" */ "../views/pages/settings/Module.vue"
      ),
  },
  {
    path: "menus",
    name: "menus",
    component: () =>
      import(
        /* webpackChunkName: "menus" */ "../views/pages/settings/Menu.vue"
      ),
  },
];
