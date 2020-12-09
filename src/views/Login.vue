<template>
  <div>
    <form @submit.prevent="login">
      <b-field label="CONTRASEÑA">
        <b-input type="password" v-model="dni" password-reveal required>
        </b-input>
      </b-field>
      <article class="message is-danger" v-if="error">
        <div class="message-body">EMPLEADO NO ENCONTRADO.</div>
      </article>
      <div class="buttons">
        <b-button
          type="is-primary is-fullwidth"
          native-type="submit"
          :disabled="offline"
          >ENTRAR</b-button
        >
      </div>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-dark">version</b-tag>
          <b-tag type="is-info">0.1.18</b-tag>
        </b-taglist>
      </div>
    </form>
    <article class="message is-danger" v-if="offline">
      <div class="message-body">ESTABLECIENDO CONEXIÓN, ESPERE.</div>
    </article>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'login',
  data() {
    return {
      dni: '',
      offline: true,
      error: false,
    };
  },

  mounted() {
    this.checkServer().then(result => {
      if (result) {
        this.offline = false;
      }
    });
  },

  methods: {
    ...mapActions('userStore', ['getEmployee', 'checkServer']),

    login() {
      this.getEmployee({
        dni: this.dni.toUpperCase(),
      }).then(response => {
        if (response) {
          this.$router.push({ name: 'hello' });
        } else {
          this.error = true;
        }
      });
    },
  },
};
</script>

<style scoped></style>
