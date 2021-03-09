#!/usr/bin/env bash

yarn_build () {
  echo -e "Using: $(cat .env)"
  source /root/.nvm/nvm.sh
  echo -e "Preparing .env file"
  echo -e "PORT=$NODE_PORT\nMAPBOX_API_KEY=$MAPBOX_API_KEY\nAPI_URL=$API_URL\nANALYSIS_API_URL=$ANALYSIS_API_URL\nGOOGLE_ANALYTICS_KEY=$GOOGLE_ANALYTICS_KEY\nAWS_REGION=$AWS_REGION\nAWS_BUCKET_NAME=$AWS_BUCKET_NAME\nAWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID\nAWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY\nAWS_MAX_Z_TILE_STORAGE=$AWS_MAX_Z_TILE_STORAGE" >> .env
  echo -e "Initiating yarn build"
  
  yarn build

}


case "$1" in
  production)
      yarn_build
      exec pm2 start --no-daemon yarn -- start
      ;;
  develop)
      yarn_build
      exec node index.js
      ;;
  *)
      echo >&2 "Invalid option: $@ \n either production or develop"; exit 1
      ;;
esac
#node index.js
#yarn start
#exec pm2 start --no-daemon yarn -- start
 
