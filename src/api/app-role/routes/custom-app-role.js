module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/app-roles/validate',
      handler: 'app-role.validateToken',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/app-roles/:id/refresh-token',
      handler: 'app-role.refreshToken',
      config: {
        auth: false
      }
    }
  ]
};
