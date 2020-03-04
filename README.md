# soils-revealed

Platform for direct visualization, analysis and reporting of soil organic carbon predictions and changes over time.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Contribute

### Icons management

This project makes use of [IcoMoon](https://icomoon.io/#docs) to manage its library of icons.

If you wish to add new icons, please follow these steps:

1. Open the IcoMoon app: https://icomoon.io/app/#/select
2. Click the “Manage project” (or “Untitled Project”) button of the header
3. Click “Import Project”
4. Select the file `components/icons/selection.json`
5. Click “Load” next to the “Untitled Project” that appeared
6. Drag your icons to the existing set
7. Select _all_ the icons and click “Generate SVG & More” at the bottom of the screen
8. Click the “Download” button

Once you have downloaded the folder, you need to update the `Icons` component:

1. Replace `components/icons/selection.json` by the new one
2. For each new icon, make sure to copy its `symbol` element from `symbol-defs.svg` and to add it to `components/icons/index.js`

In order to use any of the icons in a component, import the `Icon` component and pass the icon's name to the `name` prop. You can find the name of an icon by looking at the second part of their `symbol`'s `id`.

If you desire to update or remove any icon, please follow the same steps, but update or remove them in IcoMoon.
