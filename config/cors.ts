export default ({ env }) => ({
  enabled: true,
  headers: '*',
  origin: env.array('CORS_ORIGINS', [
    'http://localhost:3000',     // React development
    'http://localhost:5173',     // Vite development
    'http://localhost:4200',     // Angular development
    'http://localhost:8080',     // Vue development
  ]),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  keepHeaderOnError: true,
  credentials: true,
  maxAge: 24 * 60 * 60, // 24 hours in seconds
  expose: [
    'WWW-Authenticate',
    'Server-Authorization',
    'Access-Control-Allow-Credentials'
  ]
});
