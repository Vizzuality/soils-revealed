export const mapStyle = 'mapbox://styles/tncsoilscience/ck9wlqrzv0kfq1jljzyls86g8';

export const BASEMAPS = {
  light: {
    label: 'Light',
    image: '/images/basemap-light.png',
    backgroundColor: '#d2c1b1',
    minZoom: 0,
    maxZoom: 22,
    styleGroup: 'basemap_light',
  },
  dark: {
    label: 'Dark',
    image: '/images/basemap-dark.png',
    backgroundColor: '#4b3116',
    minZoom: 0,
    maxZoom: 22,
    styleGroup: 'basemap_dark',
  },
  satellite: {
    label: 'Satellite',
    image: '/images/basemap-satellite.png',
    backgroundColor: '#050810',
    minZoom: 0,
    maxZoom: 22,
    styleGroup: 'basemap_satellite',
  },
  landsat: {
    label: 'Landsat',
    image: '/images/basemap-landsat.png',
    backgroundColor: '#020043',
    minZoom: 0,
    maxZoom: 12,
    url: 'https://api.resourcewatch.org/v2/landsat-tiles/{year}/{z}/{x}/{y}',
    params: {
      year: {
        label: 'Year',
        values: [2013, 2014, 2015, 2016, 2017],
        default: 2017,
      },
    },
    attributions: ['rw'],
  },
};

export const BOUNDARIES = {
  'no-boundaries': {
    label: 'No boundaries',
    minZoom: -Infinity,
    maxZoom: Infinity,
  },
  'political-boundaries': {
    label: 'Political boundaries',
    minZoom: -Infinity,
    maxZoom: Infinity,
    styleGroup: 'boundaries_political-boundaries',
  },
  landforms: {
    label: 'Landforms',
    minZoom: -Infinity,
    maxZoom: Infinity,
    styleGroup: 'boundaries_landforms',
  },
  'river-basins': {
    label: 'River basins',
    minZoom: 3.5,
    maxZoom: Infinity,
    styleGroup: 'boundaries_river-basins',
  },
  biomes: {
    label: 'Biomes',
    minZoom: -Infinity,
    maxZoom: Infinity,
    styleGroup: 'boundaries_biomes',
  },
};

export const LAYERS = {
  'land-cover': {
    // From: https://api.resourcewatch.org/v1/dataset/bca0109c-6d13-42a0-89b2-bcc046dc177e?includes=layer
    label: 'Global Land Cover',
    description:
      "Land Cover from the European Space Agency's Climate Change Initiative Land Cover (ESA CCI-LC) dataset, categorized under the IPCC land cover classification system at 300 m resolution.",
    group: 'land-use',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: (year = 2015) => {
        const yearToTiles = {
          2000: 'https://api.resourcewatch.org/v1/layer/709afed4-fc07-422f-a7ce-c8051f443d99/tile/gee/{z}/{x}/{y}',
          2001: 'https://api.resourcewatch.org/v1/layer/37a68f52-8e79-43ee-9c5c-ea8db5d4c166/tile/gee/{z}/{x}/{y}',
          2002: 'https://api.resourcewatch.org/v1/layer/d4035b7d-4e41-4406-80cc-4a9e288ab78f/tile/gee/{z}/{x}/{y}',
          2003: 'https://api.resourcewatch.org/v1/layer/9f0b8836-1947-4abd-be76-a26153a58b78/tile/gee/{z}/{x}/{y}',
          2004: 'https://api.resourcewatch.org/v1/layer/2daeb219-c454-4a5e-882a-2c6e53684051/tile/gee/{z}/{x}/{y}',
          2005: 'https://api.resourcewatch.org/v1/layer/432c1aa5-cd80-4023-9b20-1b4291be3022/tile/gee/{z}/{x}/{y}',
          2006: 'https://api.resourcewatch.org/v1/layer/abed6874-6d5d-4575-8935-defba9804e8c/tile/gee/{z}/{x}/{y}',
          2007: 'https://api.resourcewatch.org/v1/layer/f9192bd0-ea3f-4440-91df-9f6878249d6b/tile/gee/{z}/{x}/{y}',
          2008: 'https://api.resourcewatch.org/v1/layer/575b1cf1-a556-4a29-9793-f46ff12ff654/tile/gee/{z}/{x}/{y}',
          2009: 'https://api.resourcewatch.org/v1/layer/98c6d7ab-392a-4bfe-848f-f9e40ece29a9/tile/gee/{z}/{x}/{y}',
          2010: 'https://api.resourcewatch.org/v1/layer/5c42808b-7b33-48f2-9415-5d7c43781468/tile/gee/{z}/{x}/{y}',
          2011: 'https://api.resourcewatch.org/v1/layer/d00946b2-806d-4475-bcf5-08833e0a4c5b/tile/gee/{z}/{x}/{y}',
          2012: 'https://api.resourcewatch.org/v1/layer/b8711907-c63d-437f-a9d9-3f8d12418ee8/tile/gee/{z}/{x}/{y}',
          2013: 'https://api.resourcewatch.org/v1/layer/be996ac0-3228-44c1-9c75-cbe6955689b3/tile/gee/{z}/{x}/{y}',
          2014: 'https://api.resourcewatch.org/v1/layer/4a363e72-bb4a-4ced-8564-3403eaba1823/tile/gee/{z}/{x}/{y}',
          2015: 'https://api.resourcewatch.org/v1/layer/68a50d22-a821-4a39-bb1b-d51fd5fa85c9/tile/gee/{z}/{x}/{y}',
        };

        return {
          tiles: [yearToTiles[year]],
          minzoom: 2,
          maxzoom: 12,
        };
      },
    },
    legend: {
      type: 'basic',
      items: [
        {
          name: 'Agriculture',
          color: '#fffd70',
        },
        {
          name: 'Forest',
          color: '#09630c',
        },
        {
          name: 'Grassland',
          color: '#3fa02c',
        },
        {
          name: 'Wetland',
          color: '#159578',
        },
        {
          name: 'Settlement',
          color: '#c11812',
        },
        {
          name: 'Shrubland',
          color: '#956314',
        },
        {
          name: 'Sparse Vegetation',
          color: '#c2e575',
        },
        {
          name: 'Bare Area',
          color: '#fff5d8',
        },
        {
          name: 'Water',
          color: '#0b4bc5',
        },
        {
          name: 'Permanent Snow and Ice',
          color: '#FFFFFF',
        },
      ],
      timeline: {
        range: false,
        interval: 'years',
        dateFormat: 'YYYY',
        minDate: '2001-01-01',
        maxDate: '2015-12-31',
      },
    },
    info: {
      datasetName: 'Global Land Cover (IPCC Classification)',
      downloadLink: 'http://maps.elie.ucl.ac.be/CCI/viewer/',
      function:
        'Global distribution of land cover from 1992 to 2015 with the Intergovernmental Panel on Climate Change (IPCC) categories.',
      geoCoverage: 'Global',
      spatialResolution: '300 m',
      contentDate: '1992-2015',
      description:
        'The Climate Change Initiative (CCI) Land Cover (LC) project of the European Space Agency (ESA) delivers consistent global LC maps at 300 m spatial resolution on an annual basis from 1992 to 2015. Each pixel value corresponds to the label of a land cover class defined based on the Intergovernmental Panel on Climate Change (IPCC) categories. This unique data set was produced thanks to the reprocessing and the interpretation of 5 different satellite missions.   \n  \nBaseline LC maps are generated thanks to the entire MERIS FR and RR archive from 2003 through 2012. Independently from this baseline, LC changes are detected at 1 km based on the AVHRR time series between 1992 to 1999, SPOT-VGT time series between 1999 and 2013, and PROBA-V data for years 2013, 2014, and 2015. When MERIS FR or PROBA-V time series are available, changes detected at 1 km are remapped at 300 m. The last step consists in back- and updating the 10-year baseline LC map to produce the 24 annual LC maps from 1992 to 2015. Soils Revealed shows only a subset of the data set.',
      cautions:
        'A full accuracy assessment is available from the CCI. In general, land cover classes such as rainfed and irrigated croplands, broadleaved evergreen forest, urban areas, bare areas, water bodies and permanent snow are found quite accurately mapped. On the other hand, classes such as lichens and mosses, sparse vegetation and flooded forest with fresh water can be affected by errors. Data quality varies by region, particularly as related to the coverage of MERIS imagery for creation of the baseline map. Areas with less coverage include the western part of the Amazon basin, Chile and the southern part of Argentina, the western part of Congo basin as well as the gulf of Guinea, the eastern part of Russia, and the eastern coast of China and Indonesia.',
      sources: [
        'European Space Agency (ESA)',
        'European Space Agency Climate Change Initiative (ESA CCI)',
        'University of Louvain (UCLouvain)',
      ],
      citation:
        'European Space Agency Climate Change Initiative, Land Cover project. 2017. "300 M Annual Global Land Cover Time Series from 1992 to 2015." Retrieved from https://www.esa-landcover-cci.org/?q=node/175.',
      license: 'Attribution required',
      licenseLink: 'http://maps.elie.ucl.ac.be/CCI/viewer/download.php',
    },
  },
  'tree-cover-loss': {
    // From: http://api.resourcewatch.org/v1/dataset/897ecc76-2308-4c51-aeb3-495de0bdca79?includes=layer
    label: 'Tree Cover Loss',
    description: 'Identifies areas of gross tree cover loss.',
    group: 'land-use',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://storage.googleapis.com/wri-public/Hansen18/tiles/hansen_world/v1/tc30/{z}/{x}/{y}.png',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'basic',
      items: [
        {
          name: 'Tree Cover Loss',
          color: '#dc6c9a',
        },
      ],
      timeline: {
        step: 1,
        speed: 250,
        interval: 'years',
        dateFormat: 'YYYY',
        minDate: '2001-01-01',
        maxDate: '2018-12-31',
        canPlay: true,
      },
    },
    decodeParams: {
      startYear: 2001,
      endYear: 2018,
    },
    decodeConfig: [
      {
        default: '2001-01-01',
        key: 'startDate',
        required: true,
      },
      {
        default: '2018-12-31',
        key: 'endDate',
        required: true,
      },
    ],
    decodeFunction: `
      // values for creating power scale, domain (input), and range (output)
      float domainMin = 0.;
      float domainMax = 255.;
      float rangeMin = 0.;
      float rangeMax = 255.;
      float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
      float intensity = color.r * 255.;
      // get the min, max, and current values on the power scale
      float minPow = pow(domainMin, exponent - domainMin);
      float maxPow = pow(domainMax, exponent);
      float currentPow = pow(intensity, exponent);
      // get intensity value mapped to range
      float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;
      // a value between 0 and 255
      alpha = zoom < 13. ? scaleIntensity / 255. : color.g;
      float year = 2000.0 + (color.b * 255.);
      // map to years
      if (year >= startYear && year <= endYear && year >= 2001.) {
        color.r = 220. / 255.;
        color.g = (72. - zoom + 102. - 3. * scaleIntensity / zoom) / 255.;
        color.b = (33. - zoom + 153. - intensity / zoom) / 255.;
      } else {
        alpha = 0.;
      }
    `,
    info: {
      datasetName: 'Tree Cover Loss',
      downloadLink:
        'http://earthenginepartners.appspot.com/science-2013-global-forest/download_v1.5.html',
      function: 'Identifies areas of gross tree cover loss',
      geoCoverage: 'Global land area (excluding Antarctica and other Arctic islands).',
      spatialResolution: '30 × 30 meters',
      contentDate: '2001-2018',
      description:
        'This data set, a collaboration between the [GLAD](http://glad.geog.umd.edu/) (Global Land Analysis & Discovery) lab at the University of Maryland, Google, USGS, and NASA, measures areas of tree cover loss across all global land (except Antarctica and other Arctic islands) at approximately 30 × 30 meter resolution. The data were generated using multispectral satellite imagery from the Landsat 5 thematic mapper (TM), the Landsat 7 thematic mapper plus (ETM+), and the Landsat 8 Operational Land Imager (OLI) sensors. Over 1 million satellite images were processed and analyzed, including over 600,000 Landsat 7 images for the 2000-2012 interval, and more than 400,000 Landsat 5, 7, and 8 images for updates for the 2011-2018 interval. The clear land surface observations in the satellite images were assembled and a supervised learning algorithm was applied to identify per pixel tree cover loss.\n\nIn this data set, “tree cover” is defined as all vegetation greater than 5 meters in height, and may take the form of natural forests or plantations across a range of canopy densities. Tree cover loss is defined as “stand replacement disturbance,” or the complete removal of tree cover canopy at the Landsat pixel scale. Tree cover loss may be the result of human activities, including forestry practices such as timber harvesting or deforestation (the conversion of natural forest to other land uses), as well as natural causes such as disease or storm damage. Fire is another widespread cause of tree cover loss, and can be either natural or human-induced.\n\nThis data set has been updated five times since its creation, and now includes loss up to 2018 (Version 1.5). The analysis method has been modified in numerous ways, including new data for the target year, re-processed data for previous years (2011 and 2012 for the Version 1.1 update, 2012 and 2013 for the Version 1.2 update, and 2014 for the Version 1.3 update), and improved modelling and calibration. These modifications improve change detection for 2011-2018, including better detection of boreal loss due to fire, smallholder rotation agriculture in tropical forests, selective losing, and short cycle plantations. Eventually, a future “Version 2.0” will include reprocessing for 2000-2010 data, but in the meantime integrated use of the original data and Version 1.5 should be performed with caution. Read more about the Version 1.5 update [here](http://earthenginepartners.appspot.com/science-2013-global-forest/download_v1.5.html).\n\nWhen zoomed out (&lt; zoom level 13), pixels of loss are shaded according to the density of loss at the 30 x 30 meter scale. Pixels with darker shading represent areas with a higher concentration of tree cover loss, whereas pixels with lighter shading indicate a lower concentration of tree cover loss. There is no variation in pixel shading when the data is at full resolution (≥ zoom level 13).\n\nThe tree cover canopy density of the displayed data varies according to the selection - use the legend on the map to change the minimum tree cover canopy density threshold.',
      cautions:
        'In this data set, “tree cover” is defined as all vegetation greater than 5 meters in height, and may take the form of natural forests or plantations across a range of canopy densities. “Loss” indicates the removal or mortality of tree cover and can be due to a variety of factors, including mechanical harvesting, fire, disease, or storm damage. As such, “loss” does not equate to deforestation.\n\nDue to variation in research methodology and date of content, tree cover, loss, and gain data sets cannot be compared accurately against each other. Accordingly, “net” loss cannot be calculated by subtracting figures for tree cover gain from tree cover loss, and current (post-2000) tree cover cannot be determined by subtracting figures for annual tree cover loss from year 2000 tree cover.\n\nThe 2011-2018 data was produced using [updated methodology](http://earthenginepartners.appspot.com/science-2013-global-forest/download_v1.5.html). Comparisons between the original 2001-2010 data and the 2011-2018 update should be performed with caution.\n\nThe authors evaluated the overall prevalence of false positives (commission errors) in this data at 13%, and the prevalence of false negatives (omission errors) at 12%, though the accuracy varies by biome and thus may be higher or lower in any particular location. The model often misses disturbances in smallholder landscapes, resulting in lower accuracy of the data in sub-Saharan Africa, where this type of disturbance is more common. The authors are 75 percent confident that the loss occurred within the stated year, and 97 percent confident that it occurred within a year before or after. Users of the data can smooth out such uncertainty by examining the average over multiple years.',
      sources: [
        'Hansen, M. C., P. V. Potapov, R. Moore, M. Hancher, S. A. Turubanova, A. Tyukavina, D. Thau, S. V. Stehman, S. J. Goetz, T. R. Loveland, A. Kommareddy, A. Egorov, L. Chini, C. O. Justice, and J. R. G. Townshend. 2013. “High-Resolution Global Maps of 21st-Century Forest Cover Change.” _Science_ 342 (15 November): 850–53. Data available from: [earthenginepartners.appspot.com/science-2013-global-forest](http://earthenginepartners.appspot.com/science-2013-global-forest).',
      ],
      citation:
        'Use the following credit when these data are displayed:  \nSource: Hansen/UMD/Google/USGS/NASA\n\nUse the following credit when these data are cited:  \nHansen, M. C., P. V. Potapov, R. Moore, M. Hancher, S. A. Turubanova, A. Tyukavina, D. Thau, S. V. Stehman, S. J. Goetz, T. R. Loveland, A. Kommareddy, A. Egorov, L. Chini, C. O. Justice, and J. R. G. Townshend. 2013. “High-Resolution Global Maps of 21st-Century Forest Cover Change.” _Science_ 342 (15 November): 850–53. Data available on-line from: http://earthenginepartners.appspot.com/science-2013-global-forest.',
      license: 'CC BY 4.0',
      licenseLink: 'http://creativecommons.org/licenses/by/4.0/',
    },
  },
  cropland: {
    // From: https://api.resourcewatch.org/v1/dataset/0ce24533-7877-4926-b962-a6c726332d82?includes=layer
    label: 'Cropland',
    description: 'The percentage of each grid cell used as cropland in the year 2000.',
    group: 'land-use',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://api.resourcewatch.org/v1/layer/47dc9961-05d6-48f1-93c5-aa633e4a1efa/tile/gee/{z}/{x}/{y}',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'choropleth',
      items: [
        {
          color: '#d9f0a3',
          name: '≤20',
          id: 0,
        },
        {
          color: '#addd8e',
          name: '≤40',
          id: 1,
        },
        {
          color: '#78c679',
          name: '≤60',
          id: 2,
        },
        {
          color: '#31a354',
          name: '≤80',
          id: 3,
        },
        {
          color: '#006837',
          name: '≤100',
          id: 4,
        },
      ],
    },
    info: {
      datasetName: 'Cropland',
      downloadLink: 'http://www.earthstat.org/cropland-pasture-area-2000/',
      function: 'Spatial distribution of croplands circa 2000',
      geoCoverage: 'Global',
      spatialResolution: '5 arc minutes',
      contentDate: '2000',
      description:
        "### Overview  \nThe Cropland dataset shows the global distribution of agricultural activities for the year 2000. It is a combination of both satellite based datasets and agricultural inventory data from censuses. The dataset displays the percentage of land used for farming (cropland) for each grid cell. Each grid cell has a value of 0% to 100% coverage. A value of 0% means there are no agricultural activities present and 100% means the gridcell is completely used for cropland. The dataset is displayed at a spatial resolution of 5 arc minutes (around 10 kilometers).\n  \n  \n\nThe Cropland dataset was created by EarthStat with assistance from the University of Minnesota's Institute on the Environment (UMN IonE), and the Land Use and Global Environment Lab at the University of British Columbia (LUGE Lab at UBC). It was created to help understand the positive social and economic benefits, as well as the negative environmental consequences, of agricultural land use. \n  \n  \n### Methodology  \n  \nThe Cropland in 2000 dataset was created by combining two different high-resolution satellite based land cover datasets and agricultural inventory data. The agricultural inventory data is allocated to the 10 kilometer resolution using the higher resolution land cover datasets and statistical modeling. \n  \n  \n\nThe two satellite based land cover datasets used were the Moderate Resolution Imaging Spectroradiometer (MODIS) Land Cover Type Product and the Satellite Pour l’Observation de la Terre (SPOT) VEGETATION based Global Land Cover 2000 (GLC2000) dataset. The MODIS dataset was created with data collected from October 2000 to October 2001 and was analyzed using remote imaging with a globally consistent classification scheme. The SPOT dataset was created with data from November 1999 to December 2000 and used a variable land use classification scheme that included information from regional institutions. Both datasets have a spatial resolution of about 1 kilometer. A single land cover dataset was created by overlaying the MODIS and GLC2000 datasets, where each classification was the combination of the MODIS and GLC2000 classifications. This combination land cover product was found to provide more accurate results when calibrated against the inventory data, as opposed to using either data set individually.\n  \n  \n\nCropland inventory data was compiled for the globe at the national and subnational level for circa year 2000. This resulted in compiled data for 15,990 different administrative units of the world, ranging from political units like countries, states and counties. Inventory data was found from either census data or the Food and Agriculture Organization's (FAO) [FAOSTAT database](http://faostat.fao.org). The cropland data was compiled to be consistent with the FAO definition of “Arable lands and permanent crops”. The agricultural inventory data were seldom available exactly for the year 2000, therefore the authors collected inventory data between the years 1998 to 2002 where possible, but in several instances relied on older data.\n  \n  \n \nInformation within the final Cropland dataset for areas that were clearly non-agricultural (tundra, boreal forest, and protected land) were masked to reduce the possibility of misclassification. For full information, please see the source [methodology](http://www.earthstat.org/cropland-pasture-area-2000/).  \n  \n### Disclaimer  \n  \nExcerpts of this description page were taken from the source metadata.",
      cautions:
        '- Agricultural inventory data was often not available for exactly the year 2000 because agricultural censuses are typically taken every 5–10 years. Inventory data was collected between the years 1998 to 2002 where possible, but in several instances older data was used. 19 countries did not have data available on FAOSTAT and were listed as “missing” in the final database.\n- Large areas, mostly above the 50th parallel north, are not included in the dataset due to their conditions typically not being hospitable to agriculture and to reduce the risk that they are misrepresented in the dataset’s final modeling. There are likely small areas in these regions that do contain cropland. \n- The definition of cropland can vary between institutions. This dataset was created using the definition for croplands as defined by the Food and Agriculture Organization of the United Nations (FAO), which considers non-cultivated fallow land (less than 5 years) as croplands.  It is not clear how strictly this definition was followed in the original MODIS and SPOT data. Furthermore, it is unclear how the classification for multi-use land  was determined.\n- The dataset is a combination of two different forms of observation: remote imaging and ground based. This can lead to differences in data and leaves room for possible errors. Statistical analysis on the dataset provided a 90% confidence level.',
      sources: [
        'EarthStat',
        "University of Minnesota's Institute on the Environment (UMN IonE)",
        'Land Use and Global Environment Lab at the University of British Columbia (LUGE Lab at UBC)',
      ],
      citation:
        'Ramankutty, N., A.T. Evan, C. Monfreda, and J.A. Foley (2008). "Farming the planet: 1. Geographic Distribution of global agricultural lands in the year 2000. Global Biogeochemical Cycles 22, Gb1003, doi:10.1029/2007/GB002952."',
      license: 'Restrictions apply',
      licenseLink:
        'http://www.earthstat.org/wp-content/uploads/METADATA_CroplandPastureArea2000.pdf',
    },
  },
  pasture: {
    // From: https://api.resourcewatch.org/v1/dataset/0ce24533-7877-4926-b962-a6c726332d82?includes=layer
    label: 'Pasture Area',
    description: 'The percentage of each grid cell used as pasture in the year 2000.',
    group: 'land-use',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://api.resourcewatch.org/v1/layer/1198417e-8cfb-4a40-96f7-9ec016384c86/tile/gee/{z}/{x}/{y}',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'choropleth',
      items: [
        {
          name: '≤20',
          color: '#fdd0a2',
          id: 0,
        },
        {
          name: '≤40',
          color: '#fdae6b',
          id: 1,
        },
        {
          name: '≤60',
          color: '#fd8d3c',
          id: 2,
        },
        {
          name: '≤80',
          color: '#e6550d',
          id: 3,
        },
        {
          name: '≤100',
          color: '#a63603',
          id: 4,
        },
      ],
    },
    info: {
      datasetName: 'Pasture Area',
      downloadLink: 'http://www.earthstat.org/cropland-pasture-area-2000/',
      function: 'Spatial distribution of pastures circa 2000',
      geoCoverage: 'Global',
      spatialResolution: '5 arc minutes',
      contentDate: '2000',
      description:
        "### Overview  \nThe Pasture Area dataset shows the global distribution of agricultural activities for the year 2000. It is a combination of both satellite based datasets and agricultural inventory data from censuses. The dataset displays the percentage of livestock (pasture area) for each grid cell. Each grid cell has a value of 0% to 100% coverage. A value of 0% means there are no agricultural activities present and 100% means the gridcell is completely used for pasture area. The dataset is displayed at a spatial resolution of 5 arc minutes (around 10 kilometers).\n  \n  \n\nThe Pasture Area dataset was created by EarthStat with assistance from the University of Minnesota's Institute on the Environment (UMN IonE), and the Land Use and Global Environment Lab at the University of British Columbia (LUGE Lab at UBC). It was created to help understand the positive social and economic benefits, as well as the negative environmental consequences, of agricultural land use. \n  \n  \n### Methodology  \n  \nThe Pasture Area in 2000 dataset was created by combining two different high-resolution satellite based land cover datasets and agricultural inventory data. The agricultural inventory data is allocated to the 10 kilometer resolution using the higher resolution land cover datasets and statistical modeling. \n  \n  \n\nThe two satellite based land cover datasets used were the Moderate Resolution Imaging Spectroradiometer (MODIS) Land Cover Type Product and the Satellite Pour l’Observation de la Terre (SPOT) VEGETATION based Global Land Cover 2000 (GLC2000) dataset. The MODIS dataset was created with data collected from October 2000 to October 2001 and was analyzed using remote imaging with a globally consistent classification scheme. The SPOT dataset was created with data from November 1999 to December 2000 and used a variable land use classification scheme that included information from regional institutions. Both datasets have a spatial resolution of about 1 kilometer. A single land cover dataset was created by overlaying the MODIS and GLC2000 datasets, where each classification was the combination of the MODIS and GLC2000 classifications. This combination land cover product was found to provide more accurate results when calibrated against the inventory data, as opposed to using either data set individually.\n  \n  \n\nPasture inventory data was compiled for the globe at the national and subnational level for circa year 2000. This resulted in compiled data for 15,990 different administrative units of the world, ranging from political units like countries, states and counties. Inventory data was found from either census data or the Food and Agriculture Organization's (FAO) [FAOSTAT database](http://faostat.fao.org). The pasture data was compiled to be consistent with the FAO definition of “Permanent pastures”. The agricultural inventory data were seldom available exactly for the year 2000, therefore the authors collected inventory data between the years 1998 to 2002 where possible, but in several instances relied on older data.\n  \n  \n \nInformation within the final Pasture Area dataset for areas that were clearly non-agricultural (tundra, boreal forest, and protected land) were masked to reduce the possibility of misclassification. For full information, please see the source [methodology](http://www.earthstat.org/cropland-pasture-area-2000/).  \n  \n### Disclaimer  \n  \nExcerpts of this description page were taken from the source metadata.",
      cautions:
        '- Agricultural inventory data was often not available for exactly the year 2000 because agricultural censuses are typically taken every 5–10 years. Inventory data was collected between the years 1998 to 2002 where possible, but in several instances older data was used. 19 countries did not have data available on FAOSTAT and were listed as “missing” in the final database.\n- Large areas, mostly above the 50th parallel north, are not included in the dataset due to their conditions typically not being hospitable to agriculture and to reduce the risk that they are misrepresented in the dataset’s final modeling. There are likely small areas in these regions that do contain pasture areas. \n- The definition of pasture areas can vary between institutions. It is unclear at what point the original data differentiated between herding and grazing to classify the land cover as pastureland. Furthermore, it is unclear how the classification for multi-use land  was determined.\n- The dataset is a combination of two different forms of observation: remote imaging and ground based. This can lead to differences in data and leaves room for possible errors. Statistical analysis on the dataset provided a 90% confidence level.',
      sources: [
        'EarthStat',
        "University of Minnesota's Institute on the Environment (UMN IonE)",
        'Land Use and Global Environment Lab at the University of British Columbia (LUGE Lab at UBC)',
      ],
      citation:
        'Ramankutty, N., A.T. Evan, C. Monfreda, and J.A. Foley (2008). "Farming the planet: 1. Geographic Distribution of global agricultural lands in the year 2000. Global Biogeochemical Cycles 22, Gb1003, doi:10.1029/2007/GB002952."',
      license: 'Restrictions apply',
      licenseLink:
        'http://www.earthstat.org/wp-content/uploads/METADATA_CroplandPastureArea2000.pdf',
    },
  },
  'wetlands-waterbodies': {
    // From: http://api.resourcewatch.org/v1/dataset/098b3d64-3679-4448-bf05-039dc0224dd5?includes=layer
    label: 'Wetlands and Waterbodies',
    description: 'Types of large-scale wetland distributions and important wetland complexes.',
    group: 'land-use',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://api.resourcewatch.org/v1/layer/788d0990-a22d-4519-9041-e99641f84d86/tile/gee/{z}/{x}/{y}',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'basic',
      items: [
        {
          name: 'Lakes',
          color: '#a6cee3',
        },
        {
          name: 'Reservoirs',
          color: '#1f78b4',
        },
        {
          name: 'Rivers',
          color: '#08306b',
        },
        {
          name: 'Freshwater Marsh, Floodplain',
          color: '#b2df8a',
        },
        {
          name: 'Swamp Forest, Flooded Forest',
          color: '#33a02c',
        },
        {
          name: 'Coastal Wetland',
          color: '#fb9a99',
        },
        {
          name: 'Pan, Brackish/Saline Wetland',
          color: '#e31a1c',
        },
        {
          name: 'Bog, Fen, Mire (Peatland)',
          color: '#fdbf6f',
        },
        {
          name: 'Intermittent Wetland/Lake',
          color: '#ff7f00',
        },
        {
          name: '50-100% Wetland',
          color: '#cab2d6',
        },
        {
          name: '25-50% Wetland',
          color: '#6a3d9a',
        },
        {
          name: 'Wetland Compex (0-25% Wetland)',
          color: '#b15928',
        },
      ],
    },
    info: {
      datasetName: 'Wetlands',
      downloadLink: 'https://www.worldwildlife.org/pages/global-lakes-and-wetlands-database',
      function:
        'Large-scale wetland distributions and important wetland complexes, including areas of marsh, fen, peatland, and water',
      geoCoverage: 'Global',
      spatialResolution: '30 arc seconds',
      contentDate: '2004',
      description:
        'This data set estimates large-scale wetland distributions and important wetland complexes, including areas of marsh, fen, peatland, and water (Lehner and Döll 2004). Large rivers are also included as wetlands (lotic wetlands); it is assumed that only a river with adjacent wetlands (floodplain) is wide enough to appear as a polygon on the coarse-scale source maps. Wetlands are a crucial part of natural infrastructure as they help protect water quality, hold excess flood water, stabilize shoreline, and help recharge groundwater (Beeson and Doyle 1995, Stuart and Edwards 2006). Limited by sources, the data set refers to lakes as permanent still-water bodies (lentic water bodies) without direct connection to the sea, including saline lakes and lagoons as lakes, while excluding intermittent or ephemeral water bodies. Lakes that are manmade are explicitly classified as reservoirs. The Global Lakes and Wetlands Database combines best available sources for lakes and wetlands on a global scale. This data set includes information on large lakes (area ≥ 50 km2) and reservoirs (storage capacity ≥ 0.5 km3), permanent open water bodies (surface area ≥ 0.1 km2), and maximum extent and types of wetlands. Soils Revealed shows only a subset of the data set.',
      cautions:
        'The extent of wetlands and lakes may vary seasonally, and thus this data set may not match real-world extents. The data set provides an estimate of maximum extents of wetlands and identifies large-scale wetland distribution and important wetland complexes.',
      sources: ['McGill University (McGill)', 'World Wildlife Fund (WWF)'],
      citation:
        'Lehner, B. and Döll, P. 2004. "Development and validation of a global database of lakes, reservoirs and wetlands." Journal of Hydrology 296/1-4: 1-22.',
      license: 'Restrictions apply',
      licenseLink: 'http://www.wwfus.org/science/data.cfm',
    },
  },
  'urban-area': {
    // From: https://api.resourcewatch.org/v1/dataset/dbca28fe-d6bf-464f-9f86-fc8b1d81e381?includes=layer
    label: 'Urban Built-Up Area',
    description:
      'Built-up areas represent the presence of structures on any land. Data shown represents: the global built-up area before 1975, from 1975 to 1990, 1990 - 2000 and 2000 - 2014.',
    group: 'land-use',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://api.resourcewatch.org/v1/layer/a4055dea-8762-4c2d-b7ba-a3e616a97b41/tile/gee/{z}/{x}/{y}',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'choropleth',
      items: [
        {
          name: '<1975',
          color: '#ff0000',
          id: 0,
        },
        {
          name: '1975-1990',
          color: '#ff7f00',
          id: 1,
        },
        {
          name: '1990-2000',
          color: '#ffff00',
          id: 2,
        },
        {
          name: '2000-2014',
          color: '#f7f7f7',
          id: 3,
        },
      ],
    },
    info: {
      datasetName: 'Urban Built-Up Area',
      downloadLink: 'https://ghsl.jrc.ec.europa.eu/download.php?ds=bu',
      function: 'Identifies areas of gross tree cover loss',
      geoCoverage: 'Global measure of built-up presence between 1975 and 2014',
      spatialResolution: '30 m',
      contentDate: '1975-2014',
      description:
        "### Overview  \n  \nThe Global Human Settlement (GHS) built-up dataset provides a global estimation of built-up area between 1975 and 2014. It is available for four time periods: 1975, 1975-1990, 1990-2000, and 2000-2014. Built-up areas represent any urbanized regions containing man-made structures, like buildings. The dataset is based on Landsat imaging and analyzed using a model. The data is available at 30 m, 250 m and 1 km resolution in the source dataset. The 30 m version of the data is displayed here. \n  \n  \nGHS built-up dataset was released by the European Commission's Joint Research Centre (EC JRC). This dataset provides an insight into the human presence on Earth. It is important to understand the pattern of cities' growth. It is projected that 68% of the world’s population will live in urban areas by 2050. This information can help governments create more sustainable urbanization policies and have a more long-term plan for urban growth in the future.  \n  \n  \n### Methodology  \n  \nThe data was produced by processing 33,202 satellite images using the Symbolic Machine Learning (SML) method. Each year corresponded to a different source of Landsat data, GLS 1975, GLS 1990, GLS 2000, and ad hoc Landsat 8 collection 2013/2014. The image data records collected by different satellite sensors between 1975 and 2014 were classified and automatically selected if they corresponded to a built-up structure. The information was analyzed using the GHS built-up model. The model utilized algorithms to extract patterns and determine the spatial size of the building surface area. It analyzed knowledge from large amounts of spatial data, and the availability of open and free image data input, to identify areas of the planet with high densities of built-up areas. This dataset was an improved version from the 2015 GHS built-up dataset. It used an improved image processing workflow that allowed for the detection of more built-up areas and reduced the amount of false identifications of built-up areas in the final classification. For the full documentation, please see the source [methodology](https://ghsl.jrc.ec.europa.eu/data.php).  \n  \n### Disclaimer  \n  \nExcerpts of this description page were taken from the source metadata.",
      cautions:
        'There was a lack of image data from the 1975 collection, which led to unstable classification in some geographies. This error in classification was particularly apparent in places with an abundance of vegetation, regardless of being inside or outside urban areas. The 1975 results need to be interpreted with caution.\n  \n  \nThere was a saturation of information in built-up areas greater than about 10 pixels (300 m). The electromagnetic radiation data from satellite images that was used as the primary source for the built-up area classification prioritized urban structures and had less focus on urban area morphology or texture. Therefore, the classification between built-up and roads that are in close proximity to each other are expected to be rather inconsistent. However, the latest improvement in the learning data set might reduce these errors to some extent.',
      sources: ['European Commission Joint Research Centre (EC JRC)'],
      citation:
        'Corbane, Christina; Florczyk, Aneta; Pesaresi, Martino; Politis, Panagiotis; Syrris, Vasileios (2018): GHS built-up grid, derived from Landsat, multitemporal (1975-1990-2000-2014), R2018A. European Commission, Joint Research Centre (JRC) doi: 10.2905/jrc-ghsl-10007 PID: http://data.europa.eu/89h/jrc-ghsl-10007.',
      license: 'Creative Commons Attribution 4.0 International',
      licenseLink: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  population: {
    // From: https://api.resourcewatch.org/v1/dataset/b6ceb159-efd8-42de-9c6a-d658801d8922?includes=layer
    label: 'Population',
    description:
      'The distribution and density of population, expressed as the number of people per 250 m grid cell. Legend displays people per square kilometer.',
    group: 'others',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: (year = 2015) => {
        const yearToTiles = {
          1975: 'https://api.resourcewatch.org/v1/layer/94946f97-a7b6-4ded-be7b-7bae63e3b892/tile/gee/{z}/{x}/{y}',
          1990: 'https://api.resourcewatch.org/v1/layer/24a8a270-bd69-4c99-bfdc-84c59ccbfaf9/tile/gee/{z}/{x}/{y}',
          2000: 'https://api.resourcewatch.org/v1/layer/3e3534ae-6052-4dd8-9fe9-19066aa18826/tile/gee/{z}/{x}/{y}',
          2015: 'https://api.resourcewatch.org/v1/layer/2b44782c-1f20-4868-9400-c3819f49ccc8/tile/gee/{z}/{x}/{y}',
        };

        return {
          tiles: [yearToTiles[year]],
          minzoom: 2,
          maxzoom: 12,
        };
      },
    },
    legend: {
      type: 'choropleth',
      items: [
        {
          color: '#32095D',
          name: '≤25',
          id: 0,
        },
        {
          color: '#781C6D',
          name: '≤100',
          id: 1,
        },
        {
          color: '#BA3655',
          name: '≤1k',
          id: 2,
        },
        {
          color: '#ED6825',
          name: '≤5k',
          id: 3,
        },
        {
          color: '#FBB318',
          name: '≤10k',
          id: 4,
        },
        {
          color: '#FCFEA4',
          name: '>10k',
          id: 5,
        },
      ],
      timeline: {
        step: null,
        range: false,
        interval: 'years',
        dateFormat: 'YYYY',
        minDate: '1975-01-01',
        maxDate: '2015-01-01',
        marks: {
          0: '1975',
          15: '',
          25: '',
          40: '2015',
        },
      },
    },
    info: {
      datasetName: 'Population (Grid, 250 m)',
      downloadLink:
        'http://cidportal.jrc.ec.europa.eu/ftp/jrc-opendata/GHSL/GHS_POP_GPW4_GLOBE_R2015A/',
      function:
        'Distribution and density of population, expressed as the number of people per 250 m cell',
      geoCoverage: 'Global',
      spatialResolution: '250 m',
      contentDate: '1975, 1990, 2000, 2015',
      description:
        'The European Commission Joint Research Centre (EC JRC) and the Columbia University Earth Institute Center for International Earth Science Information Network (CIESIN) created a 250-meter resolution population grid. Residential population estimates for 1975, 1990, 2000 and 2015 were generated by disaggregating census or administrative unit population data and re-mapping them to grid cells.   \n  \nThe distribution and density of built-up area (from the Global Human Settlement Layer) informed the re-mapping of the population data. The model used raster-based density mapping relying on the Global Human Settlement – Built-Up Area data to define the distribution of people and inform the respective density. The Built-Up grid is the distribution of built-up areas displayed as the proportion of occupied area within each cell. Population estimates came from country-based census data and administrative polygons with estimated residential populations. Population grids were created using a volume-preserving density mapping approach: given population data and built-up area data:   \n  \nA. If the polygon generates 250 meter cells and contains built-up area data, disaggregate the population in proportion to density of built-up area;   \n  \nB. If the polygon generates 250-meter cells and does not contain built-up area data, disaggregate the population using areal weighting;   \n  \nC. If the polygon does not generate its own 250-meter cell, convert polygon to point (centroid within), sum al points within a cell, and sum to a mosaic of A and B.    \n  \nOption C was required because some populated source zones (polygons) were smaller than a 250 x 250 meter cell. This process preserved the full resolution of the Gridded Population of the World data set. All data came from the respective years. For access to the full data set and additional information, see the Learn More link.',
      cautions:
        'For 1975, greater uncertainties in estimating small-scale populations farther from the census year combine with larger difficulties in mapping built-up (from lower-resolution Landsat MSS sensor) to make this surface less reliable. A consequence of C-points is the allocation of population from these (typically small) polygons to only one cell, and occasionally a slight displacement of population to neighboring 250 m cells. Quality control was conducted to ensure that all input population was disaggregated and totals were preserved.',
      sources: [
        'European Commission Joint Research Centre (EC JRC)',
        'Columbia University Earth Institute Center for International Earth Science Information Network (CIESIN)',
      ],
      citation:
        'European Commission, Joint Research Centre (JRC); and Columbia University, Center for International Earth Science Information Network (CIESIN). 2015. "GHS Population Grid, Derived from GPW4, Multitemporal (1975, 1990, 2000, 2015)." Dataset. pid: http://data.europa.eu/89h/jrc-ghsl-ghs_pop_gpw4_globe_r2015a.',
      license: 'Attribution required',
      licenseLink: 'http://ec.europa.eu/info/legal-notice_en',
    },
  },
  'tree-biomass': {
    // From: https://api.resourcewatch.org/v1/dataset/81c802aa-5feb-4fbe-9986-8f30c0597c4d?includes=layer
    label: 'Tree biomass carbon density',
    description:
      'Carbon density of woody biomass that is above ground and living, measured in megagrams of carbon per hectare (Mg C/ha).',
    group: 'others',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://storage.googleapis.com/wri-public/biomass/global/2017/v2/30/{z}/{x}/{y}.png',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'gradient',
      items: [
        {
          color: '#895122',
          value: '0',
        },
        {
          color: '#957F4F',
          name: '',
        },
        {
          color: '#9DB38A',
          name: '',
        },
        {
          color: '#39A401',
          value: '480 t Ha⁻¹',
        },
      ],
    },
    decodeParams: {},
    decodeFunction: `
      float intensity = color.b * 255.;
      alpha = color.b;
      color.r = (255. - intensity) / 255.;
      color.g = 128. / 255.;
      color.b = 0.;
    `,
    info: {
      datasetName: 'Aboveground live woody biomass density',
      downloadLink: 'http://data.globalforestwatch.org/datasets/8f93a6f94a414f9588ce4657a39c59ff_1',
      function: 'Shows carbon density values of aboveground live woody biomass',
      geoCoverage: 'Global',
      spatialResolution: '0.00025 × 0.00025 degrees',
      contentDate: '2000',
      description:
        '- This work generated a global-scale, wall-to-wall map of aboveground biomass (AGB) at approximately 30-meter resolution. This data product expands on the methodology presented in Baccini et al. (2012) to generate a global map of aboveground live woody biomass density (megagrams biomass ha-1) at 0.00025-degree (approximately 30-meter) resolution for the year 2000. Aboveground biomass was estimated for more than seven hundred-thousand quality-filtered Geoscience Laser Altimeter System (GLAS) lidar observations using allometric equations that estimate AGB based on lidar-derived canopy metrics. Forty-seven allometric equations were compiled from more than 20 scientific publications, with each equation developed for a different region and forest type. The most appropriate equation was determined for each shot, accounting for land cover, burned status, and Terrestrial Ecoregion of the World (TEOW) ecoregion data (Olson et al. 2001) for each shot. The equations were applied to the GLAS data, generating an AGB estimate for each shot in the global GLAS dataset. A subset of shots was classified as zero-biomass based on GLAS data and tree canopy cover and were assigned an AGB of 0 Mg ha-1.  \n - The global set of GLAS AGB estimates was used to train random forest models that predict AGB based on spatially continuous data. The predictor datasets include Landsat 7 Enhanced Thematic Mapper Plus (ETM+) top-of-atmosphere reflectance and tree canopy cover from the Global Forest Change version 1.2 dataset (Hansen et al. 2013), 1 arc-second SRTM V3 elevation (Farr et al. 2007), GTOPO30 elevation from the U. S. Geological Survey (for latitudes greater than 60° N), and WorldClim climate data (Hijmans et al. 2005). The predictor pixel values were extracted and aggregated for each GLAS footprint in order link the GLAS AGB estimates with the predictor data. A random forest model was trained for each of six continental-scale regions: the Nearctic, Neotropic, Palearctic, Afrotropic, Tropical Asia, and Australia regions. The six regions were delineated based on aggregations of TEOW ecoregions. The predictor layers were stacked (the elevation and climate layers were resampled to match the 30-meter resolution of the Landsat inputs), and each random forest model was applied to all pixels within its region.  \n - The data are AGB density values (megagrams biomass/hectare); aboveground carbon density values can be estimated as 50 percent of biomass density values. In addition to the AGB density map, there is an error map for an earlier version of the AGB map. This map of the uncertainty in AGB density estimation accounts for the errors from allometric equations, the LiDAR based model, and the random forest model. The error map for the current version of the biomass density map is not available yet.',
      cautions:
        'It is recommended that both aboveground biomass density and uncertainty values be used together for biomass assessments and verification. The map will provide accurate estimates of aboveground biomass stock and aboveground biomass density when aggregated to large areas (5,000 to 10,000 ha) for project and regional level assessments. The biomass density value of a single pixel may have large uncertainty when compared with small plots for verification. The uncertainty map currently available is from an earlier version of the biomass density map.',
      sources: ['Woods Hole Research Center'],
      citation: 'Woods Hole Research Center. Unpublished data.',
      license: 'Creative Commons CC BY 4.0',
      licenseLink: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  'biodiversity-intactness': {
    // From: http://api.resourcewatch.org/v1/dataset/0e565ddf-74fd-4f90-a6b8-c89d747a89ab?includes=layer
    label: 'Biodiversity Intactness',
    description:
      'Average proportion of natural biodiversity remaining in local ecosystems in 2005. Green areas are those within safe limits for biodiversity, and red areas are those beyond proposed safe limits.',
    group: 'others',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://api.resourcewatch.org/v1/layer/70e900f1-2c37-470d-9367-7b34567e3084/tile/gee/{z}/{x}/{y}',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'choropleth',
      items: [
        {
          name: '≤60',
          color: '#a50026',
          id: 0,
        },
        {
          name: '≤70',
          color: '#d73027',
          id: 1,
        },
        {
          name: '≤75',
          color: '#f46d43',
          id: 2,
        },
        {
          name: '≤80',
          color: '#fdae61',
          id: 3,
        },
        {
          name: '≤85',
          color: '#fee08b',
          id: 4,
        },
        {
          name: '≤90',
          color: '#d9ef8b',
          id: 5,
        },
        {
          name: '≤95',
          color: '#a6d96a',
          id: 6,
        },
        {
          name: '≤97.5',
          color: '#66bd63',
          id: 7,
        },
        {
          name: '≤100',
          color: '#1a9850',
          id: 8,
        },
        {
          name: '>100',
          color: '#006837',
          id: 9,
        },
      ],
    },
    info: {
      datasetName: 'Biodiversity Intactness',
      downloadLink:
        'http://data.nhm.ac.uk/dataset/global-map-of-the-biodiversity-intactness-index-from-newbold-et-al-2016-science',
      function:
        'Modeled average abundance of originally present species, relative to their abundance in an intact ecosystem after land use change or human impacts',
      geoCoverage: 'Global',
      spatialResolution: '1 km',
      contentDate: '2005',
      description:
        '### Overview  \n  \nThe biodiversity intactness map shows global estimates of how land use pressures have affected the numbers of species and individuals found in an area. This data is important because if biodiversity loss goes unchecked, it will undermine efforts toward long-term sustainable development. The data, created by [Newbold et al. (2016)](https://science.sciencemag.org/content/353/6296/288), represents intactness in 2005 at a 1 kilometer resolution.   \n  \n### Methodology  \n  \nThe Biodiversity Intactness dataset shows global estimates of how land use pressures have affected the numbers of species and individuals found in samples from local terrestrial ecological assemblages. The map represents the average losses of originally present species. The datasets used 2,382,624 data points from the Projecting Responses of Ecological Diversity in Changing Terrestrial Systems (PREDICTS) database, a global database of how local terrestrial biodiversity responds to human impacts. The map modeled how richness and abundance respond to land use pressures. The models included 4 pressure variables—land use, land use intensity, human population density, and proximity to the nearest road. The values of the response variables were expressed relative to an intact assemblage undisturbed by humans. For the full documentation, please see the source [methodology](https://science.sciencemag.org/content/353/6296/288).  \n  \n### Disclaimer  \n  \nExcerpts of this description page were taken from the source metadata.',
      cautions:
        'The models suggested a generally smaller impact of land use on the Biodiversity Intactness Index (BII) than that found in a previous study. The latter model may have overestimated the BII by ignoring lagged responses and using sites that often have experienced some human impact as baselines. The density of sampling is inevitably uneven; biomes that are particularly underrepresented, including boreal forests, tundra, flooded grasslands, and savannas and mangroves, produce fewer confidence results. The data is likely to underrepresent soil and canopy species.',
      sources: [
        'United Nations Environment Programme World Conservation Monitoring Centre (UNEP-WCMC)',
        'University College London (UCL)',
        'Natural History Museum (NHM)',
        'Imperial College London (Imperial)',
        'Commonwealth Scientific and Industrial Research Organisation, Canberra (CSIRO)',
        'Luc Hoffmann Institute',
        'University of Copenhagen (UCPH)',
        'University of Sussex (Sussex)',
      ],
      citation:
        'Newbold, Tim, Lawrence N. Hudson, Andrew P. Arnell, Sara Contu, et al. 2016. "Dataset: Global Map of the Biodiversity Intactness Index." In Tim Newbold et al., "Has Land Use Pushed Territorial Biodiversity beyond the Planetary Boundary? A Global Assessment." Science 353 (2016): 288-89. [http://dx.doi.org/10.5519/0009936](http://dx.doi.org/10.5519/0009936).',
      license: 'Creative Commons Attribution 4.0 International',
      licenseLink: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  'erosion-risk': {
    // From: http://api.resourcewatch.org/v1/dataset/dc5db1e0-12bb-4d4d-b84f-37fa492060b6?includes=layer
    label: 'Erosion Risk',
    description:
      'Estimates of soil loss from rainfall and runoff on a scale from 1 to 5. A value of 1 indicates a low risk of erosion and 5 indicates a high risk of erosion.',
    group: 'others',
    attributions: ['rw'],
    config: {
      type: 'raster',
      source: {
        tiles: [
          'https://api.resourcewatch.org/v1/layer/b8c8ecd0-faab-4555-b9c0-d397e5450a33/tile/gee/{z}/{x}/{y}',
        ],
        minzoom: 2,
        maxzoom: 12,
      },
    },
    legend: {
      type: 'choropleth',
      items: [
        {
          color: '#ffffd4',
          name: 'Low',
          id: 0,
        },
        {
          color: '#fed98e',
          name: 'Low - Medium',
          id: 1,
        },
        {
          color: '#fe9929',
          name: 'Medium',
          id: 2,
        },
        {
          color: '#d95f0e',
          name: 'Medium - High',
          id: 3,
        },
        {
          color: '#993404',
          name: 'High',
          id: 4,
        },
      ],
    },
    info: {
      datasetName: 'Erosion Risk',
      downloadLink: 'http://water.globalforestwatch.org/map/',
      function: 'Erosion risk from sheet and rill erosion from rainfall and associated runoff.',
      geoCoverage: 'Global',
      spatialResolution: '15 arc seconds',
      contentDate: '2015',
      description:
        'This layer shows the risk of erosion around the world, from low to high. Erosion and sedimentation by water involves the process of detachment, transport, and deposition of soil particles, driven by forces from raindrops and water flowing over the land surface. Because soil erosion is difficult to measure at large scales, soil erosion models are crucial estimation tools to extrapolate limited data to other localities and conditions. The Revised Universal Soil Loss Equation (RUSLE), which predicts annual soil loss from rainfall and runoff, is the most common model used at large spatial scales due to its relatively simple structure and empirical basis. The model takes into account rainfall erosivity, topography, soil erodibility, land cover and management, and conservation practices. Because the RUSLE model was developed based on agricultural plot scale and parameterized for environmental conditions in the USA, modifications of the methods and data inputs are necessary to make the equation applicable to the globe. We estimated erosion potential based on the RUSLE model, adjusted to extend its applicability to a global scale. Conservation practices and topography information were not included in this model to calculate global erosion potential, due to data limitation and their relatively minor contribution to the variation in soil erosion at the continental to global scale compared to other factors. The result of the global model was categorized into five quantiles, corresponding to low to high erosion risks.',
      cautions:
        'The RUSLE model was originally developed to be applicable on the agriculture plot scale and was parameterized for environmental conditions of the USA. The application of the model at a global scale may contain uncertainly and overestimation compared to available observed data, especially for tropical regions, polar climate zones, and high mountainous regions. Adjustments to the model (see below) have improved its global applicability, especially for mountainous regions, but does not eliminate bias and uncertainty of the model. The accuracy of this layer has not been assessed. The model does not account for sediment deposition or sediment transport.',
      sources: ['World Resources Institute (WRI)'],
      citation: 'World Resources Institute. 2016. "Erosion." Global Forest Watch Water.',
      license: 'Creative Commons Attribution 4.0 International',
      licenseLink: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
};

export const LAYER_GROUPS = {
  'land-use': 'Land use',
  others: 'Other layers',
};

export const ATTRIBUTIONS = {
  rw:
    'Powered by <a href="https://resourcewatch.org/" target="_blank" rel="noopener noreferrer">Resource Watch</a>',
};
