import crypto from 'crypto';

export default {
  generateAccessToken(): string {
    return crypto.randomBytes(32).toString('hex');
  },

  async validateAccessToken(token: string): Promise<boolean> {
    const role = await strapi.db.query('api::app-role.app-role').findOne({
      where: { accessToken: token }
    });
    return !!role;
  },

  async revokeAccessToken(roleId: number): Promise<void> {
    await strapi.entityService.update('api::app-role.app-role', roleId, {
      data: {
        accessToken: this.generateAccessToken() // Generate new token
      }
    });
  },

  async validateCustomerStatus(customerId: number): Promise<boolean> {
    const customer = await strapi.db.query('api::customer.customer').findOne({
      where: { id: customerId }
    });
    return customer?.status === 'active' || customer?.status === 'trial';
  }
};
