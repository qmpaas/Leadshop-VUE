import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import moment from 'moment';
import hView from './lib/index.js';
import Heshop from './leadshop/index.js';
import './lib/umy-ui.js';

Vue.use(Heshop);
Vue.use(hView);

import './lib/element.js';
import './lib/leadshop.js';
import './lib/http.js';
import './lib/lodash.js';
import pictureDialog from './pages/gallery/pictureDialog';
import videoDialog from './pages/gallery/videoDialog';

Vue.component('pictureDialog', pictureDialog);
Vue.component('videoDialog', videoDialog);

Vue.config.productionTip = false;

Vue.prototype.$moment = moment;

Vue.prototype.$_W = $_W;

Vue.prototype.$heshop = Heshop.connect($_W);

const app = new Vue({
  router,
  store,
  render: h => h(App)
});

/**
 * 处理插件信息处理
 * @param  {[type]} name  [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
Vue.prototype.$manifest = (name, value = null) => {
  if (name) {
    let store = app.$store.getters['plugins/manifest'](name);
    if (value) {
      let array = value.split('.');
      for (let index in array) {
        let key = array[index];
        if (store[key]) {
          store = store[key];
        } else {
          store = false;
        }
      }
    }
    return store;
  } else {
    return false;
  }
};

app.$mount('#app');
