export default ({ env }) => ({
  cors: {
    enabled: true
  },
  csrf: {
    enabled: true,
    key: '_csrf',
    secret: env('CSRF_SECRET', 'csrf_secret_key_here')
  },
  csp: {
    enabled: true,
    policy: {
      'default-src': ["'self'"],
      'img-src': ["'self'", 'data:', 'blob:'],
      'media-src': ["'self'", 'data:', 'blob:'],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'frame-ancestors': ["'self'"],
      'connect-src': ["'self'", 'https:']
    }
  },
  hsts: {
    enabled: true,
    maxAge: 31536000,
    includeSubDomains: true
  },
  xframe: {
    enabled: true,
    value: 'SAMEORIGIN'
  },
  xss: {
    enabled: true,
    mode: 'block'
  },
  nosniff: {
    enabled: true
  },
  referrerPolicy: {
    enabled: true,
    policy: 'same-origin'
  }
});
