export default {
  namespaced: true,
  state: {
    userInfo: {},
    access_token: '',
    refresh_token: ''
  },
  mutations: {
    login(state, provider) {
      if (provider) {
        state.is_login = true;
        state.access_token = provider.access_token || '';
        state.refresh_token = provider.refresh_token || '';
        state.userInfo = provider;
      } else {
        state.access_token = provider.access_token || '';
        state.refresh_token = '';
        state.is_login = false;
        state.userInfo = {};
      }
    },
    logout() {}
  },
  actions: {}
};
