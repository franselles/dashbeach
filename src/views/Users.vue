<template>
  <section class="section">
    <div>
      <div class="level">
        <div class="level-left">
          <button class="button is-info" @click="newEmployee">
            <span class="icon">
              <i class="fas fa-user-plus"></i>
            </span>
            <span>NUEVO EMPLEADO</span>
          </button>
        </div>
      </div>
      <div class="level">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>NOMBRE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(employee, index) in employees" :key="employee._id">
              <th>{{ index + 1 }}</th>
              <td>{{ employee.name }}</td>
              <td>
                <button
                  class="button is-small is-link is-light"
                  @click="editEmployee(employee)"
                >
                  EDITAR
                </button>
                <button
                  class="button is-small is-warning is-light"
                  @click="worktimeDay(employee)"
                >
                  HISTORICO
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
  name: 'Users',
  data() {
    return {};
  },
  mounted() {
    this.resetEmployee();
    this.getEmployees();
  },
  methods: {
    ...mapActions('employeesStore', ['getEmployees']),
    ...mapMutations('employeesStore', [
      'resetEmployee',
      'setEmployee',
      'setFiltroWorktime',
    ]),
    editEmployee(data) {
      this.setEmployee(data);
      this.$router.push({ name: 'Employee' });
    },
    newEmployee() {
      this.resetEmployee();
      this.$router.push({ name: 'Employee' });
    },
    worktimeDay(data) {
      this.setEmployee(data);
      this.setFiltroWorktime(data._id);
      const path = '/worktime';
      if (this.$route.path !== path) this.$router.push(path);
      // this.$router.push({ name: 'Worktime' });
    },
  },
  computed: {
    ...mapState('employeesStore', ['employees']),
  },
};
</script>
