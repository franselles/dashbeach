<template>
  <div>
    <h5 class="title is-5">RESERVAS POR FECHA</h5>
    <div class="field is-grouped is-grouped-multiline">
      <b-datepicker
        placeholder="Selecciona una fecha..."
        icon="calendar-today"
        v-model="dateFrom"
        :day-names="calendar.days"
        :month-names="calendar.months"
        :first-day-of-week="1"
        :nearby-month-days="false"
        :focused-date="dateFrom"
      >
      </b-datepicker>
      <b-datepicker
        placeholder="Selecciona una fecha..."
        icon="calendar-today"
        v-model="dateTo"
        :day-names="calendar.days"
        :month-names="calendar.months"
        :first-day-of-week="1"
        :nearby-month-days="false"
        :focused-date="dateTo"
      >
      </b-datepicker>

      <b-button type="is-primary" @click="filterInvoices">
        BUSCAR
      </b-button>
    </div>

    <b-table :data="invoices">
      <b-table-column field="date" label="Fecha" v-slot="props">
        {{ props.row.date }}
      </b-table-column>
      <b-table-column field="beach" label="Playa" v-slot="props">
        {{ props.row.beach }}
      </b-table-column>
      <b-table-column field="sectorID" label="Sector" v-slot="props">
        {{ props.row.sectorID }}
      </b-table-column>
      <b-table-column field="type" label="Item" v-slot="props">
        {{ props.row.type }}
      </b-table-column>
      <b-table-column field="quantity" label="Cantidad" numeric v-slot="props">
        {{ props.row.quantity }}
      </b-table-column>
      <b-table-column field="price" label="Precio" numeric v-slot="props">
        {{ props.row.price }} €
      </b-table-column>
      <b-table-column label="Total" numeric v-slot="props">
        {{ totalItem(props.row) }} €
      </b-table-column>
      <b-table-column field="name" label="Nombre" v-slot="props">
        {{ props.row.name }}
      </b-table-column>
      <b-table-column field="userID" label="Teléfono" v-slot="props">
        {{ props.row.userID }}
      </b-table-column>
      <b-table-column field="ticketID" label="Ticket" v-slot="props">
        {{ props.row.ticketID }}
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapActions } from 'vuex';

export default {
  name: 'invoices',

  data() {
    return {
      calendar: {
        months: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
        days: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      },
      dateFrom: new Date(),
      dateTo: new Date(),
      invoices: [],
    };
  },

  methods: {
    ...mapActions('worksStore', ['getInvoices']),

    filterInvoices() {
      const dateFilterFrom = dayjs(this.dateFrom).format('YYYY-MM-DD');
      const dateFilterTo = dayjs(this.dateTo).format('YYYY-MM-DD');
      this.getInvoices({ dateFrom: dateFilterFrom, dateTo: dateFilterTo }).then(
        result => {
          this.invoices = result;
        }
      );
    },

    totalItem(e) {
      return e.price * e.quantity;
    },
  },
};
</script>

<style scoped></style>
