<template>
  <section class="section">
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label class="label">NOMBRE</label>
        <div class="control has-icons-left">
          <input
            class="input"
            type="text"
            placeholder="NOMBRE"
            v-model="localEmployee.name"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <label class="label">CORREO</label>
        <div class="control has-icons-left">
          <input
            class="input"
            type="text"
            placeholder="DNI / NIE"
            v-model="localEmployee.dni"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-id-card"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <label class="label">TELEFONO</label>
        <div class="control has-icons-left">
          <input
            class="input"
            type="text"
            placeholder="DNI / NIE"
            v-model="localEmployee.dni"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-id-card"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <label class="label">USER ID</label>
        <div class="control has-icons-left">
          <input
            class="input"
            type="text"
            placeholder="DNI / NIE"
            v-model="localEmployee.dni"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-id-card"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <label class="label">PASSWORD</label>
        <div class="control has-icons-left">
          <input
            class="input"
            type="text"
            placeholder="PASSWORD"
            v-model="localEmployee.password"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-key"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <label class="label">TOKEN RECOVERY</label>
        <div class="control has-icons-left">
          <input
            class="input"
            type="text"
            placeholder="PASSWORD"
            v-model="localEmployee.password"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-key"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <label class="label">FECHA DE BANEADO</label>
        <div class="control has-icons-left">
          <input
            class="input"
            type="text"
            placeholder="PASSWORD"
            v-model="localEmployee.password"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-key"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input
              type="checkbox"
              :checked="localEmployee.active"
              v-model="localEmployee.active"
            />
            USUARIO BANEADO
          </label>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-success">
            ACEPTAR
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="onCancel"
          >
            CANCEL
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'User',
  data() {
    return {
      localUser: {
        _id: null,
        email: null,
        phone: null,
        password: null,
        name: null,
        banned: null,
        bannedDate: null,
        tokenRecovery: null,
        userID: null,
        auxID: null,
      },
    };
  },
  mounted() {
    this.localEmployee = this.employee;
  },
  methods: {
    ...mapActions('employeesStore', ['postEmployee', 'putEmployee']),
    newLine() {
      return {
        work_shift: 1,
        interval: 0,
        start_time: '10:00',
        end_time: '18:00',
        random_start: 10,
        random_end: 10,
        max: 500,
        active: true,
      };
    },
    addNewLine() {
      let s = {
        work_shift: null,
        interval: 0,
        start_time: null,
        end_time: null,
        random_start: null,
        random_end: null,
        max: null,
        active: null,
      };
      s = new this.newLine();
      this.localEmployee.schedule.push(s);
    },
    onSubmit() {
      if (this.localEmployee._id === null) {
        this.postEmployee(this.localEmployee).then(() => {
          this.$router.go(-1);
        });
      } else {
        this.putEmployee(this.localEmployee).then(() => {
          this.$router.go(-1);
        });
      }
    },
    onCancel() {
      this.$router.go(-1);
    },
    deleteSche(index) {
      this.localEmployee.schedule.splice(index, 1);
    },
    change(val) {
      console.log(val);
      // this.text = val ? 'Right' : 'Wrong';
    },
  },
  computed: {
    ...mapState('employeesStore', ['employee']),
  },
};
</script>
