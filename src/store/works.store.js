import Vue from 'vue';

export default {
  namespaced: true,
  strict: true,
  state: {
    stateSector: [],
    sectors: [],
    cities: [],
    beaches: [],
    dateActual: null,
    cityActual: null,
    beachActual: null,
    sectorActual: null,
    sectorIDActual: 1,
    typeIDActual: 9,
    group: null,
  },
  mutations: {
    setStateSector(state, payload) {
      state.stateSector = payload;
    },
    resetStateSector(state) {
      state.stateSector = [];
    },
    setSectors(state, payload) {
      state.sectors = payload;
    },
    resetSectors(state) {
      state.sectors = [];
    },
    setBeaches(state, payload) {
      state.beaches = payload;
    },
    resetBeaches(state) {
      state.beaches = [];
    },
    setBeachActual(state, payload) {
      state.beachActual = payload;
    },
    resetBeachActual(state) {
      state.beachActual = null;
    },
    setSectorActual(state, payload) {
      state.sectorActual = payload;
    },
    resetSectorActual(state) {
      state.sectorActual = null;
    },
    setSectorIDActual(state, payload) {
      state.sectorIDActual = payload;
    },
    resetSectorIDActual(state) {
      state.sectorIDActual = null;
    },
    setDateActual(state, payload) {
      state.dateActual = payload;
    },
    resetDateActual(state) {
      state.dateActual = null;
    },
    getCities(state, payload) {
      state.cities = payload;
    },
    setCityActual(state, payload) {
      state.cityActual = payload;
    },
    resetCityActual(state) {
      state.cityActual = null;
    },
    setTypeIDActual(state, payload) {
      state.typeIDActual = payload;
    },
    resetTypeIDActual(state) {
      state.typeIDActual = null;
    },
    setGroup(state, payload) {
      state.group = payload;
    },
    resetGroup(state) {
      state.group = null;
    },
  },
  actions: {
    async postItems(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: 'items',
          data: payload,
        });
        if (data) {
          return true;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async putItem(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'put',
          url: 'item',
          data: payload,
          params: {
            id: payload._id,
          },
        });
        if (data.data) {
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async putItems(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'put',
          url: 'items',
          data: payload,
        });
        if (data.data) {
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getItems(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'items',
          params: {
            cityID: payload.cityID,
            beachID: payload.beachID,
            sectorID: payload.sectorID,
          },
        });
        if (data.data) {
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getCities({ commit }) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'cities',
        });

        if (data.data) {
          await commit('getCities', data.data);
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getSector({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'sector',
          params: {
            cityID: payload.cityID,
            beachID: payload.beachID,
            sectorID: payload.sectorID,
          },
        });

        if (data.data) {
          await commit('setSectorActual', data.data);
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getSectors({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'sectors',
          params: {
            cityID: payload.cityID,
            beachID: payload.beachID,
          },
        });
        if (data.data) {
          commit('setSectors', data.data);
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getStateSector({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'state',
          params: {
            cityID: payload.cityID,
            beachID: payload.beachID,
            sectorID: payload.sectorID,
            typeID: payload.typeID,
            date: payload.date,
          },
        });
        if (data.data) {
          await commit('setStateSector', data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getBeaches({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'beaches',
          params: {
            cityID: payload,
          },
        });
        if (data.data) {
          commit('setBeaches', data.data);
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getStateSectorItems(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'statesectoritems',
          params: {
            cityID: payload.cityID,
            beachID: payload.beachID,
            sectorID: payload.sectorID,
            typeID: payload.typeID,
            date: payload.date,
          },
        });
        if (data.data) {
          // await commit('setStateSector', data.data);
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getInvoices(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'alldetailday',
          params: {
            datefrom: payload.dateFrom,
            dateto: payload.dateTo,
          },
        });
        if (data.data) {
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getCash(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'allcashday',
          params: {
            datefrom: payload.dateFrom,
            dateto: payload.dateTo,
          },
        });
        if (data.data) {
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {},
};
