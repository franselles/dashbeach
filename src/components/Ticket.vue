<template>
  <div>
    <div v-for="item in tickets" :key="item.id">
      <div>
        <strong>
          FECHA TICKET: {{ item.date }} TICKET: {{ item.ticketID }}</strong
        >
      </div>

      <div v-for="detail in item.detail" :key="detail.id">
        <div>
          FECHA RESERVA: <strong> {{ detail.date }} </strong>
        </div>

        <div>
          *** PLAYA: <strong> {{ detail.beach }} </strong> SECTOR:
          <strong> {{ detail.sectorID }} </strong> ITEM:
          <strong> {{ detail.type }} </strong> CDAD:<strong>
            {{ detail.quantity }}
          </strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ticket',

  props: {
    userID: {
      type: String,
    },
  },

  data() {
    return {
      tickets: [],
    };
  },

  mounted() {
    this.getTicketsUser(this.userID).then(result => {
      this.tickets = result;
    });
  },

  methods: {
    ...mapActions('userStore', ['getTicketsUser']),
  },
};
</script>

<style scoped></style>
