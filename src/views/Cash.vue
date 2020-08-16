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
        <b-button type="is-primary" @click="filterCash">
          BUSCAR
        </b-button>
      </p>
    </div>
    <b-table :data="cash">
      <template slot-scope="props">
        <b-table-column field="sectorID" label="ID" numeric>
          {{ props.row.typeID }}
        </b-table-column>
        <b-table-column field="type" label="Item">
          {{ props.row.type }}
        </b-table-column>
        <b-table-column field="quantity" label="Cantidad" numeric>
          {{ props.row.total }}
        </b-table-column>
        <b-table-column field="price" label="Precio" numeric>
          {{ props.row.price }} €
        </b-table-column>
        <b-table-column label="Total" numeric>
          {{ props.row.amount }} €
        </b-table-column>
      </template>
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
      date: new Date(),
      cash: [],
    };
  },
  methods: {
    ...mapActions('worksStore', ['getCash']),

    filterCash() {
      const dateFilter = dayjs(this.date).format('YYYY-MM-DD');
      this.getCash(dateFilter).then(result => {
        this.cash = result;
      });
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
