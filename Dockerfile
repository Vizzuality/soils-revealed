FROM docker.io/debian:stable-slim@sha256:a939c03c4d3e3f53e3ef4ef6e75cb681a3ad56537842f95bf89755da86559b13

# Source: https://www.kabisa.nl/tech/nvm-in-docker/
# docker build --force-rm --no-cache -t soils-revealed:latest .
# docker run -p3001:3001 --env-file .env soils-revealed:latest

SHELL ["/bin/bash","-l","-c"] 
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update \
    && apt-get install -y tini curl \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /soils-revealed
WORKDIR /soils-revealed
COPY . .

RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
RUN nvm install && nvm use
RUN echo -e "Implementing node: $(node --version)\nFrom: $(which node)"

RUN npm install -g yarn
RUN npm install -g pm2
RUN yarn install --frozen-lockfile

RUN DEPLOYMENT_KEY=$(date +%s) && echo  "DEPLOYMENT_KEY=$DEPLOYMENT_KEY" > .env

ENTRYPOINT ["/usr/bin/tini","-g","--"]
CMD ["/soils-revealed/run.sh","production"]
