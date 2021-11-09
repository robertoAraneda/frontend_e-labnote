<template>
  <ContainerDetailServiceRequest :title="title">
    <template v-slot:default>
      <v-timeline dense clipped>
        <v-slide-x-transition group>
          <v-timeline-item
            v-for="event in timeline"
            :key="event.id"
            fill-dot
            color="primary darken-1"
            :icon="event.icon"
          >
            <v-row justify="space-between">
              <v-col cols="7" v-html="event.text"></v-col>
              <v-col class="text-right" cols="5" v-html="event.time"></v-col>
            </v-row>
          </v-timeline-item>
        </v-slide-x-transition>
      </v-timeline>
    </template>
  </ContainerDetailServiceRequest>
</template>

<script>
import ContainerDetailServiceRequest from "./ContainerDetailServiceRequest";
export default {
  name: "TraceabilityServiceRequest",

  components: { ContainerDetailServiceRequest },

  props: {
    timeline: Array,
  },

  data: () => ({
    title: "Trazabilidad",
  }),
};
</script>

<style scoped></style>
