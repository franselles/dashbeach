<template>
  <div>
    <div>
      <table class="table">
        <thead>
          <tr>
            <th><abbr title="Position">#</abbr></th>
            <th><abbr title="Nombre y telefono">Nombre y teléfono</abbr></th>
            <th><abbr title="Tickets">Tickets</abbr></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in users" :key="item._id">
            <th>{{ index + 1 }}</th>
            <td>
              <strong> {{ item.name }} </strong> {{ item._id }}
              <div v-if="isOpen == index">
                <ticket :userID="item._id"></ticket>
              </div>
            </td>
            <td><b-button @click="open(index)">VER</b-button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ticket from '@/components/Ticket.vue';

export default {
  name: 'tickets',

  components: { ticket },

  data() {
    return {
      users: [],
      isOpen: 0,
    };
  },

  mounted() {
    this.getUsersTickets().then(result => {
      this.users = result;
    });
  },

  methods: {
    ...mapActions('userStore', ['getUsersTickets']),

    open(index) {
      this.isOpen = index;
    },
  },
};
</script>

<style scoped></style>
