const server = require('../dist/main').default;
const { createNestServer } = require('../dist/main');

module.exports = async (req, res) => {
  await createNestServer(server);
  return server(req, res);
};
