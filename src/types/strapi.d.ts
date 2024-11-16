declare namespace Strapi {
  interface Database {
    query(contentType: string): {
      findOne(params: any): Promise<any>;
      findMany(params?: any): Promise<any[]>;
    };
  }

  interface EntityService {
    create(contentType: string, params: any): Promise<any>;
    update(contentType: string, id: number | string, params: any): Promise<any>;
  }

  interface JWTService {
    issue(payload: any): string;
    verify(token: string): any;
  }

  interface UsersPermissionsPlugin {
    services: {
      jwt: JWTService;
    };
  }

  interface Plugins {
    'users-permissions': UsersPermissionsPlugin;
  }

  interface Strapi {
    db: Database;
    entityService: EntityService;
    plugins: Plugins;
  }
}

export = Strapi;
export as namespace Strapi;
