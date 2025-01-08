FROM node:lts-alpine
WORKDIR /var/www
ARG ENV_FILE
COPY package.json .
COPY ${ENV_FILE} ./.env
RUN npm install --quiet
COPY . .
EXPOSE 3000
CMD source .env && npm run dev
