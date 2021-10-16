<template>
  <v-container>
    <BaseHeaderModule
      title="Módulo de gestión de bloques"
      subtitle="En este módulo podrás gestionar los bloques para agendar horas de pacientes."
    />

    <v-tabs v-model="tab">
      <v-tab>Gestión de bloques creados</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-sheet class="ma-3">
          <v-row class="mb-n12">
            <v-col cols="6">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    solo
                    v-model="date"
                    label="Seleccione una fecha"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  @click:date="dblClick"
                  v-model="date"
                  no-title
                  @input="menu = false"
                >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-toolbar dense elevation="0"
                ><v-toolbar-title>Gestión masiva de bloques</v-toolbar-title
                ><v-spacer />
              </v-toolbar>
            </v-col>
          </v-row>

          <v-row id="create">
            <v-col cols="6">
              <v-sheet elevation="2" height="600">
                <v-calendar
                  locale="es"
                  hide-header
                  :events="events"
                  v-model="date"
                  color="primary"
                  type="day"
                  interval-height="120"
                  first-interval="8"
                  interval-count="10"
                  @click:event="showEvent"
                  @mousedown:event="startDrag"
                  @mousedown:time="startTimeDrag"
                >
                  <template v-slot:day-header="{ present }">
                    <template v-if="present" class="text-center">
                      Today
                    </template>
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
                      <v-toolbar-title
                        v-html="selectedEvent.name"
                      ></v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn
                        @click="handleDeleteOneItem(selectedEvent)"
                        icon
                        v-if="selectedEvent.showEditButton"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text>
                      <span
                        v-if="!selectedEvent.showEditButton"
                        v-html="selectedEvent.details"
                      ></span>
                      <v-card tile flat v-else>
                        <v-card-title>Editar bloque</v-card-title>
                        <v-card-text>
                          <v-text-field
                            dense
                            outlined
                            disabled
                            label="Fecha"
                            v-model="editedSlotModel.date"
                          ></v-text-field>
                          <v-row>
                            <v-col cols="6">
                              <v-text-field
                                dense
                                outlined
                                label="Hora inicial"
                                v-model="editedSlotModel.start"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                                dense
                                outlined
                                label="Hora final"
                                v-model="editedSlotModel.end"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-select
                            dense
                            v-model="editedSlotModel.slot_status_id"
                            outlined
                            :items="slotStatuses"
                            item-value="id"
                            item-text="text"
                            label="Estado"
                          ></v-select>
                        </v-card-text>
                        <v-card-actions> </v-card-actions>
                      </v-card>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        text
                        color="secondary"
                        @click="selectedOpen = false"
                      >
                        Cerrar
                      </v-btn>
                      <v-btn
                        v-if="selectedEvent.showEditButton"
                        depressed
                        rounded
                        color="primary"
                        @click="editSlot"
                        >Guardar</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-sheet>
            </v-col>
            <v-col cols="6">
              <v-sheet elevation="2" height="600">
                <v-data-table
                  v-model="selected"
                  :headers="headers"
                  :items="events"
                  :single-select="singleSelect"
                  item-key="id"
                  show-select
                  height="530"
                  fixed-header
                >
                  <template v-slot:top>
                    <v-speed-dial
                      v-model="fab"
                      :bottom="false"
                      :left="false"
                      :top="true"
                      :right="true"
                      direction="left"
                      :open-on-hover="true"
                      transition="scale-transition"
                    >
                      <template v-slot:activator>
                        <v-btn v-model="fab" color="primary" dark fab>
                          <v-icon v-if="fab"> mdi-close </v-icon>
                          <v-icon v-else> mdi-dots-vertical </v-icon>
                        </v-btn>
                      </template>

                      <v-btn
                        @click="dialog = true"
                        fab
                        dark
                        small
                        color="primary"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn
                        @click="handleEditedStatusInBatch"
                        fab
                        dark
                        small
                        color="warning"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        @click="handleDeleteInBatch"
                        fab
                        dark
                        small
                        color="red"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-speed-dial>
                  </template>
                  <template v-slot:header.data-table-select="{ props, on }">
                    <v-simple-checkbox
                      color="primary"
                      v-bind="props"
                      v-on="on"
                    ></v-simple-checkbox>
                  </template>
                  <template
                    v-slot:item.data-table-select="{ isSelected, select, item }"
                  >
                    <v-simple-checkbox
                      v-if="item.showEditButton"
                      color="primary"
                      :value="isSelected"
                      @input="select($event)"
                    ></v-simple-checkbox>
                  </template>
                  <template v-slot:item.start="{ item }">
                    {{ item.start | filterDate }}
                  </template>
                  <template v-slot:item.end="{ item }">
                    {{ item.end | filterDate }}
                  </template>
                </v-data-table>
              </v-sheet>
            </v-col>
          </v-row>
        </v-sheet>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog max-width="800" v-model="dialog">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="5" class="my-2 px-1">
              <v-date-picker
                color="secondary"
                ref="picker"
                v-model="dates"
                range
                full-width
                header-color="primary"
                show-current
                :picker-date.sync="pickerDate"
                :events="arrayEvents"
                event-color="green lighten-1"
              ></v-date-picker>
            </v-col>
            <v-col cols="12" sm="6" class="my-2 px-1">
              <v-card-text>
                <div class="subheading" v-if="dates.length == 1">
                  Fecha seleccionada
                </div>
                <div class="subheading" v-else-if="dates.length == 2">
                  Fechas seleccionadas
                </div>
                <div class="text-h6" v-else>
                  Selecciona una fecha o un rango de ellas
                </div>

                <v-text-field
                  v-model="dateRangeText"
                  label="Rango de fechas"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                ></v-text-field>
                <div class="subheading">
                  Seleccione el rango horario del bloque
                </div>
                <v-row>
                  <v-col cols=" 6">
                    <v-menu
                      ref="menuStart"
                      v-model="menuStartTime"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="startTime"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="startTime"
                          label="Hora inicial"
                          prepend-inner-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menuStartTime"
                        v-model="startTime"
                        full-width
                        @click:minute="$refs.menuStart.save(startTime)"
                      ></v-time-picker> </v-menu
                  ></v-col>
                  <v-col cols=" 6">
                    <v-menu
                      ref="menuEnd"
                      v-model="menuEndTime"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="endTime"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="endTime"
                          label="Hora final"
                          prepend-inner-icon="mdi-clock-time-seven-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        color="secondary"
                        header-color="primary"
                        v-if="menuEndTime"
                        v-model="endTime"
                        full-width
                        @click:minute="$refs.menuEnd.save(endTime)"
                      ></v-time-picker> </v-menu
                  ></v-col>
                </v-row>
                <div class="subheading">Tamaño del bloque horario</div>
                <v-slider
                  color="primary"
                  v-model="timeSlot"
                  :tick-labels="ticksLabels"
                  :min="0"
                  :max="4"
                  step="1"
                  tick-size="5"
                  ticks="always"
                  thumb-color="primary"
                ></v-slider>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="handleCreateSlots"
            class="ml-auto"
            rounded
            depressed
            color="primary"
            >Crear bloque</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="600" v-model="dialogEditInBulk">
      <v-card>
        <v-card-title>Editar estado bloques</v-card-title>
        <v-card-text>
          <v-select
            v-model="editedSlotModel.slot_status_id"
            outlined
            :items="slotStatuses"
            item-value="id"
            item-text="text"
            label="Estado"
          ></v-select>

          <v-alert
            v-if="editedBusySlots.length !== 0"
            border="left"
            colored-border
            type="warning"
            elevation="2"
          >
            ¡Atención! El estado de estos bloques no puede ser modificado.
          </v-alert>
          <v-sheet
            v-if="editedBusySlots.length !== 0"
            elevation="1"
            class="ma-3"
          >
            <v-virtual-scroll
              :items="editedBusySlots"
              :item-height="50"
              height="200"
            >
              <template v-slot:default="{ item, index }">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-avatar color="primary" size="24" class="white--text">
                      {{ index + 1 }}
                    </v-avatar>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      >{{ item.startDate }} - {{ item.startTime }} a
                      {{ item.endTime }}</v-list-item-title
                    >
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-chip small :color="item.color">
                      {{ item.name }}
                    </v-chip>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-sheet>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="editBulkSlot">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="600" v-model="dialogDeleteSlotInBulk">
      <v-card>
        <v-card-title>Eliminar bloques</v-card-title>
        <v-card-text>
          <v-alert
            v-if="deletedSlots.length !== 0"
            border="left"
            colored-border
            type="warning"
            elevation="2"
          >
            ¿Está seguro de eliminar los siguientes bloques horarios?.
          </v-alert>
          <v-sheet v-if="deletedSlots.length !== 0" elevation="1" class="ma-3">
            <v-virtual-scroll
              :items="deletedSlots"
              :item-height="50"
              height="200"
            >
              <template v-slot:default="{ item, index }">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-avatar color="primary" size="24" class="white--text">
                      {{ index + 1 }}
                    </v-avatar>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      >{{ item.startDate }} - {{ item.startTime }} a
                      {{ item.endTime }}</v-list-item-title
                    >
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-chip small :color="item.color">
                      {{ item.name }}
                    </v-chip>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-sheet>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" text @click="editBulkSlot">Cancelar</v-btn>
          <v-btn color="primary" rounded depressed @click="deleteSlotInBulk"
            >Eliminar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="400" v-model="dialogCreateDrag">
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Crear bloque</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text class="text-center">
          <v-card class="mt-3" tile flat v-if="!loadingCreateDrag">
            <v-card-text>
              <v-text-field
                dense
                outlined
                disabled
                label="Fecha"
                v-model="editedSlotModel.date"
              ></v-text-field>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    dense
                    outlined
                    label="Hora inicial"
                    v-model="editedSlotModel.start"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    dense
                    outlined
                    label="Hora final"
                    v-model="editedSlotModel.end"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-select
                dense
                v-model="editedSlotModel.slot_status_id"
                outlined
                :items="slotStatuses"
                item-value="id"
                item-text="text"
                label="Estado"
              ></v-select>
            </v-card-text>
          </v-card>
          <v-progress-circular
            class="mt-4"
            v-else
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="secondary" @click="dialogCreateDrag = false">
            Cerrar
          </v-btn>
          <v-btn depressed rounded @click="handleSave" color="primary"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";
import { EnumSlotStatus } from "../../enums/EnumSlotStatus";

export default {
  name: "AppointmentSlot",

  data: () => ({
    dates: [],
    timeSlot: 0,
    pickerDate: null,
    ticksLabels: ["5 min", "10 min", "15 min", "20 min", "25 min"],
    startTime: null,
    menuStartTime: false,
    endTime: null,
    menuEndTime: false,
    dialog: false,

    date: null,
    menu: false,

    arrayEvents: null,
    events: [],

    tab: null,

    singleSelect: false,
    selected: [],

    fab: false,
    dialogCreateDrag: false,
    loadingCreateDrag: false,
    dialogEditInBulk: false,

    editedAvailableSlots: [],
    editedBusySlots: [],

    deletedSlots: [],
    dialogDeleteSlotInBulk: false,

    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,

    selectedElementDrag: null,
    selectedOpenDrag: false,

    //draggedEvent
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,

    slotStatuses: [
      {
        id: EnumSlotStatus.FREE,
        text: "Disponible",
      },
      {
        id: EnumSlotStatus["BUSY-UNAVAILABLE"],
        text: "No Disponible",
      },
    ],

    headers: [
      {
        text: "Inicio",
        value: "start",
        sortable: false,
      },
      {
        text: "Fin",
        value: "end",
        sortable: false,
      },
      {
        text: "Estado",
        value: "name",
        sortable: false,
      },
    ],

    editedSlotModel: {
      id: "",
      date: "",
      fullStartDate: "",
      fullEndDate: "",
      start: "",
      end: "",
      slot_status_id: "",
      slotTime: "",
    },
    editedItem: {
      dates: {
        start: "",
        end: "",
      },
      rangeTimeAppointment: {
        start: "",
        end: "",
      },
      slotTime: "",
    },
  }),

  watch: {
    async pickerDate(value) {
      const slots = await this.getSlotsByDate(value);

      this.arrayEvents = slots.collection.map((slot) =>
        slot.start.slice(0, 10)
      );
    },
    dates() {
      this.dates.forEach((date, index) => {
        const current = moment();
        const selectedDate = moment(date);

        if (selectedDate.diff(current, "days") < 0) {
          alert("debes seleccionar una fecha superior a la actual.");
          this.dates.splice(index, 1);
        }
      });
    },
  },

  computed: {
    dateRangeText() {
      return this.dates.join(" a ");
    },
  },

  filters: {
    filterDate(value) {
      return moment(value).format("DD/MM/YYYY, HH:mm");
    },
  },

  methods: {
    ...mapActions({
      createSlotsWithRangeDates: "slot/postWithDatesRange",
      getSlotsByDate: "slot/getItemsByDate",
      getSlotBySimpleDate: "slot/getItemsBySimpleDate",
      deleteItemInBatch: "slot/deleteItemInBatch",
      updateItemInBatch: "slot/updateItemInBatch",
      deleteItem: "slot/deleteItem",
      edit: "slot/putItem",
      save: "slot/postItem",
    }),

    async handleSave() {
      this.loadingCreateDrag = true;
      const start = moment(
        `${this.editedSlotModel.date}T${this.editedSlotModel.start}`
      );
      const end = moment(
        `${this.editedSlotModel.date}T${this.editedSlotModel.end}`
      );

      const slotTime = end.diff(start, "minutes");

      this.editedSlotModel.slotTime = slotTime;
      this.editedSlotModel.start =
        this.editedSlotModel.date + " " + this.editedSlotModel.start + ":00";
      this.editedSlotModel.end =
        this.editedSlotModel.date + " " + this.editedSlotModel.end + ":00";

      await this.save(this.editedSlotModel);
      await this.dblClick(this.date);
      this.dialogCreateDrag = false;
      this.loadingCreateDrag = false;
    },

    toTime(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    },

    roundTime(time, down = true) {
      const roundTo = 15; // minutes
      const roundDownTime = roundTo * 60 * 1000;

      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    },

    startTimeDrag(tms) {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start;

        this.dragTime = mouse - start;
      } else {
        this.createStart = this.roundTime(mouse);
        console.log(this.createStart);

        const date = moment(this.createStart);
        this.editedSlotModel.date = date.format("YYYY-MM-DD");
        this.editedSlotModel.start = date.format("HH:mm");
        this.editedSlotModel.end = date.format("HH:mm");
        this.editedSlotModel.slot_status_id = EnumSlotStatus.FREE;
        this.dialogCreateDrag = true;
      }
    },

    startDrag({ event, timed }) {
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },

    async handleDeleteOneItem(item) {
      await this.deleteItem(item);

      this.selectedOpen = false;

      await this.dblClick(this.date);
    },

    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;

        this.handleEditSlot(event);
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

    async editSlot() {
      const start = moment(
        `${this.editedSlotModel.date}T${this.editedSlotModel.start}`
      );
      const end = moment(
        `${this.editedSlotModel.date}T${this.editedSlotModel.end}`
      );

      const slotTime = end.diff(start, "minutes");

      this.editedSlotModel.slotTime = slotTime;
      this.editedSlotModel.start =
        this.editedSlotModel.date + " " + this.editedSlotModel.start + ":00";
      this.editedSlotModel.end =
        this.editedSlotModel.date + " " + this.editedSlotModel.end + ":00";

      await this.edit(this.editedSlotModel);
      await this.dblClick(this.date);
      this.selectedOpen = false;
    },

    handleEditSlot(value) {
      const date = moment(value.start).format("YYYY-MM-DD");

      const startTime = moment(value.start).format("HH:mm");
      const endTime = moment(value.end).format("HH:mm");

      this.editedSlotModel.id = value.id;
      this.editedSlotModel.date = date;
      this.editedSlotModel.fullStartDate = value.start;
      this.editedSlotModel.fullEndDate = value.end;
      this.editedSlotModel.start = startTime;
      this.editedSlotModel.end = endTime;
      this.editedSlotModel.slot_status_id = value.status;
    },

    async dblClick(date) {
      const slots = await this.getSlotBySimpleDate(date);

      this.mappedSlot(slots);
    },

    mappedSlot(array) {
      this.events = [];
      this.events = array.collection.map((slot) => ({
        id: slot.id,
        status: slot.slot_status_id,
        name: this.parseSlotName(slot.slot_status_id),
        color: this.parseSlotColor(slot.slot_status_id),
        start: this.transformTdate(slot.start),
        end: this.transformTdate(slot.end),
        timed: true,
        showEditButton:
          slot.slot_status_id === EnumSlotStatus.FREE ||
          slot.slot_status_id === EnumSlotStatus["BUSY-UNAVAILABLE"],
      }));
    },

    parseSlotColor(status) {
      switch (status) {
        case 1:
          return "success";
        case 2:
          return "error";
        case 3:
          return "grey darken-3";
      }
    },

    parseSlotName(status) {
      switch (status) {
        case 1:
          return "Disponible";
        case 2:
          return "Ocupado";
        case 3:
          return "No disponible";
      }
    },

    transformTdate(value) {
      const [date, time] = value.split(" ");

      return new Date(`${date}T${time}`);
    },

    async handleEditedStatusInBatch() {
      if (this.selected.length === 0) {
        alert("Seleccione al menos un bloque para editar el estado");
        return;
      }

      this.editedAvailableSlots = this.selected
        .filter(
          (item) =>
            item.status === EnumSlotStatus.FREE ||
            item.status === EnumSlotStatus["BUSY-UNAVAILABLE"]
        )
        .map((item) => ({
          id: item.id,
          name: item.name,
          fullStart: item.start,
          fullEnd: item.end,
          startDate: moment(item.start).format("DD-MM-YYYY"),
          startTime: moment(item.start).format("HH:mm"),
          endTime: moment(item.end).format("HH:mm"),
          color: item.color,
        }));
      this.editedBusySlots = this.selected
        .filter((item) => item.status === EnumSlotStatus.BUSY)
        .map((item) => ({
          id: item.id,
          name: item.name,
          fullStart: item.start,
          fullEnd: item.end,
          startDate: moment(item.start).format("DD-MM-YYYY"),
          startTime: moment(item.start).format("HH:mm"),
          endTime: moment(item.end).format("HH:mm"),
          color: item.color,
        }));

      this.dialogEditInBulk = true;
    },

    async editBulkSlot() {
      if (this.selected.length === 0) {
        alert("Seleccione al menos un bloque para modificar el estado");
        return;
      }

      await this.updateItemInBatch({
        ids: JSON.stringify(this.editedAvailableSlots.map((item) => item.id)),
        status: this.editedSlotModel.slot_status_id,
      });

      await this.dblClick(this.date);

      this.dialogEditInBulk = false;
      this.selected = [];
    },

    async handleDeleteInBatch() {
      if (this.selected.length === 0) {
        alert("Seleccione al menos un bloque para eliminar");
        return;
      }

      this.deletedSlots = this.selected
        .filter(
          (item) =>
            item.status === EnumSlotStatus.FREE ||
            item.status === EnumSlotStatus["BUSY-UNAVAILABLE"]
        )
        .map((item) => ({
          id: item.id,
          name: item.name,
          startDate: moment(item.start).format("DD-MM-YYYY"),
          startTime: moment(item.start).format("HH:mm"),
          endTime: moment(item.end).format("HH:mm"),
          color: item.color,
        }));

      this.dialogDeleteSlotInBulk = true;
    },

    async deleteSlotInBulk() {
      await this.deleteItemInBatch({
        ids: JSON.stringify(this.deletedSlots.map((item) => item.id)),
      });

      await this.dblClick(this.date);

      this.selected = [];

      this.dialogDeleteSlotInBulk = false;
    },

    handleCreateSlots() {
      if (this.dates.length === 1) this.dates.push(this.dates[0]);
      const [start, end] = this.dates.slice().sort();

      this.editedItem = {
        dates: {
          start,
          end,
        },
        rangeTimeAppointment: {
          start: this.startTime + ":00",
          end: this.endTime + ":00",
        },
        slotTime: parseInt(this.ticksLabels[this.timeSlot].split(" ")[0]),
      };

      this.createSlotsWithRangeDates(this.editedItem);

      this.dialog = false;
    },
  },
};
</script>

<style scoped>
/* This is for documentation purposes and will not be needed in your application */
#create .v-speed-dial {
  position: absolute;
}

#create .v-btn--floating {
  position: relative;
}
</style>
