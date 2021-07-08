export const settings = [
  {
    path: "roles",
    name: "roles",
    component: () =>
      import(
        /* webpackChunkName: "settings" */ "../views/pages/settings/Role.vue"
      ),
  },
  {
    path: "permisos",
    name: "permissions",
    component: () =>
      import(
        /* webpackChunkName: "settings" */ "../views/pages/settings/Permission.vue"
      ),
  },
  {
    path: "usuarios",
    name: "users",
    component: () =>
      import(
        /* webpackChunkName: "settings" */ "../views/pages/settings/User.vue"
      ),
  },
  {
    path: "laboratorios",
    name: "laboratories",
    component: () =>
      import(
        /* webpackChunkName: "settings" */ "../views/pages/settings/Laboratory.vue"
      ),
  },
  {
    path: "modulos",
    name: "modules",
    component: () =>
      import(
        /* webpackChunkName: "settings" */ "../views/pages/settings/Module.vue"
      ),
  },
  {
    path: "menus",
    name: "menus",
    component: () =>
      import(
        /* webpackChunkName: "settings" */ "../views/pages/settings/Menu.vue"
      ),
  },
];
