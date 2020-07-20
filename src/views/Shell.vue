<template>
  <div>
    <div class="columns">
      <div class="column">
        <b-field label="CIUDAD">
          <b-select
            placeholder="Select a name"
            v-model="sectorLocal.cityID"
            @change.native="selectCity($event)"
          >
            <option
              v-for="option in cities"
              :value="option.cityID"
              :key="option.id"
            >
              {{ option.city }}
            </option>
          </b-select>
        </b-field>

        <b-field label="PLAYA">
          <b-select
            placeholder="Select a name"
            v-model="sectorLocal.beachID"
            @change.native="selectBeach($event)"
          >
            <option
              v-for="option in beaches"
              :value="option.beachID"
              :key="option.id"
            >
              {{ option.beach }}
            </option>
          </b-select>
        </b-field>

        <b-field label="SECTORS">
          <b-select
            placeholder="Select a name"
            v-model="sectorLocal.sectorID"
            @change.native="selectSector($event)"
          >
            <option
              v-for="option in sectors"
              :value="option.sectorID"
              :key="option.id"
            >
              {{ option.sector }}
            </option>
          </b-select>
        </b-field>
      </div>
      <div class="column">
        <b-field label="ITEMS">
          <b-select
            placeholder="Select a name"
            v-model="sectorLocal.typeID"
            @change.native="selectItem($event)"
          >
            <option
              v-for="option in items"
              :value="option.typeID"
              :key="option.id"
            >
              {{ option.type }}
            </option>
          </b-select>
        </b-field>
        <b-field label="TYPE">
          <b-input type="text" v-model="type">{{ type }} </b-input>
        </b-field>

        <b-field label="FECHA DESDE">
          <b-datepicker
            placeholder="Type or select a date..."
            icon="calendar-today"
            editable
            v-model="dateFrom"
          >
          </b-datepicker>
        </b-field>
        <b-field label="FECHA HASTA">
          <b-datepicker
            placeholder="Type or select a date..."
            icon="calendar-today"
            editable
            v-model="dateTo"
          >
          </b-datepicker>
        </b-field>

        <b-field label="USUARIO">
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

        <b-field label="PRECIO">
          <b-input type="number" v-model="price"></b-input>
        </b-field>

        <b-field label="CANTIDAD">
          <b-input type="number" v-model="quantity"></b-input>
        </b-field>

        <b-field>
          <b-button @click="addTickets" type="is-primary" expanded
            >CREAR RESERVAS</b-button
          >
        </b-field>
        <b-message
          title="CORRECTO"
          type="is-success"
          aria-close-label="Close message"
          v-if="correct"
        >
          Tickets creados con exito
        </b-message>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import dayjs from 'dayjs';

export default {
  name: 'shell',

  data() {
    return {
      dateFrom: new Date(),
      dateTo: new Date(),
      date: '',
      userID: '',
      phone: '',
      ticketID: '',
      canceled: false,
      payed: true,
      detail: {
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
      cities: [],
      beaches: [],
      sectors: [],
      sectorLocal: {
        cityID: 0,
        city: '',
        beachID: 0,
        beach: '',
        sectorID: 0,
        sector: '',
        typeID: 0,
        type: '',
      },
      items: [],
      type: '1a Y 2a LINEA. 2 HAMACAS + 1 SOMBRILLA',
      price: 0,
      quantity: 0,
      correct: false,
    };
  },

  async mounted() {
    try {
      this.cities = await this.getCities();
      this.beaches = await this.getBeaches(this.sectorLocal.cityID);
      this.sectors = await this.getSectors({
        cityID: this.sectorLocal.cityID,
        beachID: this.sectorLocal.beachID,
      });

      this.sectorLocal.sectorID = this.sectors[0].sectorID;
      let i = await this.getSector({
        cityID: this.sectorLocal.cityID,
        beachID: this.sectorLocal.beachID,
        sectorID: this.sectorLocal.sectorID,
      });
      this.items = i.items;
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    ...mapActions('worksStore', [
      'getCities',
      'getBeaches',
      'getSectors',
      'getSector',
    ]),

    ...mapActions('userStore', ['postMultiCart']),

    async selectCity(e) {
      this.sectorLocal.city = this.cities[e.target.selectedIndex].city;
      this.beaches = await this.getBeaches(this.sectorLocal.cityID);
      this.sectors = await this.getSectors({
        cityID: this.sectorLocal.cityID,
        beachID: this.sectorLocal.beachID,
      });
    },
    async selectBeach(e) {
      this.sectorLocal.beach = this.beaches[e.target.selectedIndex].beach;
      this.sectors = await this.getSectors({
        cityID: this.sectorLocal.cityID,
        beachID: this.sectorLocal.beachID,
      });
    },

    async selectSector(e) {
      this.sectorLocal.sector = this.sectors[e.target.selectedIndex].sector;
      let i = await this.getSector({
        cityID: this.sectorLocal.cityID,
        beachID: this.sectorLocal.beachID,
        sectorID: this.sectorLocal.sectorID,
      });
      this.items = i.items;
    },

    selectItem(e) {
      this.type = this.items[e.target.selectedIndex].type;
      this.price = this.items[e.target.selectedIndex].price;
    },

    addTickets() {
      let payload = {
        dateFrom: dayjs(this.dateFrom).format('YYYY-MM-DD'),
        dateTo: dayjs(this.dateTo).format('YYYY-MM-DD'),
        date: '',
        userID: this.userID,
        phone: this.userID,
        ticketID: 0,
        canceled: this.canceled,
        payed: this.payed,
        detail: [
          {
            date: '',
            cityID: this.sectorLocal.cityID,
            city: this.sectorLocal.city,
            beachID: this.sectorLocal.beachID,
            beach: this.sectorLocal.beach,
            sectorID: this.sectorLocal.sectorID,
            sector: this.sectorLocal.sector,
            typeID: this.sectorLocal.typeID,
            type: this.type,
            itemID: null,
            quantity: this.quantity,
            price: this.price,
            codeID: null,
            used: false,
            dateTimeUsed: null,
          },
        ],
      };

      this.postMultiCart(payload).then(() => {
        this.correct = true;
      });
    },
  },
};
</script>

<style scoped></style>
