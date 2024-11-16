'use strict';

const crypto = require('crypto');
const { ValidationError } = require('@strapi/utils').errors;

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const getDefaultPermissions = (roleType) => {
  const basePermissions = {
    view_screens: true,
    view_playlists: true,
    view_media: true
  };

  switch (roleType) {
    case 'admin':
      return {
        ...basePermissions,
        manage_screens: true,
        manage_playlists: true,
        manage_media: true,
        manage_layouts: true,
        view_analytics: true,
        manage_settings: true
      };

    case 'editor':
      return {
        ...basePermissions,
        manage_playlists: true,
        manage_media: true,
        view_analytics: true
      };

    case 'viewer':
      return basePermissions;

    default:
      return {};
  }
};

module.exports = ({ strapi }) => ({
  async validateToken(token) {
    if (!token) {
      throw new ValidationError('Token is required');
    }

    const role = await strapi.entityService.findMany('api::app-role.app-role', {
      filters: { accessToken: token },
      populate: ['customer']
    });

    if (!role || role.length === 0) {
      throw new ValidationError('Invalid token');
    }

    // Update last access
    await strapi.entityService.update('api::app-role.app-role', role[0].id, {
      data: {
        lastAccess: new Date()
      }
    });

    return role[0];
  },

  async refreshToken(roleId) {
    const newToken = generateToken();
    
    const role = await strapi.entityService.update('api::app-role.app-role', roleId, {
      data: {
        accessToken: newToken,
        lastAccess: new Date()
      }
    });

    return role;
  },

  getDefaultPermissions,
  generateToken
});
