#!/usr/bin/env bash

yarn_build () {
  echo -e "Using: $(cat .env)"
  source /root/.nvm/nvm.sh
  echo -e "Preparing .env file"
  echo -e "PORT=$PORT\n\
MAPBOX_API_KEY=$MAPBOX_API_KEY\n\
API_URL=$API_URL\n\
ANALYSIS_API_URL=$ANALYSIS_API_URL\n\
GOOGLE_ANALYTICS_KEY=$GOOGLE_ANALYTICS_KEY\n\
AWS_REGION=$AWS_REGION\n\
AWS_BUCKET_NAME=$AWS_BUCKET_NAME\n\
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID\n\
AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY\n\
AWS_MAX_Z_TILE_STORAGE=$AWS_MAX_Z_TILE_STORAGE\n\
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

