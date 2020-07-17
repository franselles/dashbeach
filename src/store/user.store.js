import Vue from 'vue';

export default {
  namespaced: true,
  strict: true,
  state: {
    logged: false,
    cart: null,
    carts: [],
    user: null,
    employee: null,
    cartDetail: [],
  },
  mutations: {
    /**
     * Mutation datos del carrito (reserva)
     * @param {Object} payload Objeto con datos ticket(userID, date) y detail (sectorID, col, row, ...)
     */
    setCartDetail(state, payload) {
      // function newLine() {
      //   return {
      //     typeID: '',
      //     type: '',
      //     price: 0,
      //     quantity: 0,
      //   };
      // }

      payload.forEach(item => {
        // let n = new newLine();

        let n = {
          typeID: item.typeID,
          type: item.type,
          price: item.price,
          available: item.available,
          quantity: 0,
        };
        state.cartDetail.push(n);
      });
    },
    resetCartDetail(state) {
      state.cartDetail = [];
    },
    updateAddCartDetail(state, payload) {
      if (
        state.cartDetail[payload].available <=
        state.cartDetail[payload].quantity
      )
        return;
      state.cartDetail[payload].quantity += 1;
    },
    updateRemoveCartDetail(state, payload) {
      if (state.cartDetail[payload].quantity == 0) return;
      state.cartDetail[payload].quantity += -1;
    },
    /** Mutation si estamos logeados */
    setLogged(state) {
      state.logged = true;
    },
    setLogout(state) {
      state.logged = false;
    },
    /**
     * Mutation datos del usuario
     * @param {Object} payload Objeto con datos user (userID, phone, name, ...)
     */
    setUser(state, payload) {
      state.user = payload;
    },
    resetUser(state) {
      state.user = null;
    },
    /**
     * Mutation datos del usuario
     * @param {Object} payload Objeto con datos user (userID, phone, name, ...)
     */
    setEmployee(state, payload) {
      state.employee = payload;
    },
    resetEmployee(state) {
      state.employee = null;
    },
    /**
     * Mutation datos del carrito (reserva)
     * @param {Object} payload Objeto con datos ticket(userID, date) y detail (sectorID, col, row, ...)
     */
    setCart(state, payload) {
      state.cart = payload;
    },
    resetCart(state) {
      state.cart = null;
    },
    /**
     * Mutation datos de los carritos del usuario
     * @param {Array} payload Array de objetos de carritos tickets incluido detail
     */
    setCarts(state, payload) {
      state.carts = payload;
    },
    resetCarts(state) {
      state.cart = [];
    },
  },
  actions: {
    /**
     * Obtiene todos los carts (reservas) de un usuario
     * @param {Object} payload
     */
    async getCarts({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'carts',
          params: {
            userID: payload.userID,
          },
        });
        if (data.data) {
          commit('setCarts', data.data);
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Obtiene detalle de las reservas de un usuario
     * desde una fecha para QR. Dia actual
     * @param {Object} payload userID y date
     */
    async getCartsDetail(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'detailday',
          params: {
            userID: payload.userID,
            date: payload.date,
          },
        });
        if (data.data) {
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async checkCart(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: 'checkcart',
          data: payload,
        });

        return data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async postCart(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: 'cart',
          data: payload,
        });

        return data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getCategories(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'categories',
          params: {
            cityID: payload.cityID,
            beachID: payload.beachID,
            sectorID: payload.sectorID,
            date: payload.date,
          },
        });
        if (data.data) {
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async checkAvaiability(context, payload) {
      console.log(payload);
      try {
        const data = await Vue.axios({
          method: 'post',
          url: 'check',
          data: payload,
        });
        if (data.data) {
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async postUsed(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: 'used',
          data: payload,
        });

        return data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getUser({ commit, dispatch }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'user',
          params: {
            email: payload.email,
            password: payload.password,
          },
        });
        if (data.data) {
          await commit('setLogged');
          await commit('setUser', data.data);
          await dispatch('getCarts', { userID: data.data.userID });
          return true;
        }
      } catch (error) {
        return false;
      }
    },

    async postUser({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: 'user',
          data: payload,
        });

        if (data.data) {
          await commit('setLogged');
          await commit('setUser', data.data);
          return true;
        }
      } catch (error) {
        return false;
      }
    },

    async checkEmail(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'user/email',
          params: {
            email: payload.email,
          },
        });

        return data;
      } catch (error) {
        return false;
      }
    },

    async getItemUser(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'checkin',
          params: {
            id: payload.id,
          },
        });

        return data.data[0];
      } catch (error) {
        return 1;
      }
    },

    async getItemUserDetail(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'checkin/detail',
          params: {
            id: payload.id,
          },
        });

        return data.data[0];
      } catch (error) {
        return 1;
      }
    },

    async getTicketNumber() {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'tickets',
          // params: {
          //   date: payload.date,
          // },
        });

        return data.data[0].tickets + 1 || 1;
      } catch (error) {
        return 1;
      }
    },

    async checkServer() {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'cities',
        });

        if (data.data) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },

    async getEmployee({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'employee',
          params: {
            dni: payload.dni,
          },
        });

        if (data.data) {
          await commit('setLogged');
          await commit('setEmployee', data.data[0]);
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
  },
  getters: {},
};
