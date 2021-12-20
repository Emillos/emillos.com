FROM node:16-alpine as buildPhase
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=buildPhase /app/public /usr/share/nginx/html
