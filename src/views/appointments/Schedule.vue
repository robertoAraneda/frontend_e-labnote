<template>
  <v-container>
    <BaseHeaderModule
      title="Módulo de visualización de horas agendadas."
      subtitle="En este módulo podrás visualizar tu agenda."
    />
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
            interval-height="300"
            :weekdays="weekdays"
            :short-weekdays="false"
            :short-intervals="false"
            :show-week="true"
            first-interval="7"
            interval-count="11"
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
            min-width="350"
            max-width="500"
          >
            <v-card color="grey lighten-4" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-card
                  v-if="selectedPatient"
                  elevation="0"
                  max-width="500"
                  min-height="400"
                  class="px-3"
                  color="grey lighten-4"
                >
                  <v-card-text class="grey-text">
                    <v-list class="ml-n6 mr-n5 grey lighten-4" two-line>
                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon color="primary"
                            >mdi-account-box-outline</v-icon
                          ></v-list-item-icon
                        >

                        <v-list-item-content>
                          <v-list-item-title>
                            {{ identifier.value }}
                          </v-list-item-title>
                          <v-list-item-subtitle>{{
                            identifier.identifierType.display
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action class="mt-n2"
                          >{{ age }} años</v-list-item-action
                        >
                      </v-list-item>

                      <v-divider inset></v-divider>
                      <v-list-item
                        v-for="(phone, index) in telecomsPhone"
                        :key="phone.id"
                      >
                        <v-list-item-icon v-if="index === 0">
                          <v-icon color="primary"> mdi-phone </v-icon>
                        </v-list-item-icon>
                        <v-list-item-action v-else></v-list-item-action>

                        <v-list-item-content>
                          <v-list-item-title
                            v-html="phone.value"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-html="phone.system"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>

                      <v-divider inset></v-divider>

                      <v-list-item
                        v-for="(email, index) in telecomsEmail"
                        :key="email.value"
                      >
                        <v-list-item-icon v-if="index === 0">
                          <v-icon color="primary"> mdi-email </v-icon>
                        </v-list-item-icon>
                        <v-list-item-action v-else></v-list-item-action>

                        <v-list-item-content>
                          <v-list-item-title
                            v-html="email.value"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-html="email.system"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>

                      <v-divider inset></v-divider>

                      <v-list-item
                        v-for="(address, index) in addresses"
                        :key="address.text"
                      >
                        <v-list-item-icon v-if="index === 0">
                          <v-icon color="primary"> mdi-map-marker </v-icon>
                        </v-list-item-icon>
                        <v-list-item-action v-else></v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="address.text"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            >{{ address.city_name }},
                            {{ address.state_name }}</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
                <div class="text-center" v-else>
                  <v-progress-circular
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </div>
                <v-row>
                  <v-col
                    ><v-btn
                      depressed
                      rounded
                      color="secondary"
                      block
                      @click="handleFinishAppointment"
                      >Terminar atención</v-btn
                    ></v-col
                  >
                  <v-col
                    ><v-btn
                      depressed
                      rounded
                      color="primary"
                      block
                      @click="handleCreateServiceRequest"
                      >Crear solicitud</v-btn
                    ></v-col
                  >
                </v-row>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { EnumAppointmentStatus } from "../../enums/EnumAppointmentStatus";
import Pusher from "pusher-js"; // import Pusher

export default {
  name: "schedule",

  data: () => ({
    tabs: null,
    messages: [],
    editedItem: {
      given: "",
      father_family: "araneda",
      mother_family: "",
    },

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

  created() {
    this.setPatient(null);
    this.subscribe();
  },

  mounted() {
    this.$refs.calendar.checkChange();
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
    this.getIdentifierTypes();
    this.setPatient(null);
    if (this.selectedDateWhenAppointment) {
      this.focus = this.selectedDateWhenAppointment;
    }

    this.updateEvent();
  },

  watch: {
    selectedOpen() {
      if (!this.selectedOpen) {
        this.setPatient(null);
      }
    },
  },

  computed: {
    ...mapGetters({
      patients: "patient/patients",
      identifierTypes: "patient/identifierTypes",
      selectedDateWhenAppointment: "appointment/selectedDateWhenAppointment",
      selectedPatient: "serviceRequest/patient",
    }),

    telecomsEmail() {
      if (!this.selectedPatient) return [];
      return this.selectedPatient.telecom.filter(
        (telecom) => telecom.system === "Email"
      );
    },
    telecomsPhone() {
      if (!this.selectedPatient) return [];
      return this.selectedPatient.telecom.filter(
        (telecom) => telecom.system === "Celular"
      );
    },
    addresses() {
      if (!this.selectedPatient) return [];
      return this.selectedPatient.address;
    },
    identifier() {
      if (!this.selectedPatient) return null;
      return this.selectedPatient.identifier[0];
    },
    age() {
      if (!this.selectedPatient) return null;

      const currentDate = moment();

      const age = moment(this.selectedPatient.birthdate);

      return currentDate.diff(age, "year", false);
    },

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
      findPatientById: "patient/showItem",
      setPatient: "serviceRequest/setPatient",
      getAppointmentsByDate: "appointment/getAppointmentsByDate",
      updateAppointment: "appointment/putItem",
      setIsServiceRequestCreatedByAppointment:
        "serviceRequest/setIsServiceRequestCreatedByAppointment",
      setSelectedAppointment: "serviceRequest/setSelectedAppointment",
    }),

    subscribe() {
      Pusher.logToConsole = true;
      let pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
        cluster: process.env.VUE_APP_PUSHER_CLUSTER,
      });

      pusher.subscribe("patient");
      pusher.bind("patient_arrived", (data) => {
        this.updateEvent();
        console.log("data", data);
        this.messages.unshift(data);
      });
    },

    async handleFinishAppointment() {
      const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
      const start = this.selectedEvent.detail.start || currentDate;

      const diff = moment().diff(moment(start), "minutes");

      await this.updateAppointment({
        id: this.selectedEvent.detail.id,
        start: this.selectedEvent.detail.start || currentDate,
        end: currentDate,
        minutes_duration: diff,
        status: EnumAppointmentStatus.CANCELLED,
      });

      await this.updateEvent();

      this.selectedOpen = false;
    },

    async handleCreateServiceRequest() {
      this.setIsServiceRequestCreatedByAppointment(true);
      this.setSelectedAppointment(this.selectedEvent.detail);

      const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

      await this.updateAppointment({
        id: this.selectedEvent.detail.id,
        start: currentDate,
        status: EnumAppointmentStatus.ARRIVED,
      });

      await this.$router.push({ name: "createServiceRequest" });
    },

    transformTdate(value) {
      const [date, time] = value.split(" ");

      return new Date(`${date}T${time}`);
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
    async showEvent({ nativeEvent, event }) {
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
        const { data } = await this.findPatientById(
          this.selectedEvent.detail.patient._links.self.href
        );
        this.setPatient(data);
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
      console.log(events);
      this.events = events.map((event) => {
        const name = `${event.patient.name[0].given} ${event.patient.name[0].father_family} ${event.patient.name[0].mother_family} (${event.status.display})`;
        return {
          id: event.patient_id,
          name: name,
          start: new Date(this.transformTdate(event.slot.start)),
          end: new Date(this.transformTdate(event.slot.end)),
          color: this.setAppointmentColor(event.status.code),
          timed: true,
          category: this.categories[0],
          detail: event,
        };
      });
    },

    setAppointmentColor(status) {
      switch (status) {
        case "pending":
          return "warning";
        case "arrived":
          return "success";
        case "cancelled":
          return "error";
      }
    },

    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0;
    },
    scrollToTime() {
      this.cal.scrollToTime("08:00");
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
    },
  },
};
</script>

<style lang="scss">
.v-calendar .v-event-timed {
  position: absolute;
  overflow: hidden;
  white-space: normal !important;
  text-overflow: ellipsis;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  pointer-events: all;
}

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
