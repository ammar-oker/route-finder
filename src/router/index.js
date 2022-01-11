import { createRouter, createWebHistory } from 'vue-router';
import MainMap from '../views/MainMap';
import PassengersTable from '../views/PassengersTable';
import RouteDetails from '../views/RouteDetails';

const routes = [
  {
    path: '/',
    name: 'Map',
    component: MainMap,
  },
  {
    path: '/passengers',
    name: 'Passengers',
    component: PassengersTable,
  },
  {
    path: '/details',
    name: 'Details',
    component: RouteDetails,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
