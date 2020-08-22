<template>
  <div>
    <section class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">HOLA {{ employee.name }}</h1>
          <h2 class="subtitle">
            Buenos días.
          </h2>
        </div>
      </div>
    </section>
    <section>
      <div v-if="invoices.length == 0">
        <article class="message is-danger">
          <div class="message-header">
            <p>NO HAY RESERVAS PARA HOY</p>
          </div>
        </article>
      </div>
      <div v-else>
        <article class="message is-success">
          <div class="message-header">
            <p>RESERVAS PARA HOY</p>
          </div>
        </article>
      </div>
    </section>
    <section>
      <b-table :data="invoices" hoverable>
        <b-table-column field="beach" label="Playa" v-slot="props">
          {{ props.row.beach }}
        </b-table-column>
        <b-table-column field="sectorID" label="Sector" v-slot="props">
          {{ props.row.sectorID }}
        </b-table-column>
        <b-table-column field="type" label="Item" v-slot="props">
          {{ props.row.type }}
        </b-table-column>
        <b-table-column
          field="quantity"
          label="Cantidad"
          numeric
          v-slot="props"
        >
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
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import dayjs from 'dayjs';

export default {
  name: 'hello',

  data() {
    return {
      invoices: [],
    };
  },

  mounted() {
    this.filterInvoices();
  },

  methods: {
    ...mapActions('worksStore', ['getInvoices']),

    filterInvoices() {
      const dateFilter = dayjs(new Date()).format('YYYY-MM-DD');
      this.getInvoices({ dateFrom: dateFilter, dateTo: dateFilter }).then(
        result => {
          this.invoices = result;
        }
      );
    },

    totalItem(e) {
      return e.price * e.quantity;
    },
  },

  computed: {
    ...mapState('userStore', ['employee']),
  },
};
</script>

<style scoped></style>
