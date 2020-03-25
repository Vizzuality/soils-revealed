const createRoutes = require('next-routes');

// @ts-ignore Types are broken
const routes = createRoutes();

routes.add('home', '/', 'index');
routes.add('explore', '/explore', 'explore');
routes.add('about', '/about/:tab?', 'about');

// Fix some TSLint issues
const exportedModule = routes;
exportedModule.Link = routes.Link;
exportedModule.Router = routes.Router;

module.exports = exportedModule;
