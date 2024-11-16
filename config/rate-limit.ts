export default ({ env }) => ({
  enabled: true,
  interval: env.int('RATE_LIMIT_WINDOW', 15) * 60 * 1000, // Convert minutes to milliseconds
  max: env.int('RATE_LIMIT_MAX', 100),
  
  // Different limits for different endpoints
  endpoints: [
    {
      path: '/api/auth/login',
      interval: 15 * 60 * 1000, // 15 minutes
      max: 5 // 5 attempts per 15 minutes
    },
    {
      path: '/api/auth/verify',
      interval: 60 * 1000, // 1 minute
      max: 10 // 10 attempts per minute
    }
  ],

  // Store rate limit data in memory
  store: {
    type: 'memory',
    // Optional: you can switch to Redis later if needed
    // type: 'redis',
    // options: {
    //   host: env('REDIS_HOST', '127.0.0.1'),
    //   port: env.int('REDIS_PORT', 6379),
    //   password: env('REDIS_PASSWORD', '')
    // }
  }
});
