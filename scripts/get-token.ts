/// <reference path="../src/types/strapi.d.ts" />

export default {
  async getToken(strapi: Strapi.Strapi) {
    try {
      // Get the first admin role from ABC Corporation
      const role = await strapi.db.query('api::app-role.app-role').findOne({
        where: { 
          type: 'admin',
          customer: {
            name: 'ABC Corporation'
          }
        },
        populate: ['customer']
      });

      if (!role) {
        console.log('❌ No admin role found for ABC Corporation');
        return;
      }

      console.log('\n🔑 Found Role:');
      console.log('Name:', role.name);
      console.log('Type:', role.type);
      console.log('Customer:', role.customer.name);
      console.log('\nAccess Token:', role.accessToken);
      console.log('\nUse this token in your test-auth.ps1 script\n');

    } catch (error) {
      console.error('Error getting token:', error);
    }
  }
};
