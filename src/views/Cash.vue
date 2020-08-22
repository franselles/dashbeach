<template>
  <div>
    <h5 class="title is-5">VENTAS POR FECHA</h5>
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

      <b-button type="is-primary" @click="filterCash">
        BUSCAR
      </b-button>
    </div>
    <b-table :data="cash">
      <b-table-column field="date" label="Fecha" v-slot="props">
        {{ props.row.date }}
      </b-table-column>
      <b-table-column field="typeID" label="ID" numeric v-slot="props">
        {{ props.row.typeID }}
      </b-table-column>
      <b-table-column field="type" label="Item" v-slot="props">
        {{ props.row.type }}
      </b-table-column>
      <b-table-column field="quantity" label="Cantidad" numeric v-slot="props">
        {{ props.row.total }}
      </b-table-column>
      <b-table-column field="price" label="Precio" numeric v-slot="props">
        {{ props.row.price }} €
      </b-table-column>
      <b-table-column label="Total" numeric v-slot="props">
        {{ props.row.amount }} €
      </b-table-column>

      <template slot="footer">
        <div class="has-text-right">TOTAL FACTURADO {{ getAmount }} €</div>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import dayjs from 'dayjs';

export default {
  name: 'cash',

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
      cash: [],
    };
  },
  methods: {
    ...mapActions('worksStore', ['getCash']),

    filterCash() {
      const dateFilterFrom = dayjs(this.dateFrom).format('YYYY-MM-DD');
      const dateFilterTo = dayjs(this.dateTo).format('YYYY-MM-DD');
      this.getCash({ dateFrom: dateFilterFrom, dateTo: dateFilterTo }).then(
        result => {
          this.cash = result;
        }
      );
    },
  },

  computed: {
    getAmount: function () {
      let totalAmount = 0;
      for (const iterator of this.cash) {
        totalAmount += iterator.amount;
      }

      return totalAmount;
    },
  },
};
</script>

<style scoped></style>
