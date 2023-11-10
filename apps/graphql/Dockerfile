FROM node:20-alpine

RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run generate
RUN npm run build
COPY ./dist .
EXPOSE 3000
CMD [ "npm", "run", "start"]



