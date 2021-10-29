export const samplings = [
  {
    path: "",
    name: "sampling",
    component: () =>
      import(
        /* webpackChunkName: "BaseIndexSampling" */ "../views/sampling/BaseIndex.vue"
      ),
  },
  {
    path: "recepcion-paciente",
    name: "samplingRoomReception",
    component: () =>
      import(
        /* webpackChunkName: "SamplingRoomReception" */ "../views/sampling/SamplingRoomReception.vue"
      ),
  },
];
