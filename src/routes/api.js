const { Router } = require('express');

const api = ({ db }) => {
  const api = Router();

  api.get('/', (req, res) => {
    res.json({ hello: 'world' });
  });

  return api;
};

module.exports = api;
