<template>
  <figure>
    <figcaption class="font-weight-bold text-center mb-6">
      {{ title }}
    </figcaption>
    <LineChart
      v-if="render"
      :style="classHeight"
      :chart-data="chartData"
      :options="options"
    ></LineChart>
  </figure>
</template>

<script>
import LineChart from "../../charts/LineChart";
export default {
  name: "BaseLineChart",

  components: {
    LineChart,
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
