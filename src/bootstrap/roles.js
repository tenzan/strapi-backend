'use strict';

const { getDefaultPermissions, generateToken } = require('../api/app-role/services/role-auth')({ strapi: null });

module.exports = async ({ strapi }) => {
  console.log('Starting role creation process...');
  
  const customers = await strapi.entityService.findMany('api::customer.customer', {
    populate: ['role']
  });

  console.log(`Found ${customers.length} customers to process`);

  for (const customer of customers) {
    // Skip if customer already has a role
    if (customer.role) {
      console.log(`Skipping role creation for ${customer.name} - role already exists`);
      continue;
    }

    console.log(`Creating admin role for customer: ${customer.name}`);

    try {
      // Create admin role for each customer
      const role = await strapi.entityService.create('api::app-role.app-role', {
        data: {
          name: `${customer.name} Admin`,
          type: 'admin',
          description: `Administrator role for ${customer.name}`,
          permissions: getDefaultPermissions('admin'),
          accessToken: generateToken(),
          customer: customer.id
        }
      });

      console.log(`✅ Created role for ${customer.name} with ID: ${role.id}`);
    } catch (error) {
      console.error(`❌ Failed to create role for ${customer.name}:`, error.message);
    }
  }

  console.log('Role creation process completed');
};
