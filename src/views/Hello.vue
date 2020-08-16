<template>
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
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'hello',

  computed: {
    ...mapState('userStore', ['employee']),
  },
};
</script>

<style scoped></style>
