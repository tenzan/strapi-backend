'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/local',
      handler: 'auth.login',
      config: {
        auth: false,
      }
    },
    {
      method: 'GET',
      path: '/auth/me',
      handler: 'auth.me',
      config: {
        policies: ['global::is-authenticated']
      }
    }
  ]
};
