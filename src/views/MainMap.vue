<template>
  <div style="width: 100%; height: 100%">
    <info-alerts :step="step"/>
    <div ref="map" id="map"></div>
    <map-actions
      :step="step"
      @set-origin-point="setOriginPoint"
      @set-destination-point="setDestinationPoint"
      @set-passengers="setPassengers"
    />
    <trip-info v-if="step === 4" :distance="formatDistance" :duration="formatDuration" />
    <json-dialog v-model="jsonDialog" @get-route="getRoute" @close="step--" @change="json = $event"/>
    <info-dialog v-model="errorDialog" type="error" :text="error"/>
    <info-dialog v-model="warningDialog" type="warning" :text="warning"/>
    <v-overlay v-model="loading">
      <v-progress-circular indeterminate color="white"/>
    </v-overlay>
  </div>
</template>

<script>
import gmapsInit from '../utils/google-maps.js'
import store from '../store'
import InfoAlerts from '../components/InfoAlerts'
import InfoDialog from '../components/InfoDialog'
import JsonDialog from '../components/JsonDialog'
import TripInfo from '../components/TripInfo'
import MapActions from '../components/MapActions'
import { PASSENGERS } from '../mock'

export default {
  name: 'MainMap',

  components: {
    MapActions,
    TripInfo,
    JsonDialog,
    InfoDialog,
    InfoAlerts
  },

  data: () => ({
    loading: false,
    jsonDialog: false,
    errorDialog: false,
    warningDialog: false,
    directionsRenderer: null,
    error: '',
    warning: '',
    step: 0,
    google: {},
    map: {},
    startingPoint: {},
    destinationPoint: {},
    markers: [],
    json: null,
    passengers: []
  }),

  async mounted () {
    try {
      this.google = await gmapsInit()
      this.geocoder = new this.google.maps.Geocoder()
      this.map = new this.google.maps.Map(this.$refs.map, {
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        mapId: '7e6fb15adbc750f2'
      })
      this.directionsRenderer = new this.google.maps.DirectionsRenderer()
      this.geocoder.geocode({ address: 'Istanbul' }, (results, status) => {
        if (status !== 'OK' || !results[0]) {
          throw new Error(status)
        }
        this.map.setCenter(results[0].geometry.location)
        this.map.fitBounds(results[0].geometry.viewport)
      })
    } catch (error) {
      this.error = error
      this.errorDialog = true
    }
  },

  computed: {
    formatDuration () {
      return this.secondsToHM(store.getters.totalDuration)
    },

    formatDistance () {
      return Math.round((store.getters.totalDistance / 1000) * 10) / 10 + ' km'
    }
  },

  methods: {
    reset () {
      this.directionsRenderer.setMap(null)
      this.clearMarkers(this.markers)
      this.markers = []
      this.step = 0
    },

    clearMarkers (markers) {
      markers.forEach(marker => {
        marker.setMap(null)
      })
    },

    getRoute () {
      this.loading = true
      this.jsonDialog = false
      this.getPassengers()
        .then(passengers => {
          this.loading = false
          this.passengers = passengers
          this.step++

          this.getRouteWithWayPoints(this.startingPoint, this.destinationPoint, this.passengers)
            .then((data) => {
              let warn = ''
              if (data.totalDuration / 60 / 60 > 2) {
                warn += 'Route duration is more than 2 hours<br />'
              }
              if (data.enrichedPassengers.length > 9) {
                warn += 'You have more than 9 passengers<br />'
              }
              this.warning = warn
              this.warningDialog = !!warn
              store.dispatch('setEnrichedPassengers', data.enrichedPassengers)
              store.dispatch('setTotalDistance', data.totalDistance)
              store.dispatch('setTotalDuration', data.totalDuration)
              store.dispatch('setRouteReady', true)
            })
            .catch(error => {
              this.reset()
              this.error = error
              this.errorDialog = true
            })

          this.geocoder.geocode({ location: this.startingPoint }, (results, status) => {
            if (status !== 'OK' || !results[0]) {
              throw new Error(status)
            }
            store.dispatch('setOriginPoint', results[0].formatted_address)
          })
          this.geocoder.geocode({ location: this.destinationPoint }, (results, status) => {
            if (status !== 'OK' || !results[0]) {
              throw new Error(status)
            }
            store.dispatch('setDestinationPoint', results[0].formatted_address)
          })
        })
    },

    setPassengers () {
      this.jsonDialog = true
      this.step++
    },

    // Simulate Asynchronous API call
    getPassengers () {
      return new Promise(resolve => {
        const passengers = this.json && Object.values(this.json).map(val => val)
        setTimeout(() => {
          resolve(passengers || PASSENGERS)
        }, 1000)
      })
    },

    setDestinationPoint () {
      this.originMarker.setDraggable(false)
      const infoWindow = new this.google.maps.InfoWindow()
      this.destinationMarker = new this.google.maps.Marker({
        position: this.map.getCenter(),
        draggable: true,
        map: this.map,
        title: 'Destination',
        label: {
          text: 'B',
          color: 'white'
        }
      })

      this.destinationPoint.lat = this.destinationMarker.getPosition().lat()
      this.destinationPoint.lng = this.destinationMarker.getPosition().lng()

      this.google.maps.event.addListener(this.destinationMarker, 'click', () => {
        infoWindow.setContent('Destination')
        infoWindow.open(this.map, this.destinationMarker)
      })
      this.google.maps.event.addListener(this.destinationMarker, 'drag', (e) => {
        this.destinationPoint = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
      })
      this.step++
      this.markers.push(this.destinationMarker)
    },

    setOriginPoint () {
      this.reset()
      const infoWindow = new this.google.maps.InfoWindow()
      this.originMarker = new this.google.maps.Marker({
        position: this.map.getCenter(),
        draggable: true,
        map: this.map,
        title: 'Origin',
        label: {
          text: 'A',
          color: 'white'
        }
      })

      this.startingPoint.lat = this.originMarker.getPosition().lat()
      this.startingPoint.lng = this.originMarker.getPosition().lng()

      this.google.maps.event.addListener(this.originMarker, 'click', () => {
        infoWindow.setContent('Origin')
        infoWindow.open(this.map, this.originMarker)
      })
      this.google.maps.event.addListener(this.originMarker, 'drag', (e) => {
        this.startingPoint = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
      })

      this.markers.push(this.originMarker)
      this.step = 1
    },

    passedTime (legs, index) {
      let total = 0
      const slicedLegs = legs.slice(0, index)
      slicedLegs.forEach(leg => {
        total += leg.duration.value
      })
      return total
    },

    secondsToHM (d) {
      d = Number(d)
      const h = Math.floor(d / 3600)
      const m = Math.floor(d % 3600 / 60)

      const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : ''
      const mDisplay = m > 0 ? m + (m === 1 ? ' minute ' : ' minutes ') : ''
      return hDisplay + mDisplay
    },

    getTotalDuration (legs) {
      let total = 0
      legs.forEach(leg => {
        total += leg.duration.value
      })
      return total
    },

    getTotalDistance (legs) {
      let total = 0
      legs.forEach(leg => {
        total += leg.distance.value
      })
      return total
    },

    sortedPickUpPoints (passengers, sorted) {
      const final = []
      for (let i = 0; i < passengers.length; i++) {
        const index = sorted[i]
        final.push({
          ...passengers[index],
          pickUpPointOrder: i + 1
        })
      }
      return final
    },

    getRouteWithWayPoints (origin, destination, passengers) {
      return new Promise((resolve, reject) => {
        const directionsService = new this.google.maps.DirectionsService()
        this.directionsRenderer.setMap(this.map)
        let enrichedPassengers = passengers

        const waypoints = []
        enrichedPassengers.forEach(passenger => {
          waypoints.push({
            location: passenger.pickUpPoint,
            stopover: true
          })
        })

        directionsService.route({
          origin,
          destination,
          waypoints,
          optimizeWaypoints: true,
          travelMode: 'DRIVING'
        },
        (response, status) => {
          if (status === 'OK') {
            this.directionsRenderer.setOptions({
              suppressInfoWindows: true,
              suppressMarkers: true
            })
            const route = response.routes[0]
            const totalDuration = this.getTotalDuration(route.legs)
            const totalDistance = this.getTotalDistance(route.legs)
            this.directionsRenderer.setDirections(response)
            const infoWindow = new this.google.maps.InfoWindow()
            enrichedPassengers = this.sortedPickUpPoints(this.passengers, response.routes[0].waypoint_order)
            enrichedPassengers.forEach((passenger, index) => {
              const marker = new this.google.maps.Marker({
                position: passenger.pickUpPoint,
                map: this.map,
                title: passenger.name,
                label: {
                  text: `${passenger.pickUpPointOrder}`,
                  color: 'white'
                }
              })
              this.markers.push(marker)
              enrichedPassengers[index].duration = Math.round(totalDuration - this.passedTime(route.legs, index + 1))
              this.google.maps.event.addListener(marker, 'click', () => {
                infoWindow.setContent(`
                <strong>${passenger.name}</strong><br/>
                <p>${this.secondsToHM(passenger.duration)}</p>`)
                infoWindow.open(this.map, marker)
              })
            })
            resolve({ enrichedPassengers, totalDistance, totalDuration })
          } else {
            reject(new Error('Directions request failed due to ' + status))
          }
        })
      })
    }
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  min-height: calc(100% - 57px);
}
</style>
