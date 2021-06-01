#!/usr/bin/env bash

yarn_build () {
  echo -e "Using: $(cat .env)"
  source /root/.nvm/nvm.sh
  echo -e "Preparing .env file"
<<<<<<< HEAD
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
AIRTABLE_API_KEY=$AIRTABLE_API_KEY\n\
AIRTABLE_USER_ID=$AIRTABLE_USER_ID" >> .env
=======
  echo -e "PORT=$PORT\nMAPBOX_API_KEY=$MAPBOX_API_KEY\nAPI_URL=$API_URL\nANALYSIS_API_URL=$ANALYSIS_API_URL\nGOOGLE_ANALYTICS_KEY=$GOOGLE_ANALYTICS_KEY\nAWS_REGION=$AWS_REGION\nAWS_BUCKET_NAME=$AWS_BUCKET_NAME\nAWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID\nAWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY\nAWS_MAX_Z_TILE_STORAGE=$AWS_MAX_Z_TILE_STORAGE\nAIRTABLE_API_KEY=$AIRTABLE_API_KEY\nAIRTABLE_USER_ID=$AIRTABLE_USER_ID
AIRTABLE_USER_ID=appxk8DlJHtQA4qi4" >> .env
>>>>>>> updates in user recruitment  modal
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

