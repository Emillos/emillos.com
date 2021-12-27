FROM node:16-alpine as buildPhase
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN node scripts/generateFooterData.js
RUN npm run build

FROM nginx
EXPOSE 80
COPY --from=buildPhase /app/public /usr/share/nginx/html
