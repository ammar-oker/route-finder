import { createStore } from 'vuex';

export default createStore({
  state: {
    routeReady: false,
    totalDistance: 0,
    totalDuration: 0,
    enrichedPassengersInfo: [],
    originPoint: '',
    destinationPoint: '',
  },

  mutations: {
    SET_ROUTE_READY(state, value) {
      state.routeReady = value;
    },
    SET_TOTAL_DISTANCE(state, value) {
      state.totalDistance = value;
    },
    SET_TOTAL_DURATION(state, value) {
      state.totalDuration = value;
    },
    SET_ENRICHED_PASSENGERS(state, value) {
      state.enrichedPassengersInfo = value;
    },
    SET_ORIGIN_POINT(state, value) {
      state.originPoint = value;
    },
    SET_DESTINATION_POINT(state, value) {
      state.destinationPoint = value;
    },
  },

  actions: {
    setRouteReady({ commit }, value) {
      commit('SET_ROUTE_READY', value);
    },
    setTotalDistance({ commit }, value) {
      commit('SET_TOTAL_DISTANCE', value);
    },
    setTotalDuration({ commit }, value) {
      commit('SET_TOTAL_DURATION', value);
    },
    setEnrichedPassengers({ commit }, value) {
      commit('SET_ENRICHED_PASSENGERS', value);
    },
    setOriginPoint({ commit }, value) {
      commit('SET_ORIGIN_POINT', value);
    },
    setDestinationPoint({ commit }, value) {
      commit('SET_DESTINATION_POINT', value);
    },
  },


  modules: {},
});
