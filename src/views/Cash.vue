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
        <b-button type="is-primary">
          BUSCAR
        </b-button>
      </p>
    </div>
    <p>AUN LO TENGO QUE HACER.</p>
  </div>
</template>

<script>
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
    };
  },
};
</script>

<style scoped></style>
