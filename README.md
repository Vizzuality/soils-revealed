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
7. Create a `.env` file at the root of the project by copying `.env.default` and giving a value for each of the variables (see next section for details)
8. Create a `gee.key.json` file at the root of the project with the Google Earth Engine's private key inside
9. Run the server: `yarn dev`

You can access a hot-reloaded version of the app on [http://localhost:3000](http://localhost:3000).

The application is built using [React](https://reactjs.org/) and the framework [Next.js](https://nextjs.org/). The styles use [Sass](https://sass-lang.com/) and the [Bootstrap](https://getbootstrap.com/) framework.

A continuous deployment system is in place. Each time you push to the `master` branch, the application is deployed to production through a GitHub Action defined in `.github/workflows/production.yml`. Each time you push to `develop`, the application is deployed to staging through an action defined in `.github/workflows/staging.yml`. You can see the status of the build in the “Actions” tab of the repository on GitHub.

## Environment variables

The application (and API) is configured via environment variables stored in a `.env` file that must be placed at the root of the project. You can create one by copying `.env.default` and setting a value for each key.

Below is a description of each of the keys.

| Variable | Description |
|---|---|
| PORT | Port number used by the application |
| MAPBOX_API_KEY | Mapbox API key for the Explore page |
| API_URL | URL of the Carto instance providing the pre-calculated analysis |
| ANALYSIS_API_URL | URL of the on-the-fly analysis service |
| DEPLOYMENT_KEY | (Optional) Key generated at deployment time to bypass the cache of the Carto instance |
| AWS_REGION | [Region](https://docs.aws.amazon.com/general/latest/gr/s3.html) of the AWS S3 bucket storing the tiles of the soils layers |
| AWS_BUCKET_NAME | Name of the AWS S3 bucket storing the tiles of the soils layers |
| AWS_ACCESS_KEY_ID | Access key ID of the AWS server storing the tiles of the soils layers |
| AWS_SECRET_ACCESS_KEY | Secret access key of the AWS server storing the tiles of the soils layers |
| AWS_MAX_Z_TILE_STORAGE | Maximum zoom at which tiles generated on-the-fly will be saved in the AWS S3 bucket |

## Deployment

As explained before, the application is automatically deployed to staging when pushing new changes to the `develop` branch, and deployed to production when pushing changes to `master`. This is achieved through GitHub Actions defined in `.github/workflows`.

When an action is executed, it connects via SSH to the server hosting the application. The server's credentials are stored in GitHub's  “secrets” vault. A script is then executed: the running instance of the application is stopped, the code is pulled, the correct version of node is selected, the dependencies are installed, a local `.env` file is generated, a local `gee.key.json` file is generated, and the application is restarted.

The `.env` file is programmatically generated on the server because it differs for each environment. Some of the keys are hard coded in the `.github/workflows/XXX.yml` file and others are pulled from GitHub's “secrets” vault.

The `gee.key.json` file contains the credentials for the Google Earth Engine library. It is also programmatically generated as its value is stored in GitHub's “secrets” vault.

Overall, deploying to either environment takes between 1 to 2 minutes to complete.

## Architecture

![Architecture schema](docs/assets/architecture-schema.png)

The platform is hosted on an Amazon server and consists of two main applications:

- the web server
- the on-the-fly analysis service

The web server is a Node.js application made out of two elements: the Next.js server and an API the server relies on for all of its non-cartographic data (e.g. analysis data) and some of its cartographic data (e.g. the soils layers).

The API is an abstraction that obfuscates some sensitive information like the Google Earth Engine key, and that abstracts complex data handling.

In addition to the API, the front-end also accesses the [RW API](http://api.resourcewatch.org/) and a Mapbox account, from which it gets map layers.

Similarly, the API accesses other services too: a Carto instance which provides all of the precalculated analysis data, a service which provides on-the-fly analysis for custom areas (hosted with the web server), and a Google Earth Engine (GEE) account and an Amazon Web Services (AWS) S3 bucket which provide the soils layers.

When soils layers are requested, the API tries to fetch the tiles for the AWS S3 bucket first. If they can't be found, it fallbacks to GEE to generate them dynamically. Depending on the zoom level, these tiles may then be saved in the bucket so the API can respond faster the next time.

Between the user and the web server lies a cache, [Varnish](https://varnish-cache.org/), which ensures frequent and similar API requests are computely cheap and resolving fast.

Finally, the code of the web server (front-end application and API) is hosted on this GitHub repository, while the code of the on-the-fly analysis service is [hosted on this one](https://github.com/Vizzuality/soils-revealed-lambda).

_**Note about the schema**: the schema was created with [Excalidraw](https://excalidraw.com/). In the `/docs/assets` folder, you will find a `architecture-schema.excalidraw` file. If you wish to edit the schema, re-open this file in the Excalidraw website. Don't forget to save your changes and store the `.excalidraw` file in the repository._
