'use strict';

/**
 * app-role controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::app-role.app-role', ({ strapi }) => ({
  async validateToken(ctx) {
    try {
      const token = ctx.request.header['x-access-token'];
      const role = await strapi.service('api::app-role.role-auth').validateToken(token);
      
      return {
        valid: true,
        role: {
          id: role.id,
          type: role.type,
          permissions: role.permissions,
          customer: {
            id: role.customer.id,
            name: role.customer.name,
            code: role.customer.code
          }
        }
      };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async refreshToken(ctx) {
    try {
      const { id } = ctx.params;
      const role = await strapi.service('api::app-role.role-auth').refreshToken(id);
      
      return {
        accessToken: role.accessToken
      };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  }
}));
