FROM node:14

WORKDIR /app/backend

COPY package*.json ./

COPY . .

RUN npm install
RUN npm run build:prod

EXPOSE 3000

CMD ["node","./build/index.js"]