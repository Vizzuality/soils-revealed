FROM node:14.21-bullseye-slim

# Source: https://www.kabisa.nl/tech/nvm-in-docker/
# docker build --force-rm --no-cache -t soils-revealed:latest .
# docker run -p3001:3001 --env-file .env soils-revealed:latest

SHELL ["/bin/bash","-l","-c"]
ENV DEBIAN_FRONTEND noninteractive

RUN apt update \
    && apt install -y tini curl python2 python-is-python2 make gcc g++ \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /soils-revealed
WORKDIR /soils-revealed
COPY . .

RUN npm install -g pm2
RUN yarn install --frozen-lockfile

RUN DEPLOYMENT_KEY=$(date +%s) && echo  "DEPLOYMENT_KEY=$DEPLOYMENT_KEY" > .env

ENTRYPOINT ["/usr/bin/tini","-g","--"]
CMD ["/soils-revealed/run.sh","production"]
