FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@latest && \
    npm install && \
    npm audit fix --force

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
