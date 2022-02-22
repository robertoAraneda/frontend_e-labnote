<template>
  <div>
    <BaseHeaderModule
      title="Módulo de solicitud de medios."
      subtitle="En éste módulo podrás gestionar pacientes y sus solicitudes de exámenes."
    />
    <v-sheet rounded class="pa-3">
      <v-row class="justify-space-between">
        <v-col cols="auto">
          <v-subheader class="headline font-weight-medium"
            >Estadísticas {{ formatCurrentDate }}</v-subheader
          >
        </v-col>

        <v-col cols="4">
          <v-select
            v-model="selectChart"
            dense
            outlined
            rounded
            :items="['DIARIA', 'MENSUAL']"
          ></v-select>
        </v-col>
      </v-row>

      <div class="my-6"></div>
      <v-row>
        <v-col cols="4">
          <BaseCardStat
            color="red"
            icon="mdi-test-tube"
            :title="'Total solicitudes'"
            :value="'' + amountServiceRequestByDay"
          />
        </v-col>
        <v-col cols="4">
          <BaseCardStat
            color="red"
            icon="mdi-account-arrow-right"
            :title="'Total exámenes solicitados'"
            :value="'' + amountObservationByDay"
          />
        </v-col>
        <v-col cols="4"> </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-sheet
            height="250"
            v-if="!renderChartByDay"
            rounded
            elevation="3"
            class="pa-3 text-center"
          >
            <v-progress-circular
              :width="3"
              color="red"
              indeterminate
            ></v-progress-circular
          ></v-sheet>
          <v-sheet v-else rounded elevation="3" class="pa-3">
            <BaseLineChart
              :height="250"
              title="Solicitudes de exámenes creadas."
              :chart-data="chartData"
              :options="options"
              :render="renderChartByDay"
            />
          </v-sheet>
        </v-col>
        <v-col cols="6">
          <v-sheet rounded elevation="3" class="pa-3">
            <BaseHorizontalBarChart
              :height="250"
              title="Distribución de tipo examen solicitado."
              :chart-data="chartDataBar"
              :options="optionsBar"
              :render="renderChartByDayBar"
            />
          </v-sheet>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BaseCardStat from "../../components/base/BaseCardStat";
import BaseLineChart from "../../components/base/BaseLineChart";
import moment from "moment";
import BaseHorizontalBarChart from "../../components/base/BaseHorizontalBarChart";

export default {
  name: "BaseIndex",

  data: () => ({
    serviceRequestLineChartByDay: "",
    chartData: {},
    options: null,
    chartDataBar: {},
    optionsBar: null,
    renderChartByDay: "",
    renderChartByDayBar: "",
    amountServiceRequestByDay: 0,
    amountObservationByDay: 0,
    selectChart: "DIARIA",
    formatCurrentDate: "",
  }),

  components: { BaseHorizontalBarChart, BaseLineChart, BaseCardStat },

  async mounted() {
    this.formatCurrentDate = moment().format("DD-MM-YYYY");
    await this.handleGetServiceRequestByDateByDate();

    //await this.handleGetServiceRequestByDateByMonth();
    // await this.handleGetObservationByMonth();
    await this.handleGetObservationByDate();
  },

  watch: {
    async selectChart() {
      if (this.selectChart === "DIARIA") {
        await this.handleGetServiceRequestByDateByDate();
        await this.handleGetObservationByDate();
      } else {
        await this.handleGetServiceRequestByDateByMonth();
        await this.handleGetObservationByMonth();
      }
    },
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
      getServiceRequestLineChartByDay: "serviceRequest/getDataDayLineChart",
      getServiceRequestLineChartByMonth: "serviceRequest/getDataMonthLineChart",
      getObservationCountByDay: "serviceRequest/getObservationLCountByDay",
      getObservationCountByMonth: "serviceRequest/getObservationCountByMonth",
    }),

    async handleGetServiceRequestByDateByMonth() {
      try {
        // this.renderChartByDay = false;
        const { dataSet, quantity } =
          await this.getServiceRequestLineChartByMonth(
            moment().format("YYYY-MM-DD")
          );

        this.amountServiceRequestByDay = quantity;

        this.chartData = {
          datasets: [
            {
              data: dataSet,
              label: "Solicitudes creadas",
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
          locale: "es",
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { right: 10 } },
          scales: {
            yAxes: [
              {
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: "N° de solicitudes creadas",
                },
                ticks: {
                  display: true,
                  beginAtZero: false,
                  min: 0,
                  max: 30,
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
                  unit: "day",
                  parser: "D",
                  displayFormats: {
                    day: "D",
                  },
                },
                gridLines: {
                  display: false,
                  drawBorder: true,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Día del mes",
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

    async handleGetServiceRequestByDateByDate() {
      try {
        //  this.renderChartByDay = false;
        const { dataSet, quantity } =
          await this.getServiceRequestLineChartByDay(
            moment().format("YYYY-MM-DD")
          );

        this.amountServiceRequestByDay = quantity;

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
                  labelString: "N° de solicitudes creadas",
                },
                ticks: {
                  display: true,
                  beginAtZero: false,
                  min: 0,
                  max: 30,
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
                  labelString: "Hora",
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

    async handleGetObservationByDate() {
      try {
        //  this.renderChartByDay = false;
        const { dataSet, quantity } = await this.getObservationCountByDay(
          moment().format("YYYY-MM-DD")
        );

        this.amountObservationByDay = quantity;

        const labels = dataSet.map((data) => data.name);
        const data = dataSet.map((data) => data.count);

        this.chartDataBar = {
          datasets: [
            {
              data: data,
              backgroundColor: "#3c8dbc",
            },
          ],
          labels: labels,
        };

        this.optionsBar = {
          tooltips: {
            mode: "label",
            callbacks: {
              // We'll edit the `title` string
              title: function (tooltipItem) {
                // `tooltipItem` is an object containing properties such as
                // the dataset and the index of the current item

                // Here, `this` is the char instance

                // The following returns the full string
                return this._data.labels[tooltipItem[0].index];
              },
            },
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: "Cantidad",
                },
                ticks: {
                  begintAtZero: true,
                },
              },
            ],
            yAxes: [
              {
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: "Examen",
                },
                ticks: {
                  callback: function (tick) {
                    var characterLimit = 30;
                    if (tick.length >= characterLimit) {
                      return (
                        tick
                          .slice(0, tick.length)
                          .substring(0, characterLimit - 1)
                          .trim() + "..."
                      );
                    }
                    return tick;
                  },
                },
              },
            ],
          },
          legend: {
            display: false,
            position: "bottom",
          },
        };

        this.renderChartByDay = true;
      } catch (error) {
        console.log(error);
      }
    },

    async handleGetObservationByMonth() {
      try {
        // this.renderChartByDay = false;
        const { dataSet, quantity } = await this.getObservationCountByMonth(
          moment().format("YYYY-MM-DD")
        );

        this.amountObservationByDay = quantity;

        const labels = dataSet.map((data) => data.name);
        const data = dataSet.map((data) => data.count);

        this.chartDataBar = {
          datasets: [
            {
              data: data,
              backgroundColor: "#3c8dbc",
            },
          ],
          labels: labels,
        };

        this.optionsBar = {
          tooltips: {
            mode: "label",
            callbacks: {
              // We'll edit the `title` string
              title: function (tooltipItem) {
                // `tooltipItem` is an object containing properties such as
                // the dataset and the index of the current item

                // Here, `this` is the char instance

                // The following returns the full string
                return this._data.labels[tooltipItem[0].index];
              },
            },
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: "Número de selecciones",
                },
                ticks: {
                  begintAtZero: true,
                },
              },
            ],
            yAxes: [
              {
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: "Examen",
                },
                ticks: {
                  callback: function (tick) {
                    var characterLimit = 30;
                    if (tick.length >= characterLimit) {
                      return (
                        tick
                          .slice(0, tick.length)
                          .substring(0, characterLimit - 1)
                          .trim() + "..."
                      );
                    }
                    return tick;
                  },
                },
              },
            ],
          },
          legend: {
            display: false,
            position: "bottom",
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
