# soils-revealed

Platform for direct visualization, analysis and reporting of soil organic carbon predictions and changes over time.

![Hompage](docs/assets/hero.png)

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
