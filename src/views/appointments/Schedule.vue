<template>
  <div>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Hoy
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small> mdi-chevron-right </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right> mdi-menu-down </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'category'">
                  <v-list-item-title>Categoría</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Día</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Semana</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Mes</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 días</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @click:time="viewDay"
            @change="updateEvent"
            :event-overlap-threshold="30"
            category-show-all
            :categories="categories"
            locale="es"
            interval-height="120"
            :weekdays="weekdays"
            :short-weekdays="false"
            :short-intervals="false"
            first-interval="8"
            interval-count="10"
          >
            <template v-slot:day-body="{ date, week }">
              <div
                class="v-current-time"
                :class="{ first: date === week[0].date }"
                :style="{ top: nowY }"
              ></div>
            </template>
          </v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <v-dialog max-width="750" v-model="drawer">
            <v-card>
              <v-card elevation="0">
                <v-tabs grow v-model="tabs" slider-color="white">
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab href="#mobile-tabs-5-1">
                    POR NÚMERO DE IDENTIFICACIÓN
                  </v-tab>

                  <v-tab href="#mobile-tabs-5-2">
                    POR DATOS DEMOGRÁFICOS
                  </v-tab>
                </v-tabs>

                <v-tabs-items v-model="tabs">
                  <v-tab-item value="mobile-tabs-5-1">
                    <v-card flat>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" sm="4">
                            <BaseSelect
                              :items="identifierTypes"
                              item-text="display"
                              item-value="id"
                              label="Tipo documento"
                            />
                          </v-col>
                          <v-col cols="12" sm="4">
                            <BaseTextfield
                              v-model="editedItem.father_family"
                              label="Primer apellido"
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <base-accept-button
                              label="Buscar"
                              class="float-right mb-3"
                              @click="findPatientByNames(editedItem)"
                            ></base-accept-button>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item value="mobile-tabs-5-2">
                    <v-card flat>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" sm="4">
                            <BaseTextfield
                              v-model="editedItem.given"
                              label="Nombres"
                            />
                          </v-col>
                          <v-col cols="12" sm="4">
                            <BaseTextfield
                              v-model="editedItem.father_family"
                              label="Primer apellido"
                            />
                          </v-col>
                          <v-col cols="12" sm="4">
                            <BaseTextfield
                              v-model="editedItem.mother_family"
                              label="Segundo apellido"
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <base-accept-button
                              label="Buscar"
                              class="float-right mb-3"
                              @click="findPatientByNames(editedItem)"
                            ></base-accept-button>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
              </v-card>
              <v-data-table
                v-if="patients.length !== 0 && !selectedPatient"
                :headers="headers"
                :items="patients"
                class="elevation-0 mt-3"
                hide-default-footer
              >
                <template v-slot:item.options="{ item }">
                  <base-accept-button
                    @click="handleSelectedPatient(item)"
                    small
                    label="Seleccionar"
                    class="float-right"
                  ></base-accept-button>
                </template>
              </v-data-table>
            </v-card>
          </v-dialog>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "schedule",

  data: () => ({
    tabs: null,
    editedItem: {
      given: "",
      father_family: "araneda",
      mother_family: "",
    },

    selectedPatient: null,

    headers: [
      {
        text: "N° Documento",
        value: "identifier[0].value",
        sortable: true,
      },
      {
        text: "Nombre",
        value: "name[0].given",
        sortable: true,
      },
      {
        text: "Primer apellido",
        value: "name[0].father_family",
        sortable: true,
      },
      {
        text: "Segundo apellido",
        value: "name[0].mother_family",
        sortable: true,
      },
      {
        text: "",
        value: "options",
      },
    ],
    drawer: false,
    focus: "",
    type: "day",
    typeToLabel: {
      category: "Categoría",
      month: "Mes",
      week: "Semana",
      day: "Día",
      "4day": "4 Días",
    },
    weekdays: [1, 2, 3, 4, 5],
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    categories: ["TOMA MUESTRA 1"],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party",
    ],
    ready: false,
  }),
  mounted() {
    this.$refs.calendar.checkChange();
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
    this.getIdentifierTypes();
  },

  watch: {},

  computed: {
    ...mapGetters({
      patients: "patient/patients",
      identifierTypes: "patient/identifierTypes",
    }),
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
  },

  methods: {
    ...mapActions({
      findPatientByNames: "patient/findPatientByNames",
      getIdentifierTypes: "patient/getIdentifierTypes",
      findPatientByIdentifier: "patient/findPatientByIdentifier",
      setPatient: "serviceRequest/setPatient",
      getAppointmentsByDate: "appointment/getAppointmentsByDate",
    }),

    test_(value) {
      console.log(value);
    },

    transformTdate(value) {
      const [date, time] = value.split(" ");

      return new Date(`${date}T${time}`);
    },

    async handleSelectedPatient(item) {
      this.selectedPatient = item;
    },
    viewDay({ date }) {
      if (this.type !== "category") {
        this.focus = date;
        this.type = "day";
      }
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },

    async updateEvent() {
      if (!this.type || !this.cal) return;
      const { data } = await this.getAppointmentsByDate({
        type: this.type,
        dateStart: this.cal.lastStart.date,
        dateEnd: this.cal.lastEnd.date,
      });

      this.updateRange(data.collection);
    },

    updateRange(events) {
      this.events = events.map((event) => {
        const name = `${event.patient[0].given} ${event.patient[0].father_family} ${event.patient[0].mother_family} (${event.status.display})`;
        return {
          name: name,
          start: new Date(this.transformTdate(event.slot.start)),
          end: new Date(this.transformTdate(event.slot.end)),
          color: "warning",
          timed: true,
          category: this.categories[0],
        };
      });
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },

    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);

      this.cal.scrollToTime(first);
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: "";
    position: absolute;
    background-color: #ea4335;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-top: -4px;
    margin-left: -8px;
  }
}
</style>
