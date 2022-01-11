import { createApp } from 'vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import store from './store';
import App from './App';
import './registerServiceWorker';
import router from './router';

loadFonts();

createApp(App).use(router).use(store).use(vuetify).mount('#app');
