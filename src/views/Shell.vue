<template>
  <div></div>
</template>

<script>
export default {
  name: 'shell',

  data() {
    return {
      date_from: '',
      date_to: '',
      date: '',
      userID: '',
      phone: '',
      ticketID: '',
      canceled: '',
      payed: '',
      detail: [],
      detail_local: {
        date: '',
        cityID: '',
        city: '',
        beachID: '',
        beach: '',
        sectorID: '',
        sector: '',
        typeID: '',
        type: '',
        itemID: '',
        quantity: '',
        price: '',
        codeID: '',
        used: '',
        dateTimeUsed: '',
      },
    };
  },

  methods: {},
};
</script>

<style scoped></style>
