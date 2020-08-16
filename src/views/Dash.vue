<template>
  <div>
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/hello' }">
          <img src="@/assets/logo.png" alt="dashbed logo" />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/hello' }">
          HOME
        </b-navbar-item>
        <b-navbar-dropdown label="VENTAS">
          <b-navbar-item tag="router-link" :to="{ path: '/invoices' }">
            DIA
          </b-navbar-item>
          <b-navbar-item tag="router-link" :to="{ path: '/cash' }">
            FACTURACION
          </b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-dropdown label="RESERVAR">
          <b-navbar-item tag="router-link" :to="{ path: '/citybeaches' }">
            RESERVA SIMPLE
          </b-navbar-item>
          <b-navbar-item tag="router-link" :to="{ path: '/shell' }">
            RESERVA MULTIPLE
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <b-button type="is-danger" @click="exit">
              SALIR
            </b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'dash',
  data() {
    return {};
  },
  methods: {
    ...mapMutations('userStore', ['setLogout']),

    exit() {
      this.setLogout();
      this.$router.replace({ name: 'login' });
    },
  },
};
</script>

<style scoped></style>
