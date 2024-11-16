'use strict';

const { ValidationError } = require('@strapi/utils').errors;

/**
 * auth controller
 */

module.exports = {
  async login(ctx) {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Find the user
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email },
      populate: ['role', 'customer']
    });

    if (!user) {
      throw new ValidationError('Invalid credentials');
    }

    const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
      password,
      user.password
    );

    if (!validPassword) {
      throw new ValidationError('Invalid credentials');
    }

    // Generate JWT token
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
      id: user.id,
      customer: user.customer?.id
    });

    return {
      jwt,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.name,
        customer: user.customer ? {
          id: user.customer.id,
          name: user.customer.name,
          code: user.customer.code
        } : null
      }
    };
  },

  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('No authorization header was found');
    }

    const data = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
      populate: ['role', 'customer']
    });

    if (!data) {
      return ctx.notFound('User not found');
    }

    return {
      id: data.id,
      email: data.email,
      username: data.username,
      role: data.role.name,
      customer: data.customer ? {
        id: data.customer.id,
        name: data.customer.name,
        code: data.customer.code
      } : null
    };
  }
};
