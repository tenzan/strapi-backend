'use strict';

/**
 * `customer-context` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.state.user) {
      // Skip for admin routes
      if (ctx.url.startsWith('/admin')) {
        return await next();
      }

      // Get customer from user JWT or header
      const customerId = ctx.state.user.customer || ctx.request.header['x-customer-id'];

      if (customerId) {
        // Add customer filter to query
        if (!ctx.query.filters) {
          ctx.query.filters = {};
        }
        ctx.query.filters.customer = customerId;

        // Store customer in state for later use
        ctx.state.customer = customerId;
      }
    }

    await next();
  };
};
