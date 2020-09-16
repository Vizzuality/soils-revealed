# soils-revealed

Platform for direct visualization, analysis and reporting of soil organic carbon predictions and changes over time.

![Homepage](docs/assets/hero.png)

You can check the production instance here: [soilsrevealed.org](https://soilsrevealed.org/).

## Getting Started

In order to start modifying the app, please make sure to correctly configure your workstation:

1. Make sure you you have [Node.js](https://nodejs.org/en/) installed
2. (Optional) Install [NVM](https://github.com/nvm-sh/nvm) to manage your different Node.js versions
3. (Optional) Use [Visual Studio Code](https://code.visualstudio.com/) as a text editor to benefit from automatic type checking
4. Configure your text editor with the [Prettier](https://prettier.io/), [ESLint](https://eslint.org/) and [EditorConfig](https://editorconfig.org/) plugins
5. Use the correct Node.js version for this app by running `nvm use`; if you didn't install NVM (step 2), then manually install the Node.js version described in `.nvmrc`
6. Install the dependencies: `yarn`
7. Create a `.env` file at the root of the project by copying `.env.default` and giving a value for each of the variables (currently, only `MAPBOX_API_KEY` is mandatory)
8. Run the server: `yarn dev`

You can access a hot-reloaded version of the app on [http://localhost:3000](http://localhost:3000).

The application is built using [React](https://reactjs.org/) and the framework [Next.js](https://nextjs.org/). The styles use [Sass](https://sass-lang.com/) and the [Bootstrap](https://getbootstrap.com/) framework.

A continuous deployment system is in place. Each time you push to the `master` branch, the application is deployed to production through a GitHub Action defined in `.github/workflows/build.yml`. Each time you push to `develop`, the application is deployed to staging. You can see the status of the build in the “Actions” tab of the repository on GitHub.

## Architecture

![Architecture schema](docs/assets/architecture-schema.png)

The platform is hosted on an Amazon server and consists of two main applications:

- the web server
- the on-the-fly analysis service

The web server is a Node.js application made out of two elements: the Next.js server and an API the server relies on for all of its non-cartographic data (e.g. analysis data) and some of its cartographic data (e.g. soils layers coming from GEE).

The API is an abstraction that obfuscates some sensitive information like the Google Earth Engine key, and that abstracts complex data handling.

In addition to the API, the front-end also accesses the [RW API](http://api.resourcewatch.org/) and a Mapbox account, from which it gets map layers.

Similarly, the API accesses other services too: a Carto instance which provides all of the precalculated analysis data, a service which provides on-the-fly analysis for custom areas (hosted with the web server) and a Google Earth Engine (GEE) account which provides the soils layers.

Between the user and the web server lies a cache, [Varnish](https://varnish-cache.org/), which ensures frequent and similar API requests are computely cheap and resolving fast.

Finally, the code of the web server (front-end application and API) is hosted on this GitHub repository, while the code of the on-the-fly analysis service is [hosted on this one](https://github.com/Vizzuality/soils-revealed-lambda).

The web server is automatically deployed when changes are pushed to GitHub. Changes pushed to the `master` branch are deployed to the production instance of the platform, and changes pushed to `develop` are deployed to the staging one. This is achieved via GitHub Actions [defined here](https://github.com/Vizzuality/soils-revealed/tree/develop/.github/workflows).

These actions connect via SSH to the Amazon server, and execute a series of instructions to stop the server, pull the changes from the repository, build the app, and restart the server. In order to connect to the server, a few secrets are stored in this repository, like the SSH host, port or key.

Another secret is also stored in GitHub: the GEE key. Every time the platform is deployed, the script copies the key in a `.env` file on the server. This key should never be made public.

_**Note about the schema**: the schema was created with [Excalidraw](https://excalidraw.com/). In the `/docs/assets` folder, you will find a `architecture-schema.excalidraw` file. If you wish to edit the schema, re-open this file in the Excalidraw website. Don't forget to save your changes and store the `.excalidraw` file in the repository._
