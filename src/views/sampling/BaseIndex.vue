<template>
  <div>
    <BaseHeaderModule
      title="Módulo de toma de muestras."
      subtitle="En éste módulo podrás gestionar la toma de muestra de tus pacientes."
    />

    <v-sheet rounded class="pa-3">
      <v-subheader class="headline font-weight-medium"
        >Estadísticas {{ formatCurrentDate }}</v-subheader
      >
      <div class="my-6"></div>
      <v-row>
        <v-col cols="4">
          <BaseCardStat
            color="red"
            icon="mdi-test-tube"
            :title="'Total muestras tomadas'"
            :value="'' + amountSamplesByDay"
          />
        </v-col>
        <v-col cols="4">
          <BaseCardStat
            color="red"
            icon="mdi-account-arrow-right"
            :title="'Total pacientes atentidos'"
            :value="'' + patientCountByDay"
          />
        </v-col>
        <v-col cols="4">
          <BaseCardStat
            color="red"
            icon="mdi-account-arrow-left"
            :title="'Total pacientes agendados'"
            :value="'' + schedulePatientCountByDay"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-sheet rounded elevation="3" class="pa-3">
            <BaseLineChart
              :height="250"
              title="Distribución temporal de muestras tomadas."
              :chart-data="chartData"
              :options="options"
              :render="renderChartByDay"
            />
          </v-sheet>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BaseLineChart from "../../components/base/BaseLineChart";
import moment from "moment";
import BaseCardStat from "../../components/base/BaseCardStat";

export default {
  name: "BaseIndex",
  components: { BaseCardStat, BaseLineChart },
  data: () => ({
    chartData: {},
    options: null,
    renderChartByDay: false,
    amountSamplesByDay: 0,
    currentDate: "",
    formatCurrentDate: "",
    patientCountByDay: 0,
    schedulePatientCountByDay: 0,
  }),

  async mounted() {
    //await this.getLineChartByDay("2021-12-09");
    await this.handleLineChartByDay();
    await this.handleGetPatientCountByDay();
    await this.handleGetSchedulePatientCountByDay();

    this.currentDate = moment();
    this.formatCurrentDate = this.currentDate.format("DD-MM-YYYY");
  },

  computed: {
    ...mapGetters({
      currentModule: "auth/currentModule",
    }),

    menus() {
      if (!this.currentModule) return [];
      return this.currentModule.map(({ menu }) => menu);
    },
  },
  methods: {
    ...mapActions({
      getModulesByLaboratory: "laboratory/getModulesByLaboratory",
      getLineChartByDay: "specimen/getDataDayLineChart",
      getSchedulePatientCountByDay: "patient/getScheduleCountByDay",
      getPatientCountByDay: "patient/getCountByDay",
    }),

    async handleGetPatientCountByDay() {
      this.patientCountByDay = await this.getPatientCountByDay(
        moment().format("YYYY-MM-DD")
      );
    },

    async handleGetSchedulePatientCountByDay() {
      this.schedulePatientCountByDay = await this.getSchedulePatientCountByDay(
        moment().format("YYYY-MM-DD")
      );
    },

    async handleLineChartByDay() {
      try {
        this.renderChartByDay = false;
        const { dataSet } = await this.getLineChartByDay(
          moment().format("YYYY-MM-DD")
        );

        const array = [...dataSet];

        const redu = function (accumulator, value) {
          return accumulator + value.y;
        };

        this.amountSamplesByDay = array.reduce(redu, 0);

        this.chartData = {
          datasets: [
            {
              data: dataSet,
              label: "Muestras tomadas",
              backgroundColor: "#3c8dbc",
              pointRadius: 1,
              showLine: true,
              fill: false,
              // backgroundColor: lightblue,
              borderColor: "#3c8dbc",
              borderWidth: 2,
              cubicInterpolationMode: "monotone",
              tension: 0.2,
              spanGaps: true,
            },
          ],
        };
        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { right: 10 } },
          scales: {
            yAxes: [
              {
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: "N° de muestras tomadas",
                },
                ticks: {
                  display: true,
                  beginAtZero: false,
                  min: 0,
                  max: 16,
                },
                gridLines: {
                  display: true,
                  drawBorder: true,
                },
              },
            ],
            xAxes: [
              {
                type: "time",
                distribution: "series",
                time: {
                  unit: "hour",
                  parser: "HH",
                  displayFormats: {
                    hour: "HH",
                  },
                },
                gridLines: {
                  display: false,
                  drawBorder: true,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Hora de toma de muestra (24H)",
                },
              },
            ],
          },
        };

        this.renderChartByDay = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  transition: opacity 0.4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.8;
}
</style>
