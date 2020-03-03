const createRoutes = require('next-routes');

// @ts-ignore Types are broken
const routes = createRoutes();

routes.add('home', '/', 'index');
routes.add('explore', '/explore', 'explore');
routes.add('discover', '/discover', 'discover');
routes.add('narratives', '/narratives/:tab?', 'narratives');
routes.add('get involved', '/get-involved', 'get-involved');
routes.add('about', '/about/:tab?', 'about');

// Fix some TSLint issues
const exportedModule = routes;
exportedModule.Link = routes.Link;
exportedModule.Router = routes.Router;

module.exports = exportedModule;
