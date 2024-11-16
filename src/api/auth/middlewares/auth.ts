/// <reference path="../../../types/strapi.d.ts" />
import type { Context, Next } from 'koa';

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
  route?: {
    config?: {
      permissions?: string[];
    };
  };
  strapi: Strapi.Strapi;
}

export default () => {
  return async (ctx: AuthContext, next: Next) => {
    try {
      // Skip auth for public routes
      if (ctx.request.path.startsWith('/api/auth/')) {
        return next();
      }

      // Get token from authorization header
      const token = ctx.request.header.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return ctx.unauthorized('No token provided');
      }

      // Verify JWT token
      const decoded = ctx.strapi.plugins['users-permissions'].services.jwt.verify(token);

      // Find role with customer
      const role = await ctx.strapi.db.query('api::app-role.app-role').findOne({
        where: { id: decoded.id },
        populate: ['customer']
      });

      if (!role) {
        return ctx.unauthorized('Invalid token');
      }

      // Check if customer is active
      if (role.customer.status !== 'active' && role.customer.status !== 'trial') {
        return ctx.forbidden('Customer account is not active');
      }

      // Add role and customer info to state for use in controllers
      ctx.state.role = {
        id: role.id,
        name: role.name,
        type: role.type,
        permissions: role.permissions
      };

      ctx.state.customer = {
        id: role.customer.id,
        name: role.customer.name,
        code: role.customer.code,
        settings: role.customer.settings
      };

      // Check if user has required permissions
      const requiredPermissions = ctx.route?.config?.permissions || [];
      if (requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.every(
          permission => role.permissions[permission]
        );

        if (!hasPermission) {
          return ctx.forbidden('Insufficient permissions');
        }
      }

      // Update last access time
      await ctx.strapi.entityService.update('api::app-role.app-role', role.id, {
        data: {
          lastAccess: new Date()
        }
      });

      return next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return ctx.unauthorized('Invalid token');
    }
  };
};
