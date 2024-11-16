'use strict';

const Strapi = require('@strapi/strapi');

async function createTestData() {
  // Initialize Strapi
  const strapi = await Strapi().load();
  try {
    console.log('🚀 Starting test data creation...');

    // Create test customers
    const testCustomers = [
      {
        name: 'ABC Corporation',
        code: 'abc-corp',
        status: 'active',
        settings: {
          timezone: 'UTC+6',
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
        code: 'xyz-retail',
        status: 'active',
        settings: {
          timezone: 'UTC+6',
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
        code: 'test-co',
        status: 'trial',
        settings: {
          timezone: 'UTC+6',
          defaultLanguage: 'en',
          features: {
            multiScreen: false,
            scheduling: true,
            analytics: false
          }
        }
      }
    ];

    console.log('📦 Creating customers...');
    for (const customerData of testCustomers) {
      try {
        const customer = await strapi.entityService.create('api::customer.customer', {
          data: customerData
        });
        console.log(`✅ Created customer: ${customer.name}`);

        // Create role for this customer
        const roleData = {
          name: `${customer.name} Admin`,
          type: 'admin',
          description: `Administrator role for ${customer.name}`,
          permissions: {
            view_screens: true,
            view_playlists: true,
            view_media: true,
            manage_screens: true,
            manage_playlists: true,
            manage_media: true,
            manage_layouts: true,
            view_analytics: true,
            manage_settings: true
          },
          accessToken: require('crypto').randomBytes(32).toString('hex'),
          customer: customer.id
        };

        const role = await strapi.entityService.create('api::app-role.app-role', {
          data: roleData
        });
        console.log(`✅ Created role for ${customer.name}`);
      } catch (error) {
        console.error(`❌ Error creating customer ${customerData.name}:`, error.message);
      }
    }

    console.log('✨ Test data creation completed!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Stop Strapi
    await strapi.destroy();
    process.exit(0);
  }
}

createTestData();
