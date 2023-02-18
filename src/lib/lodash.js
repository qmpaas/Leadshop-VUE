'use strict';

import Vue from 'vue';
import lodash from 'lodash';

lodash.install = function (Vue) {
  Vue.lodash = lodash;
  window.lodash = lodash;
  Object.defineProperties(Vue.prototype, {
    _: {
      get() {
        return lodash;
      }
    },
    $_: {
      get() {
        return lodash;
      }
    }
  });
};

Vue.use(lodash);

export default lodash;
