<template>
  <div>
    <div class="field is-grouped">
      <p class="control is-expanded">
        <b-datepicker
          placeholder="Selecciona una fecha..."
          icon="calendar-today"
          v-model="date"
          :day-names="calendar.days"
          :month-names="calendar.months"
          :first-day-of-week="1"
          :nearby-month-days="false"
          :focused-date="date"
        >
        </b-datepicker>
      </p>
      <p class="control">
        <b-button type="is-primary" @click="filterInvoices">
          BUSCAR
        </b-button>
      </p>
    </div>

    <b-table :data="invoices">
      <template slot-scope="props">
        <b-table-column field="beach" label="Playa">
          {{ props.row.beach }}
        </b-table-column>
        <b-table-column field="sectorID" label="Sector">
          {{ props.row.sectorID }}
        </b-table-column>
        <b-table-column field="type" label="Item">
          {{ props.row.type }}
        </b-table-column>
        <b-table-column field="quantity" label="Cantidad" numeric>
          {{ props.row.quantity }}
        </b-table-column>
        <b-table-column field="price" label="Precio" numeric>
          {{ props.row.price }} €
        </b-table-column>
        <b-table-column label="Total" numeric>
          {{ totalItem(props.row) }} €
        </b-table-column>
        <b-table-column field="name" label="Nombre">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column field="userID" label="Teléfono">
          {{ props.row.userID }}
        </b-table-column>
      </template>
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
      date: new Date(),
      invoices: [],
    };
  },

  methods: {
    ...mapActions('worksStore', ['getInvoices']),

    filterInvoices() {
      const dateFilter = dayjs(this.date).format('YYYY-MM-DD');
      this.getInvoices(dateFilter).then(result => {
        this.invoices = result;
      });
    },

    totalItem(e) {
      return e.price * e.quantity;
    },
  },
};
</script>

<style scoped></style>
