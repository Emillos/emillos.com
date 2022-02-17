FROM node:16-alpine as buildPhase
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN node scripts/generateFooterData.js
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=buildphase /app/public /usr/share/nginx/html
