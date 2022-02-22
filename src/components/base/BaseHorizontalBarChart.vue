<template>
  <figure>
    <figcaption class="font-weight-bold text-center mb-6">
      {{ title }}
    </figcaption>
    <HorizontalBarChart
      v-if="render"
      :style="classHeight"
      :chart-data="chartData"
      :options="options"
    ></HorizontalBarChart>
  </figure>
</template>

<script>
import HorizontalBarChart from "../../charts/HorizontalBarChart";
export default {
  name: "BaseHorizontalBarChart",

  components: {
    HorizontalBarChart,
  },

  data: () => ({}),
  props: {
    render: Boolean,
    height: Number,
    chartData: Object,
    options: Object,
    title: {
      type: String,
      default: () => "Title",
    },
  },
  computed: {
    classHeight() {
      return `height: ${this.height}px;`;
    },
  },
  methods: {},
};
</script>

<style scoped></style>
