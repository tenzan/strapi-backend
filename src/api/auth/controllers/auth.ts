/// <reference path="../../../types/strapi.d.ts" />
import type { Context } from 'koa';

interface AuthContext extends Context {
  state: {
    role?: {
      id: number;
      name: string;
      type: string;
      permissions: Record<string, boolean>;
    };
    customer?: {
      id: number;
      name: string;
      code: string;
      settings: any;
    };
  };
  strapi: Strapi.Strapi;
}

export default {
  async login(ctx: AuthContext) {
    const { accessToken } = ctx.request.body;

    try {
      // Find role by access token
      const role = await ctx.strapi.db.query('api::app-role.app-role').findOne({
        where: { accessToken },
        populate: ['customer']
      });

      if (!role) {
        return ctx.badRequest('Invalid access token');
      }

      // Check if customer is active
      if (role.customer.status !== 'active' && role.customer.status !== 'trial') {
        return ctx.forbidden('Customer account is not active');
      }

      // Generate JWT token
      const jwt = ctx.strapi.plugins['users-permissions'].services.jwt.issue({
        id: role.id,
        type: role.type,
        customer: role.customer.id
      });

      // Update last access time
      await ctx.strapi.entityService.update('api::app-role.app-role', role.id, {
        data: {
          lastAccess: new Date()
        }
      });

      // Return role info and token
      return {
        token: jwt,
        role: {
          id: role.id,
          name: role.name,
          type: role.type,
          permissions: role.permissions
        },
        customer: {
          id: role.customer.id,
          name: role.customer.name,
          code: role.customer.code,
          settings: role.customer.settings
        }
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return ctx.badRequest('Authentication failed');
    }
  },

  async verify(ctx: AuthContext) {
    try {
      // Get token from authorization header
      const token = ctx.request.header.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return ctx.unauthorized('No token provided');
      }

      // Verify JWT token
      const decoded = ctx.strapi.plugins['users-permissions'].services.jwt.verify(token);

      // Find role
      const role = await ctx.strapi.db.query('api::app-role.app-role').findOne({
        where: { id: decoded.id },
        populate: ['customer']
      });

      if (!role) {
        return ctx.unauthorized('Invalid token');
      }

      // Check if customer is still active
      if (role.customer.status !== 'active' && role.customer.status !== 'trial') {
        return ctx.forbidden('Customer account is not active');
      }

      // Return current role info
      return {
        role: {
          id: role.id,
          name: role.name,
          type: role.type,
          permissions: role.permissions
        },
        customer: {
          id: role.customer.id,
          name: role.customer.name,
          code: role.customer.code,
          settings: role.customer.settings
        }
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return ctx.unauthorized('Invalid token');
    }
  },

  async logout(ctx: AuthContext) {
    // Since we're using JWTs, we don't need to do anything server-side
    // The client should just remove the token
    return { message: 'Logged out successfully' };
  }
};
