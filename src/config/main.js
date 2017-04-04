export default {
  server: {
    port: 8080,
  },
  database: {
    uri: 'mongodb://localhost:27017/test-db',
    reseed: true,
  },
  auth: {
    header: 'x-auth-token',
    secret: 'F5bBnXPObTA3b1Ys7z0CdvGvCaIE82hLBNktmz7T',
  },
};