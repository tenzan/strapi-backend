'use strict';

module.exports = async ({ strapi }) => {
  // Only run this bootstrap if no customers exist
  const existingCustomers = await strapi.entityService.findMany('api::customer.customer', {
    fields: ['id']
  });

  console.log(`Found ${existingCustomers.length} existing customers`);

  if (existingCustomers.length === 0) {
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

    console.log('Creating test customers:', testCustomers.map(c => c.name).join(', '));

    for (const customer of testCustomers) {
      try {
        const created = await strapi.entityService.create('api::customer.customer', {
          data: customer
        });
        console.log(`✅ Created customer: ${created.name}`);
      } catch (error) {
        console.error(`❌ Failed to create customer ${customer.name}:`, error.message);
      }
    }

    console.log('Test customers creation completed');
  } else {
    console.log('Skipping customer creation as customers already exist');
  }
};
