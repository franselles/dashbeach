<template>
  <div>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="#" @click="back"
            ><b-icon icon="arrow-left-thick"></b-icon> VOLVER</a
          >
        </li>
        <li>{{ employee.name }}</li>
        <li>
          <a href="#" @click="logout"
            ><b-icon icon="home-circle"></b-icon> SALIR DE LA APP</a
          >
        </li>
      </ul>
    </nav>
    <b-field label="TELEFONO MOVIL CLIENTE">
      <b-input
        type="number"
        min="0"
        placeholder="123456789"
        oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
        maxlength="9"
        v-model="userID"
        required
      ></b-input>
    </b-field>
    <b-field label="REPETIR TELEFONO">
      <b-input
        type="number"
        min="0"
        placeholder="123456789"
        oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
        maxlength="9"
        v-model="userID2"
        required
      ></b-input>
    </b-field>
    <b-field>
      <div>
        <p class="title is-4">
          RESERVA DE HAMACAS
        </p>
      </div>
    </b-field>
    <b-field>
      <div>
        FECHA TICKET:
        <span class="has-text-weight-bold"
          >{{ formatDate(cartLocal.date) }}
        </span>
      </div>
    </b-field>
    <b-field>
      <div>
        TICKET:
        <span class="has-text-weight-bold">{{ cartLocal.ticketID }} </span>
      </div>
    </b-field>
    <b-field>
      <div>
        USUARIO:<span class="has-text-weight-bold">
          {{ cartLocal.userID }}</span
        >
      </div>
    </b-field>
    <b-field>
      <div>
        TELEFONO:<span class="has-text-weight-bold">
          {{ cartLocal.phone }}</span
        >
      </div>
    </b-field>

    <b-field>
      <table class="table is-striped">
        <thead>
          <tr>
            <th class="is-size-7">#</th>
            <th class="is-size-7">FECHA</th>
            <th class="is-size-7">SECT</th>
            <th class="is-size-7">ID</th>
            <th class="is-size-7">ITEM</th>
            <th class="is-size-7">CDAD</th>
            <th class="is-size-7">PRECIO</th>
            <th class="is-size-7">TOTAL</th>

            <th class="is-size-7"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cartLocal.detail" :key="item.index">
            <td class="is-size-7">{{ index + 1 }}</td>
            <td class="is-size-7">{{ formatDate(item.date) }}</td>
            <td class="is-size-7">{{ item.sectorID }}</td>
            <td class="is-size-7">{{ item.typeID }}</td>
            <td class="is-size-7">{{ item.type }}</td>
            <td class="is-size-7">{{ item.quantity }}</td>
            <td class="is-size-7">{{ item.price }} €</td>
            <td class="is-size-7">{{ calcTotalDetail(item) }} €</td>
            <td class="is-size-7" @click="removeItem(index)">
              <b-button type="is-danger" icon-right="delete" size="is-small" />
            </td>
          </tr>
        </tbody>
      </table>
    </b-field>
    <b-field>
      <div>
        IMPORTE TOTAL:<span class="has-text-weight-bold"> {{ total }} €</span>
      </div>
    </b-field>
    <b-field class="is-size-7">
      TODOS LOS PRECIOS CON EL I.V.A. INCLUIDO
    </b-field>

    <div class="buttons">
      <b-button
        icon-left="shopping"
        type="is-success"
        @click="purchase2"
        :disabled="!purchased"
        >ALQUILAR</b-button
      >
      <b-button type="is-danger" @click="cancel">CANCELAR</b-button>
    </div>
    <article class="message is-danger" v-if="detailDuplicated.length > 0">
      <div class="message-header">
        <p>ELEMENTOS NO DISPONIBLES</p>
      </div>
      <div class="message-body">
        <p>SE RETIRAN DE LAS RESERVAS</p>
        <table class="table is-striped">
          <thead>
            <tr>
              <th class="is-size-7">#</th>
              <th class="is-size-7">FECHA</th>
              <th class="is-size-7">SECT</th>
              <th class="is-size-7">ID</th>
              <th class="is-size-7">ITEM</th>
              <th class="is-size-7">CDAD</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in detailDuplicated" :key="item.index">
              <td class="is-size-7">{{ index + 1 }}</td>
              <td class="is-size-7">{{ formatDate(item.date) }}</td>
              <td class="is-size-7">{{ item.sectorID }}</td>
              <td class="is-size-7">{{ item.typeID }}</td>
              <td class="is-size-7">{{ item.type }}</td>
              <td class="is-size-7">{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapState, mapActions, mapMutations } from 'vuex';
export default {
  name: 'cart',
  data() {
    return {
      cartLocal: {
        date: null,
        userID: null,
        phone: null,
        ticketID: null,
        canceled: false,
        payed: false,
        detail: [],
      },
      total: 0,
      detailDuplicated: [],
      userID: '',
      userID2: '',
    };
  },

  mounted() {
    this.cartLocal = this.cart;
    this.calcTotal();
  },

  methods: {
    ...mapActions('userStore', [
      'postCart',
      'getTicketNumber',
      'checkAvaiability',
    ]),
    ...mapMutations('userStore', ['setCart', 'resetCart']),

    cancel() {
      this.$router.go(-1);
    },

    purchase() {
      this.cartLocal.userID = this.userID;
      this.cartLocal.phone = this.userID;
      // this.getTicketNumber({ date: this.cartLocal.date }).then(result => {
      this.getTicketNumber().then(result => {
        // this.cartLocal.ticketID = (
        //   this.cartLocal.date + ('00000' + result).slice(-5)
        // ).replace(/-/g, '');
        this.cartLocal.ticketID = ('00000000' + result).slice(-8);

        this.checkAvaiability(this.cartLocal).then(result => {
          if (result.length > 0) {
            for (const r of result) {
              this.detailDuplicated.push({
                date: r.date,
                sectorID: r.sectorID,
                typeID: r.typeID,
                quantity: r.excess,
              });

              let i = this.cartLocal.detail.findIndex(item => {
                return (
                  item.cityID == r.cityID &&
                  item.beachID == r.beachID &&
                  item.sectorID == r.sectorID &&
                  item.typeID == r.typeID
                );
              });

              this.cartLocal.detail[i].quantity -= r.excess;

              if (this.cartLocal.detail[i].quantity == 0) {
                this.removeItem(i);
              }
            }
          } else {
            this.postCart(this.cartLocal).then(result => {
              if (result === true) {
                setTimeout(() => {
                  this.resetCart();
                  this.$router.replace({ name: 'citybeaches' });
                }, 2000);
              }
            });
          }
        });
      });
    },

    purchase2() {
      this.cartLocal.userID = this.userID;
      this.cartLocal.phone = this.userID;
      // this.getTicketNumber({ date: this.cartLocal.date }).then(result => {
      // this.cartLocal.ticketID = (
      //   this.cartLocal.date + ('00000' + result).slice(-5)
      // ).replace(/-/g, '');
      // this.cartLocal.ticketID = ('00000000' + result).slice(-8);

      this.postCart(this.cartLocal).then(result => {
        if (result === true) {
          setTimeout(() => {
            this.resetCart();
            this.$router.replace({ name: 'citybeaches' });
          }, 2000);
        } else {
          if (result.length > 0) {
            for (const r of result) {
              this.detailDuplicated.push({
                date: r.date,
                sectorID: r.sectorID,
                typeID: r.typeID,
                quantity: r.excess,
              });

              let i = this.cartLocal.detail.findIndex(item => {
                return (
                  item.cityID == r.cityID &&
                  item.beachID == r.beachID &&
                  item.sectorID == r.sectorID &&
                  item.typeID == r.typeID
                );
              });

              this.cartLocal.detail[i].quantity -= r.excess;

              if (this.cartLocal.detail[i].quantity == 0) {
                this.removeItem(i);
              }
            }
          }
        }
      });
    },

    formatDate(date) {
      return dayjs(date).format('DD-MM-YY');
    },

    removeItem(i) {
      this.cartLocal.detail.splice(i, 1);
      this.resetCart();
      this.setCart(this.cartLocal);

      this.calcTotal();
    },

    calcTotal() {
      this.total = 0;
      this.cartLocal.detail.forEach(element => {
        this.total += element.price * element.quantity;
      });
    },

    calcTotalDetail(item) {
      return item.quantity * item.price;
    },

    back() {
      this.$router.go(-1);
    },

    logout() {
      this.$router.replace({ name: 'login' });
    },
  },

  computed: {
    ...mapState('userStore', ['cart', 'employee']),

    purchased: function() {
      return (
        this.cartLocal.detail.length > 0 &&
        this.userID.length == 9 &&
        this.samePhone
      );
    },

    samePhone: function() {
      return this.userID == this.userID2;
    },
  },
};
</script>

<style scoped></style>
