<template>
  <div style="width: 100%; height: 100%">
    <v-alert v-if="step === 0" dismissible class="alert" type="info">
      Click on <v-icon>mdi-directions</v-icon> button below to get started with new route
    </v-alert>
    <v-alert v-if="step === 1" dismissible class="alert" type="info">
      Drag the marker to origin point and click <v-icon>mdi-check</v-icon>
    </v-alert>
    <v-alert v-if="step === 2" dismissible class="alert" type="info">
      Drag the marker to destination point and click <v-icon>mdi-check</v-icon>
    </v-alert>
    <v-alert v-if="step === 4" dismissible class="alert" type="info">
      Click on any marker with number to get passenger's info
    </v-alert>
    <div ref="map" id="map"></div>
    <v-btn v-if="step === 0 || step === 4" fab large color="primary" class="fab" @click="setOriginPoint">
      <div>
        <v-icon>mdi-directions</v-icon>
        <br>
        <span v-if="step === 0" class="mt-2">GO</span>
        <span v-else class="mt-2">NEW</span>
      </div>
    </v-btn>
    <v-btn v-if="step === 1" fab large color="primary" class="fab" @click="setDestinationPoint">
      <v-icon>mdi-check</v-icon>
    </v-btn>
    <v-btn v-if="step === 2" fab large color="primary" class="fab" @click="setPassengers">
      <v-icon>mdi-check</v-icon>
    </v-btn>
    <v-card v-if="step === 4" class="trip-info">
      <v-card-text>
        <strong>Total distance </strong>
        {{ formatDistance }}
        <v-spacer class="my-2"/>
        <strong>Total duration </strong>
        {{ formatDuration }}
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Passengers array</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text @click="json = []">Clear</v-btn>
          </v-toolbar-items>
          <v-toolbar-items>
            <v-btn text @click="resetTextarea">Default</v-btn>
          </v-toolbar-items
          ><v-toolbar-items>
            <v-btn  @click="getRoute" color="white">
              <span style="color: #3883FA">Get route</span>
              <v-icon class="mx-2" style="color: #3883FA">mdi-directions</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="my-3 mx-4">
          <v-jsoneditor
            v-model="json"
            :options="options"
            style="height: calc(100vh - 100px)"
            :plus="true"
            @input="syntaxError = false"
            @error="syntaxError = true"
          />
          <v-snackbar
            v-model="snackbar"
            color="error"
          >
            Syntax Error
            <template v-slot:action="{ attrs }">
              <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="snackbar = false"
              >
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="errorDialog"
      max-width="400"
      @input="closeDialog"
    >
      <v-card>
        <v-card-title class="headline">
          <v-icon class="mr-2" color="error">
            mdi-alert-circle
          </v-icon>
          Error
        </v-card-title>

        <v-card-text>
          {{ error }}
        </v-card-text>

        <v-card-actions>
          <v-spacer/>

          <v-btn
            color="secondary"
            text
            @click="errorDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="warningDialog"
      max-width="400"
      @input="closeDialog"
    >
      <v-card>
        <v-card-title class="headline">
          <v-icon class="mr-2" color="warning">
            mdi-alert-circle
          </v-icon>
          Warning
        </v-card-title>

        <v-card-text v-html="warning" />

        <v-card-actions>
          <v-spacer/>

          <v-btn
            color="secondary"
            text
            @click="closeWarningDialog"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay v-model="loading">
      <v-progress-circular indeterminate color="white"/>
    </v-overlay>
  </div>
</template>

<script>
import gmapsInit from '@/utils/google-maps.js'
import VJsoneditor from 'v-jsoneditor'
import store from '@/store'

export default {

  name: 'Map',
  components: {
    VJsoneditor
  },
  data: () => ({
    options: {
      mode: 'code'
    },
    snackbar: false,
    loading: false,
    dialog: false,
    errorDialog: false,
    warningDialog: false,
    syntaxError: false,
    error: '',
    warning: '',
    step: 0,
    google: {},
    map: {},
    startingPoint: {},
    destinationPoint: {},
    markers: [],
    passengers: [],
    json: [
      {
        name: 'John Doe',
        pickUpPoint: {
          lat: 41.004,
          lng: 28.976
        }
      },
      {
        name: 'Mr. Potato',
        pickUpPoint: {
          lat: 41.009,
          lng: 28.96
        }
      },
      {
        name: 'Dr. Strange',
        pickUpPoint: {
          lat: 41.02,
          lng: 28.95
        }
      },
      {
        name: 'Andy Dufresne',
        pickUpPoint: {
          lat: 41.03,
          lng: 28.92
        }
      },
      {
        name: 'Bruce Wayne',
        pickUpPoint: {
          lat: 41.001,
          lng: 28.976
        }
      }
    ]
  }),

  async mounted () {
    try {
      this.google = await gmapsInit()
      this.geocoder = new this.google.maps.Geocoder()
      this.map = new this.google.maps.Map(this.$refs.map, {
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
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
    closeWarningDialog () {
      this.warningDialog = false
      this.warning = ''
    },
    reset () {
      this.directionsRenderer.setMap(null)
      this.clearMarkers(this.markers)
      this.markers = []
      this.step = 0
    },
    resetTextarea () {
      this.json = [
        {
          name: 'John Doe',
          pickUpPoint: {
            lat: 41.004,
            lng: 28.976
          }
        },
        {
          name: 'Mr. Potato',
          pickUpPoint: {
            lat: 41.009,
            lng: 28.96
          }
        },
        {
          name: 'Dr. Strange',
          pickUpPoint: {
            lat: 41.02,
            lng: 28.95
          }
        },
        {
          name: 'Andy Dufresne',
          pickUpPoint: {
            lat: 41.03,
            lng: 28.92
          }
        },
        {
          name: 'Bruce Wayne',
          pickUpPoint: {
            lat: 41.001,
            lng: 28.976
          }
        }
      ]
    },
    clearMarkers (markers) {
      markers.forEach(marker => {
        marker.setMap(null)
      })
    },
    closeDialog () {
      this.dialog = false
      this.step--
    },
    getRoute () {
      if (this.syntaxError) {
        this.snackbar = true
      } else {
        this.loading = true
        this.dialog = false
        this.getPassengers()
          .then(passengers => {
            this.loading = false
            this.passengers = passengers
            this.step++

            this.getRouteWithWayPoints(this.startingPoint, this.destinationPoint, this.passengers)
              .then((data) => {
                if (data.totalDuration / 60 / 60 > 2) {
                  this.warning += 'Route duration more than 2 hours<br />'
                  this.warningDialog = true
                }
                if (data.enrichedPassengers.length > 9) {
                  this.warning += 'You have more than 9 passengers<br />'
                  this.warningDialog = true
                }
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
      }
    },
    setPassengers () {
      this.dialog = true
      this.step++
    },
    // Simulate Asynchronous API call
    getPassengers () {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.json)
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
.fab {
  position: fixed !important;
  z-index: 2;
  top: calc(100% - 150px);
  right: 0;
  margin: 0 1.5em;
}

.alert {
  position: fixed !important;
  z-index: 2;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 2em);
  margin: 0.5em auto;
}

@media only screen and (min-width: 992px) {
  .alert {
    width: 50%;
  }
}

.trip-info {
  position: fixed;
  top: calc(100% - 150px);
  margin: 0 0.3em;
}
</style>
