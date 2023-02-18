import Vue from 'vue';
import App from './App.vue';
import store from './../../store';
import './../../lib/element.js';
import Heshop from './../../leadshop/index.js';
Vue.prototype.$heshop = Heshop.connect($_W);
const app = new Vue({
  store,
  render: h => h(App)
});

app.$mount('#app');
