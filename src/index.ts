/// <reference path="./types/strapi.d.ts" />
import getToken from '../scripts/get-token';
import crypto from 'crypto';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Strapi.Strapi }) {
    console.log('🔍 REGISTER FUNCTION CALLED');
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Strapi.Strapi }) {
    console.log('🚀 BOOTSTRAP FUNCTION CALLED');

    try {
      // Check if we already have customers
      const existingCustomers = await strapi.db.query('api::customer.customer').findMany({});
      console.log('=================================');
      console.log('📊 Found', existingCustomers.length, 'existing customers');

      if (existingCustomers.length === 0) {
        // Create test customers
        const customers = [
          {
            name: 'ABC Corporation',
            code: 'ABC001',
            status: 'active',
            settings: {
              timezone: 'America/New_York',
              defaultLanguage: 'en',
              features: {
                multiScreen: true,
                scheduling: true,
                analytics: true
              }
            }
          },
          {
            name: 'XYZ Retail',
            code: 'XYZ001',
            status: 'trial',
            settings: {
              timezone: 'Europe/London',
              defaultLanguage: 'en',
              features: {
                multiScreen: true,
                scheduling: true,
                analytics: false
              }
            }
          },
          {
            name: 'Test Company',
            code: 'TEST001',
            status: 'inactive',
            settings: {
              timezone: 'Asia/Tokyo',
              defaultLanguage: 'ja',
              features: {
                multiScreen: false,
                scheduling: true,
                analytics: false
              }
            }
          }
        ];

        console.log('Creating test customers and roles...');

        // Create customers
        for (const customer of customers) {
          const createdCustomer = await strapi.entityService.create('api::customer.customer', {
            data: customer
          });

          // Create roles for each customer
          const roles = [
            {
              name: `${customer.name} Admin`,
              type: 'admin',
              description: 'Full system access for customer',
              permissions: {
                viewScreens: true,
                editScreens: true,
                deleteScreens: true,
                viewPlaylists: true,
                editPlaylists: true,
                deletePlaylists: true,
                viewAnalytics: true
              },
              customer: createdCustomer.id
            },
            {
              name: `${customer.name} Editor`,
              type: 'editor',
              description: 'Content management access',
              permissions: {
                viewScreens: true,
                editScreens: false,
                deleteScreens: false,
                viewPlaylists: true,
                editPlaylists: true,
                deletePlaylists: false,
                viewAnalytics: true
              },
              customer: createdCustomer.id
            },
            {
              name: `${customer.name} Viewer`,
              type: 'viewer',
              description: 'Read-only access',
              permissions: {
                viewScreens: true,
                editScreens: false,
                deleteScreens: false,
                viewPlaylists: true,
                editPlaylists: false,
                deletePlaylists: false,
                viewAnalytics: false
              },
              customer: createdCustomer.id
            }
          ];

          for (const role of roles) {
            await strapi.entityService.create('api::app-role.app-role', {
              data: {
                ...role,
                accessToken: crypto.randomBytes(32).toString('hex')
              }
            });
          }
        }

        console.log('✅ Test data created successfully');
      } else {
        console.log('ℹ️ Found', existingCustomers.length, 'existing customers, skipping test data creation.');
      }

      console.log('=================================');
      
      // Get token for testing
      await getToken.getToken(strapi);

    } catch (error) {
      console.error('Error in bootstrap:', error);
    }
  }
};
