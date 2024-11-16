export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/login',
      handler: 'auth.login',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/auth/verify',
      handler: 'auth.verify',
      config: {
        middlewares: ['api::auth.auth']
      }
    },
    {
      method: 'POST',
      path: '/auth/logout',
      handler: 'auth.logout',
      config: {
        middlewares: ['api::auth.auth']
      }
    }
  ]
};
