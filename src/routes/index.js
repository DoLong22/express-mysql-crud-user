const authApiRouter = require('../components/auth');
const userApiRouter = require('../components/users');

const routerManager = (app) => {
    authApiRouter(app);
    userApiRouter(app);
};

module.exports = routerManager;
