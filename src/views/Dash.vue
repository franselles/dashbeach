<template>
  <div>
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="@/assets/logo.png" alt="dashbed logo" />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/dash' }">
          HOME
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/citybeaches' }">
          RESERVAS
        </b-navbar-item>
        <b-navbar-dropdown label="EDITA SECTOR">
          <b-navbar-item tag="router-link" :to="{ path: '/shell' }">
            RESERVA MULTIPLE
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <router-link class="button is-danger" :to="{ path: '/' }">
              <strong>SALIR</strong>
            </router-link>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'dash',
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped></style>
